import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { TodoistClient } from "../../lib/todoist/client";
import { quickAddTaskParamsSchema } from "../../lib/todoist/types";

export function registerAdvancedTools(
  server: McpServer,
  client: TodoistClient,
) {
  // Quick add task with natural language processing
  server.tool(
    "quick_add_task",
    "Create a task using Todoist's natural language processing for intelligent parsing of due dates, project assignments, labels, and priorities. This tool accepts free-form text input and automatically extracts structured task data. Examples: 'Buy groceries tomorrow #shopping @urgent' creates a task with due date, project, and label; 'Meeting with client next Monday at 2pm #work' sets specific datetime; 'Submit report by Friday !!!' adds high priority. Supports syntax: due dates ('tomorrow', 'next Monday at 2pm'), projects (#Work), labels (@urgent), priorities (! to !!!), assignees (+email), times ('at 3pm'). Returns the created task object with all parsed metadata.",
    quickAddTaskParamsSchema.shape,
    async ({ text, note, reminder, autoReminder, meta }) => {
      const task = await client.quickAddTask({
        text,
        note,
        reminder,
        autoReminder,
        meta,
      });

      return {
        content: [
          {
            type: "text",
            text: `Task "${task.content}" created successfully with ID: ${task.id} using natural language: "${text}"`,
          },
          {
            type: "text",
            text: JSON.stringify(task, null, 2),
          },
        ],
      };
    },
  );
}
