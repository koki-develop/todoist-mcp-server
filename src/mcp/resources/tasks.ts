import {
  type McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { TodoistClient } from "../../lib/todoist/client";

// Resource-related schemas (used only in this file)
const taskIdSchema = z.string();

export function registerTaskResources(
  server: McpServer,
  client: TodoistClient,
) {
  // Add tasks list resource
  server.resource(
    "tasks",
    "todoist://tasks",
    {
      description:
        "Retrieve all Todoist tasks accessible to the authenticated user. Returns a comprehensive list of tasks with their metadata including content, description, project assignment, due dates, priority levels, labels, completion status, and hierarchy information. Tasks can be filtered by project, section, labels, or custom filters to focus on specific subsets of work.",
    },
    async (uri) => {
      const tasks = await client.getTasks();
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(tasks, null, 2),
          },
        ],
      };
    },
  );

  // Add individual task resource
  server.resource(
    "task",
    new ResourceTemplate("todoist://tasks/{id}", {
      list: undefined,
    }),
    {
      description:
        "Access detailed information for a specific Todoist task using its unique identifier. Provides complete task metadata including content, description, project and section assignment, due date information, priority level, assigned labels, completion status, parent-child relationships, comments count, and timestamps for creation and last modification.",
    },
    async (uri, { id }) => {
      const taskId = taskIdSchema.parse(id);
      const task = await client.getTask(taskId);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(task, null, 2),
          },
        ],
      };
    },
  );
}
