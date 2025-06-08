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

export function registerProjectTools(server: McpServer, client: TodoistClient) {
  // Create a new project
  server.tool(
    "create_project",
    "Create a new Todoist project",
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
    "Update an existing Todoist project",
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
    "Delete a Todoist project",
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
}
