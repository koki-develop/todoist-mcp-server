import {
  type McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { TodoistClient } from "../../lib/todoist/client";

// Resource-related schemas (used only in this file)
const projectIdSchema = z.string();

export function registerProjectResources(
  server: McpServer,
  client: TodoistClient,
) {
  // Add projects list resource
  server.resource(
    "projects",
    "todoist://projects",
    {
      description:
        "Retrieve all Todoist projects accessible to the authenticated user. Returns a comprehensive list of projects including personal and workspace projects with their metadata such as name, color, favorite status, view style, and hierarchy information.",
    },
    async (uri) => {
      const projects = await client.getProjects();
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(projects, null, 2),
          },
        ],
      };
    },
  );

  // Add individual project resource
  server.resource(
    "project",
    new ResourceTemplate("todoist://projects/{id}", {
      list: undefined,
    }),
    {
      description:
        "Access detailed information for a specific Todoist project using its unique identifier. Provides complete project metadata including configuration, hierarchy, and organizational details.",
    },
    async (uri, { id }) => {
      const projectId = projectIdSchema.parse(id);
      const project = await client.getProject(projectId);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(project, null, 2),
          },
        ],
      };
    },
  );
}
