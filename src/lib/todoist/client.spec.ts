import { beforeEach, describe, expect, mock, test } from "bun:test";
import { TodoistClient } from "./client";
import type {
  Comment,
  CreateCommentParams,
  CreateLabelParams,
  CreateProjectParams,
  CreateSectionParams,
  CreateTaskParams,
  GetSectionsParams,
  GetTasksParams,
  Label,
  Project,
  QuickAddTaskParams,
  Section,
  Task,
  UpdateCommentParams,
  UpdateProjectParams,
  UpdateSectionParams,
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

/**
 * Factory function for creating mock Section objects with sensible defaults.
 * Useful for reducing test boilerplate and focusing on test-specific data.
 */
function createMockSection(overrides: Partial<Section> = {}): Section {
  return {
    id: "1",
    userId: "user123",
    projectId: "1",
    name: "Test Section",
    sectionOrder: 1,
    addedAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
    archivedAt: null,
    isArchived: false,
    isDeleted: false,
    isCollapsed: false,
    ...overrides,
  };
}

/**
 * Factory function for creating mock Label objects with sensible defaults.
 * Useful for reducing test boilerplate and focusing on test-specific data.
 */
function createMockLabel(overrides: Partial<Label> = {}): Label {
  return {
    id: "1",
    name: "Test Label",
    color: "red",
    order: 1,
    isFavorite: false,
    ...overrides,
  };
}

/**
 * Factory function for creating mock Comment objects with sensible defaults.
 * Useful for reducing test boilerplate and focusing on test-specific data.
 */
function createMockComment(overrides: Partial<Comment> = {}): Comment {
  return {
    id: "1",
    content: "Test comment content",
    postedAt: "2023-01-01T00:00:00Z",
    postedUid: "user123",
    taskId: "task123",
    projectId: undefined,
    fileAttachment: null,
    uidsToNotify: null,
    reactions: null,
    isDeleted: false,
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
  getSections: mock(),
  getSection: mock(),
  addSection: mock(),
  updateSection: mock(),
  deleteSection: mock(),
  addLabel: mock(),
  updateLabel: mock(),
  deleteLabel: mock(),
  getLabels: mock(),
  getLabel: mock(),
  addComment: mock(),
  deleteComment: mock(),
  updateComment: mock(),
  quickAddTask: mock(),
  getComments: mock(),
  moveTasks: mock(),
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
    mockTodoistApi.getSections.mockClear();
    mockTodoistApi.getSection.mockClear();
    mockTodoistApi.addSection.mockClear();
    mockTodoistApi.updateSection.mockClear();
    mockTodoistApi.deleteSection.mockClear();
    mockTodoistApi.addLabel.mockClear();
    mockTodoistApi.updateLabel.mockClear();
    mockTodoistApi.deleteLabel.mockClear();
    mockTodoistApi.getLabels.mockClear();
    mockTodoistApi.getLabel.mockClear();
    mockTodoistApi.addComment.mockClear();
    mockTodoistApi.deleteComment.mockClear();
    mockTodoistApi.updateComment.mockClear();
    mockTodoistApi.quickAddTask.mockClear();
    mockTodoistApi.getComments.mockClear();
    mockTodoistApi.moveTasks.mockClear();
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

  describe("getSections", () => {
    test("should get sections with pagination", async () => {
      const params: GetSectionsParams = { projectId: "project123" };

      const mockSection1 = createMockSection({ id: "1", name: "Section 1" });
      const mockSection2 = createMockSection({ id: "2", name: "Section 2" });
      const mockSection3 = createMockSection({ id: "3", name: "Section 3" });

      // Mock pagination responses
      mockTodoistApi.getSections
        .mockResolvedValueOnce({
          results: [mockSection1, mockSection2],
          nextCursor: "cursor123",
        })
        .mockResolvedValueOnce({
          results: [mockSection3],
          nextCursor: null,
        });

      const sections = await client.getSections(params);

      expect(sections).toEqual([mockSection1, mockSection2, mockSection3]);
      expect(mockTodoistApi.getSections).toHaveBeenCalledTimes(2);
      expect(mockTodoistApi.getSections).toHaveBeenNthCalledWith(1, {
        projectId: "project123",
        cursor: null,
      });
      expect(mockTodoistApi.getSections).toHaveBeenNthCalledWith(2, {
        projectId: "project123",
        cursor: "cursor123",
      });
    });

    test("should get sections without pagination", async () => {
      const params: GetSectionsParams = { projectId: "project123" };
      const mockSection = createMockSection({
        id: "1",
        name: "Single Section",
      });

      mockTodoistApi.getSections.mockResolvedValueOnce({
        results: [mockSection],
        nextCursor: null,
      });

      const sections = await client.getSections(params);

      expect(sections).toEqual([mockSection]);
      expect(mockTodoistApi.getSections).toHaveBeenCalledTimes(1);
      expect(mockTodoistApi.getSections).toHaveBeenCalledWith({
        projectId: "project123",
        cursor: null,
      });
    });
  });

  describe("getSection", () => {
    test("should get a section by ID", async () => {
      const mockSection = createMockSection({
        id: "123",
        name: "Test Section",
      });

      mockTodoistApi.getSection.mockResolvedValueOnce(mockSection);

      const section = await client.getSection("123");

      expect(section).toEqual(mockSection);
      expect(mockTodoistApi.getSection).toHaveBeenCalledWith("123");
    });
  });

  describe("createSection", () => {
    test("should create a section with all parameters", async () => {
      const params: CreateSectionParams = {
        name: "New Section",
        projectId: "project123",
        order: 5,
      };

      const mockCreatedSection = createMockSection({
        id: "new123",
        name: "New Section",
        projectId: "project123",
        sectionOrder: 5,
      });

      mockTodoistApi.addSection.mockResolvedValueOnce(mockCreatedSection);

      const section = await client.createSection(params);

      expect(section).toEqual(mockCreatedSection);
      expect(mockTodoistApi.addSection).toHaveBeenCalledWith({
        name: "New Section",
        projectId: "project123",
        order: 5,
      });
    });

    test("should create a section with minimal parameters", async () => {
      const params: CreateSectionParams = {
        name: "Simple Section",
        projectId: "project123",
      };

      const mockCreatedSection = createMockSection({
        id: "simple123",
        name: "Simple Section",
        projectId: "project123",
      });

      mockTodoistApi.addSection.mockResolvedValueOnce(mockCreatedSection);

      const section = await client.createSection(params);

      expect(section).toEqual(mockCreatedSection);
      expect(mockTodoistApi.addSection).toHaveBeenCalledWith({
        name: "Simple Section",
        projectId: "project123",
        order: undefined,
      });
    });
  });

  describe("updateSection", () => {
    test("should update a section", async () => {
      const params: UpdateSectionParams = {
        name: "Updated Section",
      };

      const mockUpdatedSection = createMockSection({
        id: "update123",
        name: "Updated Section",
        updatedAt: "2023-01-02T00:00:00Z",
      });

      mockTodoistApi.updateSection.mockResolvedValueOnce(mockUpdatedSection);

      const section = await client.updateSection("update123", params);

      expect(section).toEqual(mockUpdatedSection);
      expect(mockTodoistApi.updateSection).toHaveBeenCalledWith("update123", {
        name: "Updated Section",
      });
    });
  });

  describe("deleteSection", () => {
    test("should delete a section", async () => {
      mockTodoistApi.deleteSection.mockResolvedValueOnce(true);

      const result = await client.deleteSection("delete123");

      expect(result).toBe(true);
      expect(mockTodoistApi.deleteSection).toHaveBeenCalledWith("delete123");
    });
  });

  describe("createLabel", () => {
    test("should create a label with all parameters", async () => {
      // Setup: Full parameter set for label creation
      const params: CreateLabelParams = {
        name: "New Label",
        color: "green",
        order: 5,
        isFavorite: true,
      };

      const mockCreatedLabel = createMockLabel({
        id: "new123",
        name: "New Label",
        color: "green",
        order: 5,
        isFavorite: true,
      });

      mockTodoistApi.addLabel.mockResolvedValueOnce(mockCreatedLabel);

      const label = await client.createLabel(params);

      // Verify: Parameters passed through correctly
      expect(label).toEqual(mockCreatedLabel);
      expect(mockTodoistApi.addLabel).toHaveBeenCalledWith(params);
    });

    test("should create a label with minimal parameters", async () => {
      // Setup: Only required parameter (name)
      const params: CreateLabelParams = { name: "Simple Label" };
      const mockCreatedLabel = createMockLabel({
        id: "simple123",
        name: "Simple Label",
      });

      mockTodoistApi.addLabel.mockResolvedValueOnce(mockCreatedLabel);

      const label = await client.createLabel(params);

      // Verify: Optional parameters passed as undefined
      expect(label).toEqual(mockCreatedLabel);
      expect(mockTodoistApi.addLabel).toHaveBeenCalledWith({
        name: "Simple Label",
        color: undefined,
        order: undefined,
        isFavorite: undefined,
      });
    });

    test("should create a label with null order", async () => {
      // Setup: Explicitly null order value
      const params: CreateLabelParams = {
        name: "Null Order Label",
        order: null,
      };
      const mockCreatedLabel = createMockLabel({
        id: "null123",
        name: "Null Order Label",
        order: null,
      });

      mockTodoistApi.addLabel.mockResolvedValueOnce(mockCreatedLabel);

      const label = await client.createLabel(params);

      // Verify: Null order handled correctly
      expect(label).toEqual(mockCreatedLabel);
      expect(mockTodoistApi.addLabel).toHaveBeenCalledWith({
        name: "Null Order Label",
        color: undefined,
        order: null,
        isFavorite: undefined,
      });
    });
  });

  describe("getLabels", () => {
    test("should return all labels with automatic pagination", async () => {
      // Setup: Create mock labels for multi-page response
      const mockLabel1 = createMockLabel({ id: "1", name: "Label 1" });
      const mockLabel2 = createMockLabel({
        id: "2",
        name: "Label 2",
        color: "green",
        isFavorite: true,
        order: 2,
      });

      // Mock paginated API responses
      mockTodoistApi.getLabels
        .mockResolvedValueOnce({
          results: [mockLabel1],
          nextCursor: "cursor1",
        })
        .mockResolvedValueOnce({ results: [mockLabel2], nextCursor: null });

      const labels = await client.getLabels();

      // Verify: All labels collected from multiple pages
      expect(labels).toEqual([mockLabel1, mockLabel2]);
      expect(mockTodoistApi.getLabels).toHaveBeenCalledTimes(2);
      expect(mockTodoistApi.getLabels).toHaveBeenNthCalledWith(1, {
        cursor: null,
      });
      expect(mockTodoistApi.getLabels).toHaveBeenNthCalledWith(2, {
        cursor: "cursor1",
      });
    });

    test("should handle single page response", async () => {
      const mockLabel = createMockLabel({
        name: "Single Label",
        color: "green",
      });

      // Mock single-page response (no nextCursor)
      mockTodoistApi.getLabels.mockResolvedValueOnce({
        results: [mockLabel],
        nextCursor: null,
      });

      const labels = await client.getLabels();

      // Verify: Only one API call made
      expect(labels).toEqual([mockLabel]);
      expect(mockTodoistApi.getLabels).toHaveBeenCalledTimes(1);
    });
  });

  describe("getLabel", () => {
    test("should return a specific label", async () => {
      const mockLabel = createMockLabel({
        id: "label123",
        name: "Important",
        color: "red",
        isFavorite: true,
        order: 1,
      });

      mockTodoistApi.getLabel.mockResolvedValueOnce(mockLabel);

      const label = await client.getLabel("label123");

      expect(label).toEqual(mockLabel);
      expect(mockTodoistApi.getLabel).toHaveBeenCalledWith("label123");
    });
  });

  describe("createComment", () => {
    test("should create a comment for a task", async () => {
      const mockCreatedComment = createMockComment({
        id: "comment123",
        content: "This is a test comment",
        taskId: "task1",
        projectId: undefined,
      });

      mockTodoistApi.addComment.mockResolvedValueOnce(mockCreatedComment);

      const params: CreateCommentParams = {
        content: "This is a test comment",
        taskId: "task1",
      };

      const comment = await client.createComment(params);

      expect(comment).toEqual(mockCreatedComment);
      expect(mockTodoistApi.addComment).toHaveBeenCalledWith({
        content: "This is a test comment",
        taskId: "task1",
        projectId: undefined,
        attachment: undefined,
      });
    });

    test("should create a comment for a project", async () => {
      const mockCreatedComment = createMockComment({
        id: "comment456",
        content: "Project comment",
        taskId: undefined,
        projectId: "project1",
      });

      mockTodoistApi.addComment.mockResolvedValueOnce(mockCreatedComment);

      const params: CreateCommentParams = {
        content: "Project comment",
        projectId: "project1",
      };

      const comment = await client.createComment(params);

      expect(comment).toEqual(mockCreatedComment);
      expect(mockTodoistApi.addComment).toHaveBeenCalledWith({
        content: "Project comment",
        taskId: undefined,
        projectId: "project1",
        attachment: undefined,
      });
    });

    test("should create a comment with attachment", async () => {
      const attachment = {
        fileName: "test.pdf",
        fileUrl: "https://example.com/test.pdf",
        fileType: "application/pdf",
        resourceType: "file",
      };

      const mockCreatedComment = createMockComment({
        id: "comment789",
        content: "Comment with attachment",
        taskId: "task1",
        projectId: undefined,
        fileAttachment: {
          resourceType: "file",
          fileName: "test.pdf",
          fileUrl: "https://example.com/test.pdf",
          fileType: "application/pdf",
        },
      });

      mockTodoistApi.addComment.mockResolvedValueOnce(mockCreatedComment);

      const params: CreateCommentParams = {
        content: "Comment with attachment",
        taskId: "task1",
        attachment,
      };

      const comment = await client.createComment(params);

      expect(comment).toEqual(mockCreatedComment);
      expect(mockTodoistApi.addComment).toHaveBeenCalledWith({
        content: "Comment with attachment",
        taskId: "task1",
        projectId: undefined,
        attachment,
      });
    });
  });

  describe("deleteComment", () => {
    test("should delete a comment", async () => {
      mockTodoistApi.deleteComment.mockResolvedValueOnce(true);

      const result = await client.deleteComment("comment123");

      expect(result).toBe(true);
      expect(mockTodoistApi.deleteComment).toHaveBeenCalledWith("comment123");
    });
  });

  describe("quickAddTask", () => {
    test("should create a task with natural language input", async () => {
      const params: QuickAddTaskParams = {
        text: "Buy groceries tomorrow #shopping @urgent",
      };

      const mockCreatedTask = createMockTask({
        id: "quick123",
        content: "Buy groceries",
        projectId: "shopping-project",
        labels: ["urgent"],
        due: {
          date: "2023-01-02",
          timezone: null,
          string: "tomorrow",
          lang: "en",
          isRecurring: false,
        },
        priority: 2,
      });

      mockTodoistApi.quickAddTask.mockResolvedValueOnce(mockCreatedTask);

      const task = await client.quickAddTask(params);

      expect(task).toEqual(mockCreatedTask);
      expect(mockTodoistApi.quickAddTask).toHaveBeenCalledWith({
        text: "Buy groceries tomorrow #shopping @urgent",
        note: undefined,
        reminder: undefined,
        autoReminder: undefined,
        meta: undefined,
      });
    });

    test("should create a task with all optional parameters", async () => {
      const params: QuickAddTaskParams = {
        text: "Meeting with client next Monday at 2pm #work",
        note: "Discuss project requirements",
        reminder: "30 minutes before",
        autoReminder: true,
        meta: true,
      };

      const mockCreatedTask = createMockTask({
        id: "meeting123",
        content: "Meeting with client",
        description: "Discuss project requirements",
        projectId: "work-project",
        due: {
          date: "2023-01-09",
          datetime: "2023-01-09T14:00:00Z",
          timezone: "UTC",
          string: "next Monday at 2pm",
          lang: "en",
          isRecurring: false,
        },
        priority: 1,
      });

      mockTodoistApi.quickAddTask.mockResolvedValueOnce(mockCreatedTask);

      const task = await client.quickAddTask(params);

      expect(task).toEqual(mockCreatedTask);
      expect(mockTodoistApi.quickAddTask).toHaveBeenCalledWith({
        text: "Meeting with client next Monday at 2pm #work",
        note: "Discuss project requirements",
        reminder: "30 minutes before",
        autoReminder: true,
        meta: true,
      });
    });

    test("should create a task with priority indicators", async () => {
      const params: QuickAddTaskParams = {
        text: "Submit report by Friday !!!",
      };

      const mockCreatedTask = createMockTask({
        id: "urgent123",
        content: "Submit report",
        due: {
          date: "2023-01-06",
          timezone: null,
          string: "by Friday",
          lang: "en",
          isRecurring: false,
        },
        priority: 4, // Urgent priority
      });

      mockTodoistApi.quickAddTask.mockResolvedValueOnce(mockCreatedTask);

      const task = await client.quickAddTask(params);

      expect(task).toEqual(mockCreatedTask);
      expect(mockTodoistApi.quickAddTask).toHaveBeenCalledWith({
        text: "Submit report by Friday !!!",
        note: undefined,
        reminder: undefined,
        autoReminder: undefined,
        meta: undefined,
      });
    });

    test("should create a simple task without natural language features", async () => {
      const params: QuickAddTaskParams = {
        text: "Simple task",
        note: "Basic task without special syntax",
      };

      const mockCreatedTask = createMockTask({
        id: "simple123",
        content: "Simple task",
        description: "Basic task without special syntax",
        priority: 1,
        due: null,
      });

      mockTodoistApi.quickAddTask.mockResolvedValueOnce(mockCreatedTask);

      const task = await client.quickAddTask(params);

      expect(task).toEqual(mockCreatedTask);
      expect(mockTodoistApi.quickAddTask).toHaveBeenCalledWith({
        text: "Simple task",
        note: "Basic task without special syntax",
        reminder: undefined,
        autoReminder: undefined,
        meta: undefined,
      });
    });
  });

  describe("getTaskComments", () => {
    test("should handle multiple pages of comments", async () => {
      // Setup: Create mock comments for multi-page response
      const mockComment1 = createMockComment({
        id: "1",
        content: "First comment",
        taskId: "task123",
      });
      const mockComment2 = createMockComment({
        id: "2",
        content: "Second comment",
        taskId: "task123",
        postedAt: "2023-01-02T00:00:00Z",
        postedUid: "user456",
      });

      // Mock paginated API responses
      mockTodoistApi.getComments
        .mockResolvedValueOnce({
          results: [mockComment1],
          nextCursor: "cursor1",
        })
        .mockResolvedValueOnce({
          results: [mockComment2],
          nextCursor: null,
        });

      const comments = await client.getTaskComments("task123");

      // Verify: All comments collected from multiple pages
      expect(comments).toEqual([mockComment1, mockComment2]);
      expect(mockTodoistApi.getComments).toHaveBeenCalledTimes(2);
      expect(mockTodoistApi.getComments).toHaveBeenNthCalledWith(1, {
        taskId: "task123",
        cursor: null,
      });
      expect(mockTodoistApi.getComments).toHaveBeenNthCalledWith(2, {
        taskId: "task123",
        cursor: "cursor1",
      });
    });

    test("should handle single page response", async () => {
      const mockComment = createMockComment({
        id: "comment123",
        content: "Single comment",
        taskId: "task456",
        fileAttachment: {
          resourceType: "file",
          fileName: "document.pdf",
          fileSize: 1024,
          fileType: "application/pdf",
          fileUrl: "https://example.com/file.pdf",
        },
        reactions: {
          "👍": ["user123", "user456"],
          "🎉": ["user789"],
        },
      });

      // Mock single-page response (no nextCursor)
      mockTodoistApi.getComments.mockResolvedValueOnce({
        results: [mockComment],
        nextCursor: null,
      });

      const comments = await client.getTaskComments("task456");

      // Verify: Only one API call made
      expect(comments).toEqual([mockComment]);
      expect(mockTodoistApi.getComments).toHaveBeenCalledTimes(1);
      expect(mockTodoistApi.getComments).toHaveBeenCalledWith({
        taskId: "task456",
        cursor: null,
      });
    });

    test("should handle empty comments response", async () => {
      // Mock empty response
      mockTodoistApi.getComments.mockResolvedValueOnce({
        results: [],
        nextCursor: null,
      });

      const comments = await client.getTaskComments("task789");

      // Verify: Empty array returned
      expect(comments).toEqual([]);
      expect(mockTodoistApi.getComments).toHaveBeenCalledTimes(1);
      expect(mockTodoistApi.getComments).toHaveBeenCalledWith({
        taskId: "task789",
        cursor: null,
      });
    });
  });

  describe("getProjectComments", () => {
    test("should handle multiple pages of project comments", async () => {
      // Setup: Create mock comments for multi-page response
      const mockComment1 = createMockComment({
        id: "1",
        content: "First project comment",
        projectId: "project123",
        taskId: undefined,
      });
      const mockComment2 = createMockComment({
        id: "2",
        content: "Second project comment",
        projectId: "project123",
        taskId: undefined,
        postedAt: "2023-01-02T00:00:00Z",
        postedUid: "user456",
      });

      // Mock paginated API responses
      mockTodoistApi.getComments
        .mockResolvedValueOnce({
          results: [mockComment1],
          nextCursor: "cursor1",
        })
        .mockResolvedValueOnce({
          results: [mockComment2],
          nextCursor: null,
        });

      const comments = await client.getProjectComments("project123");

      // Verify: All comments collected from multiple pages
      expect(comments).toEqual([mockComment1, mockComment2]);
      expect(mockTodoistApi.getComments).toHaveBeenCalledTimes(2);
      expect(mockTodoistApi.getComments).toHaveBeenNthCalledWith(1, {
        projectId: "project123",
        cursor: null,
      });
      expect(mockTodoistApi.getComments).toHaveBeenNthCalledWith(2, {
        projectId: "project123",
        cursor: "cursor1",
      });
    });

    test("should handle single page project response", async () => {
      const mockComment = createMockComment({
        id: "comment123",
        content: "Single project comment",
        projectId: "project456",
        taskId: undefined,
        fileAttachment: {
          resourceType: "file",
          fileName: "project-document.pdf",
          fileSize: 2048,
          fileType: "application/pdf",
          fileUrl: "https://example.com/project-file.pdf",
        },
        reactions: {
          "👍": ["user123", "user456"],
          "📋": ["user789"],
        },
      });

      // Mock single-page response (no nextCursor)
      mockTodoistApi.getComments.mockResolvedValueOnce({
        results: [mockComment],
        nextCursor: null,
      });

      const comments = await client.getProjectComments("project456");

      // Verify: Only one API call made
      expect(comments).toEqual([mockComment]);
      expect(mockTodoistApi.getComments).toHaveBeenCalledTimes(1);
      expect(mockTodoistApi.getComments).toHaveBeenCalledWith({
        projectId: "project456",
        cursor: null,
      });
    });

    test("should handle empty project comments response", async () => {
      // Mock empty response
      mockTodoistApi.getComments.mockResolvedValueOnce({
        results: [],
        nextCursor: null,
      });

      const comments = await client.getProjectComments("project789");

      // Verify: Empty array returned
      expect(comments).toEqual([]);
      expect(mockTodoistApi.getComments).toHaveBeenCalledTimes(1);
      expect(mockTodoistApi.getComments).toHaveBeenCalledWith({
        projectId: "project789",
        cursor: null,
      });
    });
  });

  describe("updateComment", () => {
    test("should update a comment", async () => {
      const params: UpdateCommentParams = {
        content: "Updated comment content",
      };

      const mockUpdatedComment = createMockComment({
        id: "comment123",
        content: "Updated comment content",
        postedAt: "2023-01-01T12:30:00Z",
        taskId: "task456",
      });

      mockTodoistApi.updateComment.mockResolvedValueOnce(mockUpdatedComment);

      const comment = await client.updateComment("comment123", params);

      expect(comment).toEqual(mockUpdatedComment);
      expect(mockTodoistApi.updateComment).toHaveBeenCalledWith("comment123", {
        content: "Updated comment content",
      });
    });
  });

  describe("moveTasksToProject", () => {
    test("should move tasks to a different project", async () => {
      const movedTask1 = createMockTask({
        id: "task1",
        content: "Task 1",
        projectId: "project2",
      });
      const movedTask2 = createMockTask({
        id: "task2",
        content: "Task 2",
        projectId: "project2",
      });

      mockTodoistApi.moveTasks.mockResolvedValueOnce([movedTask1, movedTask2]);

      const result = await client.moveTasksToProject(["task1", "task2"], {
        projectId: "project2",
      });

      expect(result).toEqual([movedTask1, movedTask2]);
      expect(mockTodoistApi.moveTasks).toHaveBeenCalledWith(
        ["task1", "task2"],
        { projectId: "project2" },
      );
    });
  });

  describe("moveTasksToSection", () => {
    test("should move tasks to a different section", async () => {
      const movedTask = createMockTask({
        id: "task1",
        content: "Task to move",
        sectionId: "section2",
      });

      mockTodoistApi.moveTasks.mockResolvedValueOnce([movedTask]);

      const result = await client.moveTasksToSection(["task1"], {
        sectionId: "section2",
      });

      expect(result).toEqual([movedTask]);
      expect(mockTodoistApi.moveTasks).toHaveBeenCalledWith(["task1"], {
        sectionId: "section2",
      });
    });
  });

  describe("moveTasksToParent", () => {
    test("should move tasks to become subtasks of a parent", async () => {
      const movedTask = createMockTask({
        id: "task1",
        content: "Task to become subtask",
        parentId: "parent123",
      });

      mockTodoistApi.moveTasks.mockResolvedValueOnce([movedTask]);

      const result = await client.moveTasksToParent(["task1"], {
        parentId: "parent123",
      });

      expect(result).toEqual([movedTask]);
      expect(mockTodoistApi.moveTasks).toHaveBeenCalledWith(["task1"], {
        parentId: "parent123",
      });
    });
  });
});
