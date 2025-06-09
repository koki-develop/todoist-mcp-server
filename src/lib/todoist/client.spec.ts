import { beforeEach, describe, expect, mock, test } from "bun:test";
import { TodoistClient } from "./client";
import type {
  CreateProjectParams,
  CreateTaskParams,
  GetTasksParams,
  Project,
  Task,
  UpdateProjectParams,
  UpdateTaskParams,
} from "./types";

/**
 * Factory function for creating mock Project objects with sensible defaults.
 * Useful for reducing test boilerplate and focusing on test-specific data.
 */
function createMockProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "1",
    name: "Test Project",
    color: "blue",
    childOrder: 1,
    isArchived: false,
    isDeleted: false,
    isFavorite: false,
    isFrozen: false,
    canAssignTasks: true,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    viewStyle: "list",
    defaultOrder: 1,
    description: "",
    isCollapsed: false,
    isShared: false,
    url: "https://todoist.com/project/1",
    parentId: null,
    inboxProject: false,
    ...overrides,
  };
}

/**
 * Factory function for creating mock Task objects with sensible defaults.
 * Useful for reducing test boilerplate and focusing on test-specific data.
 */
function createMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "1",
    userId: "user123",
    content: "Test Task",
    description: "",
    projectId: "1",
    sectionId: null,
    parentId: null,
    addedByUid: null,
    assignedByUid: null,
    responsibleUid: null,
    childOrder: 1,
    labels: [],
    priority: 1,
    due: null,
    url: "https://todoist.com/task/1",
    noteCount: 0,
    checked: false,
    addedAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    completedAt: null,
    duration: null,
    dayOrder: 1,
    deadline: null,
    isDeleted: false,
    isCollapsed: false,
    ...overrides,
  };
}

// Mock the entire TodoistApi with all required methods
const mockTodoistApi = {
  getProjects: mock(),
  getProject: mock(),
  addProject: mock(),
  updateProject: mock(),
  deleteProject: mock(),
  getTasks: mock(),
  getTask: mock(),
  addTask: mock(),
  updateTask: mock(),
  deleteTask: mock(),
  closeTask: mock(),
  reopenTask: mock(),
};

// Mock the @doist/todoist-api-typescript module to return our mock API
mock.module("@doist/todoist-api-typescript", () => ({
  TodoistApi: mock(() => mockTodoistApi),
}));

