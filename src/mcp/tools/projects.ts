import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { TodoistClient } from "../../lib/todoist/client";

// Tool-related schemas (used only in this file)
const createProjectSchema = {
  name: z.string().min(1).describe("Name of the project to create"),
  parentId: z.string().optional().describe("ID of parent project (optional)"),
  color: z.string().optional().describe("Color for the project (optional)"),
  isFavorite: z
    .boolean()
    .optional()
    .describe("Mark project as favorite (optional)"),
  viewStyle: z
    .enum(["list", "board", "calendar"])
    .optional()
    .describe("View style for the project (optional)"),
};

const updateProjectSchema = {
  id: z.string().min(1).describe("ID of the project to update"),
  name: z
    .string()
    .min(1)
    .optional()
    .describe("New name for the project (optional)"),
  color: z.string().optional().describe("New color for the project (optional)"),
  isFavorite: z
    .boolean()
    .optional()
    .describe("Mark project as favorite or not (optional)"),
  viewStyle: z
    .enum(["list", "board", "calendar"])
    .optional()
    .describe("New view style for the project (optional)"),
};

const deleteProjectSchema = {
  id: z.string().min(1).describe("ID of the project to delete"),
};

const getProjectsSchema = {};

const getProjectSchema = {
  id: z.string().min(1).describe("ID of the project to retrieve"),
};

export function registerProjectTools(server: McpServer, client: TodoistClient) {
  // Create a new project
  server.tool(
    "create_project",
    "Create a new Todoist project with customizable settings. Allows you to set up a project with specific name, hierarchy (by assigning a parent), visual customization (color), organizational preferences (favorite status), and view style (list, board, or calendar). Returns the complete project object with all metadata upon successful creation.",
    createProjectSchema,
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
    updateProjectSchema,
    async ({ id, name, color, isFavorite, viewStyle }) => {
      const project = await client.updateProject(id, {
        name,
        color,
        isFavorite,
        viewStyle,
      });

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
    deleteProjectSchema,
    async ({ id }) => {
      const success = await client.deleteProject(id);

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
    getProjectsSchema,
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
    getProjectSchema,
    async ({ id }) => {
      const project = await client.getProject(id);

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
