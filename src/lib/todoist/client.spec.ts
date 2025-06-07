import { beforeEach, describe, expect, mock, test } from "bun:test";
import { TodoistClient } from "./client";
import type {
  CreateProjectParams,
  Project,
  UpdateProjectParams,
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

// Mock the entire TodoistApi with all required methods
const mockTodoistApi = {
  getProjects: mock(),
  getProject: mock(),
  addProject: mock(),
  updateProject: mock(),
  deleteProject: mock(),
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
});