describe("TodoistClient", () => {
  const client = new TodoistClient("test-api-token");

  // Reset all mocks between tests to ensure test isolation
  beforeEach(() => {
    mockTodoistApi.getProjects.mockClear();
    mockTodoistApi.getProject.mockClear();
    mockTodoistApi.addProject.mockClear();
    mockTodoistApi.updateProject.mockClear();
    mockTodoistApi.deleteProject.mockClear();
    mockTodoistApi.getTasks.mockClear();
    mockTodoistApi.getTask.mockClear();
    mockTodoistApi.addTask.mockClear();
    mockTodoistApi.updateTask.mockClear();
    mockTodoistApi.deleteTask.mockClear();
    mockTodoistApi.closeTask.mockClear();
    mockTodoistApi.reopenTask.mockClear();
  });

  describe("getProjects", () => {
    test("should return all projects with automatic pagination", async () => {
      // Setup: Create mock projects for multi-page response
      const mockProject1 = createMockProject({ id: "1", name: "Project 1" });
      const mockProject2 = createMockProject({
        id: "2",
        name: "Project 2",
        color: "red",
        isFavorite: true,
        viewStyle: "board",
      });

      // Mock paginated API responses
      mockTodoistApi.getProjects
        .mockResolvedValueOnce({
          results: [mockProject1],
          nextCursor: "cursor1",
        })
        .mockResolvedValueOnce({ results: [mockProject2], nextCursor: null });

      const projects = await client.getProjects();

      // Verify: All projects collected from multiple pages
      expect(projects).toEqual([mockProject1, mockProject2]);
      expect(mockTodoistApi.getProjects).toHaveBeenCalledTimes(2);
      expect(mockTodoistApi.getProjects).toHaveBeenNthCalledWith(1, {
        cursor: null,
      });
      expect(mockTodoistApi.getProjects).toHaveBeenNthCalledWith(2, {
        cursor: "cursor1",
      });
    });

    test("should handle single page response", async () => {
      const mockProject = createMockProject({
        name: "Single Project",
        color: "green",
      });

      // Mock single-page response (no nextCursor)
      mockTodoistApi.getProjects.mockResolvedValueOnce({
        results: [mockProject],
        nextCursor: null,
      });

      const projects = await client.getProjects();

      // Verify: Only one API call made
      expect(projects).toEqual([mockProject]);
      expect(mockTodoistApi.getProjects).toHaveBeenCalledTimes(1);
    });
  });

  describe("getProject", () => {
    test("should return a specific project", async () => {
      const mockProject = createMockProject({
        id: "123",
        isFavorite: true,
        description: "A test project",
      });

      mockTodoistApi.getProject.mockResolvedValueOnce(mockProject);

      const project = await client.getProject("123");

      expect(project).toEqual(mockProject);
      expect(mockTodoistApi.getProject).toHaveBeenCalledWith("123");
    });
  });

  describe("createProject", () => {
    test("should create a project with all parameters", async () => {
      // Setup: Full parameter set for project creation
      const params: CreateProjectParams = {
        name: "New Project",
        parentId: "parent123",
        color: "red",
        isFavorite: true,
        viewStyle: "board",
      };

      const mockCreatedProject = createMockProject({
        id: "new123",
        name: "New Project",
        color: "red",
        isFavorite: true,
        viewStyle: "board",
        parentId: "parent123",
      });

      mockTodoistApi.addProject.mockResolvedValueOnce(mockCreatedProject);

      const project = await client.createProject(params);

      // Verify: Parameters passed through correctly
      expect(project).toEqual(mockCreatedProject);
      expect(mockTodoistApi.addProject).toHaveBeenCalledWith(params);
    });

    test("should create a project with minimal parameters", async () => {
      // Setup: Only required parameter (name)
      const params: CreateProjectParams = { name: "Simple Project" };
      const mockCreatedProject = createMockProject({
        id: "simple123",
        name: "Simple Project",
      });

      mockTodoistApi.addProject.mockResolvedValueOnce(mockCreatedProject);

      const project = await client.createProject(params);

      // Verify: Optional parameters passed as undefined
      expect(project).toEqual(mockCreatedProject);
      expect(mockTodoistApi.addProject).toHaveBeenCalledWith({
        name: "Simple Project",
        parentId: undefined,
        color: undefined,
        isFavorite: undefined,
        viewStyle: undefined,
      });
    });
  });

  describe("updateProject", () => {
    test("should update a project", async () => {
      const params: UpdateProjectParams = {
        name: "Updated Project",
        color: "green",
        isFavorite: false,
        viewStyle: "calendar",
      };

      const mockUpdatedProject = createMockProject({
        id: "update123",
        name: "Updated Project",
        color: "green",
        isFavorite: false,
        viewStyle: "calendar",
        updatedAt: "2023-01-02T00:00:00Z",
      });

      mockTodoistApi.updateProject.mockResolvedValueOnce(mockUpdatedProject);

      const project = await client.updateProject("update123", params);

      // Verify: Update parameters and project ID passed correctly
      expect(project).toEqual(mockUpdatedProject);
      expect(mockTodoistApi.updateProject).toHaveBeenCalledWith(
        "update123",
        params,
      );
    });
  });

  describe("deleteProject", () => {
    test("should delete a project", async () => {
      mockTodoistApi.deleteProject.mockResolvedValueOnce(true);

      const result = await client.deleteProject("delete123");

      // Verify: Returns boolean success result
      expect(result).toBe(true);
      expect(mockTodoistApi.deleteProject).toHaveBeenCalledWith("delete123");
    });
  });

  describe("getTasks", () => {
    test("should return all tasks without filters", async () => {
      const mockTask1 = createMockTask({ id: "1", content: "Task 1" });
      const mockTask2 = createMockTask({
        id: "2",
        content: "Task 2",
        priority: 4,
        labels: ["urgent"],
        projectId: "2",
      });

      mockTodoistApi.getTasks.mockResolvedValueOnce({
        results: [mockTask1, mockTask2],
        nextCursor: null,
      });

      const tasks = await client.getTasks();

      expect(tasks).toEqual([mockTask1, mockTask2]);
      expect(mockTodoistApi.getTasks).toHaveBeenCalledWith({ cursor: null });
    });

    test("should return filtered tasks", async () => {
      const mockTask = createMockTask({
        id: "1",
        content: "Project Task",
        projectId: "project123",
      });

      const params: GetTasksParams = {
        projectId: "project123",
        filter: "today",
      };

      mockTodoistApi.getTasks.mockResolvedValueOnce({
        results: [mockTask],
        nextCursor: null,
      });

      const tasks = await client.getTasks(params);

      expect(tasks).toEqual([mockTask]);
      expect(mockTodoistApi.getTasks).toHaveBeenCalledWith({
        ...params,
        cursor: null,
      });
    });

    test("should handle pagination and return all tasks from multiple pages", async () => {
      const mockTask1 = createMockTask({ id: "1", content: "Task 1" });
      const mockTask2 = createMockTask({ id: "2", content: "Task 2" });
      const mockTask3 = createMockTask({ id: "3", content: "Task 3" });

      // Mock first page response
      mockTodoistApi.getTasks.mockResolvedValueOnce({
        results: [mockTask1, mockTask2],
        nextCursor: "cursor123",
      });

      // Mock second page response
      mockTodoistApi.getTasks.mockResolvedValueOnce({
        results: [mockTask3],
        nextCursor: null,
      });

      const tasks = await client.getTasks();

      expect(tasks).toEqual([mockTask1, mockTask2, mockTask3]);
      expect(mockTodoistApi.getTasks).toHaveBeenCalledTimes(2);
      expect(mockTodoistApi.getTasks).toHaveBeenNthCalledWith(1, {
        cursor: null,
      });
      expect(mockTodoistApi.getTasks).toHaveBeenNthCalledWith(2, {
        cursor: "cursor123",
      });
    });
  });

  describe("getTask", () => {
    test("should return a specific task", async () => {
      const mockTask = createMockTask({
        id: "123",
        content: "Specific Task",
        description: "A detailed task",
        priority: 3,
        labels: ["important", "work"],
      });

      mockTodoistApi.getTask.mockResolvedValueOnce(mockTask);

      const task = await client.getTask("123");

      expect(task).toEqual(mockTask);
      expect(mockTodoistApi.getTask).toHaveBeenCalledWith("123");
    });
  });

  describe("createTask", () => {
    test("should create a task with all parameters", async () => {
      const params: CreateTaskParams = {
        content: "New Task",
        description: "Task description",
        projectId: "project123",
        priority: 4,
        labels: ["urgent", "work"],
        dueString: "tomorrow",
        duration: 30,
        durationUnit: "minute",
      };

      const mockCreatedTask = createMockTask({
        id: "new123",
        content: "New Task",
        description: "Task description",
        projectId: "project123",
        priority: 4,
        labels: ["urgent", "work"],
        due: {
          string: "tomorrow",
          date: "2023-01-02",
          datetime: null,
          timezone: null,
          isRecurring: false,
        },
        duration: {
          amount: 30,
          unit: "minute",
        },
      });

      mockTodoistApi.addTask.mockResolvedValueOnce(mockCreatedTask);

      const task = await client.createTask(params);

      expect(task).toEqual(mockCreatedTask);
      expect(mockTodoistApi.addTask).toHaveBeenCalledWith(params);
    });

    test("should create a task with minimal parameters", async () => {
      const params: CreateTaskParams = { content: "Simple Task" };
      const mockCreatedTask = createMockTask({
        id: "simple123",
        content: "Simple Task",
      });

      mockTodoistApi.addTask.mockResolvedValueOnce(mockCreatedTask);

      const task = await client.createTask(params);

      expect(task).toEqual(mockCreatedTask);
      expect(mockTodoistApi.addTask).toHaveBeenCalledWith(params);
    });
  });

  describe("updateTask", () => {
    test("should update a task", async () => {
      const params: UpdateTaskParams = {
        content: "Updated Task",
        description: "Updated description",
        priority: 2,
        labels: ["updated"],
        dueDate: "2023-01-03",
      };

      const mockUpdatedTask = createMockTask({
        id: "update123",
        content: "Updated Task",
        description: "Updated description",
        priority: 2,
        labels: ["updated"],
        due: {
          string: "Jan 3",
          date: "2023-01-03",
          datetime: null,
          timezone: null,
          isRecurring: false,
        },
        updatedAt: "2023-01-02T00:00:00Z",
      });

      mockTodoistApi.updateTask.mockResolvedValueOnce(mockUpdatedTask);

      const task = await client.updateTask("update123", params);

      expect(task).toEqual(mockUpdatedTask);
      expect(mockTodoistApi.updateTask).toHaveBeenCalledWith(
        "update123",
        params,
      );
    });
  });

  describe("deleteTask", () => {
    test("should delete a task", async () => {
      mockTodoistApi.deleteTask.mockResolvedValueOnce(true);

      const result = await client.deleteTask("delete123");

      expect(result).toBe(true);
      expect(mockTodoistApi.deleteTask).toHaveBeenCalledWith("delete123");
    });
  });

  describe("closeTask", () => {
    test("should close/complete a task", async () => {
      mockTodoistApi.closeTask.mockResolvedValueOnce(true);

      const result = await client.closeTask("close123");

      expect(result).toBe(true);
      expect(mockTodoistApi.closeTask).toHaveBeenCalledWith("close123");
    });
  });

  describe("reopenTask", () => {
    test("should reopen a completed task", async () => {
      mockTodoistApi.reopenTask.mockResolvedValueOnce(true);

      const result = await client.reopenTask("reopen123");

      expect(result).toBe(true);
      expect(mockTodoistApi.reopenTask).toHaveBeenCalledWith("reopen123");
    });
  });
});
