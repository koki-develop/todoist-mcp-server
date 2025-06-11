import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { TodoistClient } from "../../lib/todoist/client";
import {
  createProjectParamsSchema,
  deleteProjectParamsSchema,
  getProjectParamsSchema,
  getProjectsParamsSchema,
  updateProjectParamsSchema,
} from "../../lib/todoist/types";

export function registerProjectTools(server: McpServer, client: TodoistClient) {
  // Create a new project
  server.tool(
    "create_project",
    "Create a new Todoist project with customizable settings. Allows you to set up a project with specific name, hierarchy (by assigning a parent), visual customization (color), organizational preferences (favorite status), and view style (list, board, or calendar). Returns the complete project object with all metadata upon successful creation.",
    createProjectParamsSchema.shape,
    async ({ name, parentId, color, isFavorite, viewStyle }) => {
      const project = await client.createProject({
        name,
        parentId,
        color,
        isFavorite,
        viewStyle,
      });

      return {
        content: [
          {
            type: "text",
            text: `Project "${project.name}" created successfully with ID: ${project.id}`,
          },
          {
            type: "text",
            text: JSON.stringify(project, null, 2),
          },
        ],
      };
    },
  );

  // Update an existing project
  server.tool(
    "update_project",
    "Modify the properties of an existing Todoist project. Allows you to change the project's name, color scheme, favorite status, and view style preferences. All parameters except the project ID are optional, so you can update only the specific properties you want to change. Returns the updated project object with all current metadata.",
    updateProjectParamsSchema.shape,
    async (params) => {
      const project = await client.updateProject(params);

      return {
        content: [
          {
            type: "text",
            text: `Project "${project.name}" (ID: ${project.id}) updated successfully`,
          },
          {
            type: "text",
            text: JSON.stringify(project, null, 2),
          },
        ],
      };
    },
  );

  // Delete a project
  server.tool(
    "delete_project",
    "Permanently delete a Todoist project by its unique identifier. This action will remove the project and all associated tasks, sections, and comments. This operation cannot be undone, so use with caution. Returns confirmation of successful deletion or failure notification.",
    deleteProjectParamsSchema.shape,
    async ({ id }) => {
      const success = await client.deleteProject({ id });

      return {
        content: [
          {
            type: "text",
            text: success
              ? `Project (ID: ${id}) deleted successfully`
              : `Failed to delete project (ID: ${id})`,
          },
        ],
      };
    },
  );

  // Get all projects
  server.tool(
    "get_projects",
    "Retrieve all Todoist projects accessible to the authenticated user. Returns a comprehensive list of projects including personal and workspace projects with their metadata such as name, color, favorite status, view style, and hierarchy information.",
    getProjectsParamsSchema.shape,
    async () => {
      const projects = await client.getProjects();

      return {
        content: [
          {
            type: "text",
            text: `Retrieved ${projects.length} project(s)`,
          },
          {
            type: "text",
            text: JSON.stringify(projects, null, 2),
          },
        ],
      };
    },
  );

  // Get a single project by ID
  server.tool(
    "get_project",
    "Access detailed information for a specific Todoist project using its unique identifier. Provides complete project metadata including configuration, hierarchy, and organizational details.",
    getProjectParamsSchema.shape,
    async ({ id }) => {
      const project = await client.getProject({ id });

      return {
        content: [
          {
            type: "text",
            text: `Retrieved project "${project.name}" (ID: ${project.id})`,
          },
          {
            type: "text",
            text: JSON.stringify(project, null, 2),
          },
        ],
      };
    },
  );
}
