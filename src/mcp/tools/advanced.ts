import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { TodoistClient } from "../../lib/todoist/client";

// Tool-related schemas (used only in this file)
const quickAddTaskSchema = {
  text: z
    .string()
    .min(1)
    .describe(
      "Natural language text describing the task (e.g., 'Buy groceries tomorrow #shopping @urgent', 'Meeting with client next Monday at 2pm #work', 'Call mom in 3 days @personal', 'Submit report by Friday !!!'). Supports parsing due dates, projects (#project), labels (@label), priorities (! to !!!), assignees (+email), and times (at 3pm).",
    ),
  note: z
    .string()
    .optional()
    .describe("Additional description or notes for the task (optional)"),
  reminder: z
    .string()
    .optional()
    .describe(
      "Natural language reminder specification (e.g., '30 minutes before', 'tomorrow at 9am') (optional)",
    ),
  autoReminder: z
    .boolean()
    .optional()
    .describe("Enable automatic reminder based on due date (optional)"),
  meta: z
    .boolean()
    .optional()
    .describe(
      "Return parsing metadata in response to see how text was interpreted (optional)",
    ),
};

export function registerAdvancedTools(
  server: McpServer,
  client: TodoistClient,
) {
  // Quick add task with natural language processing
  server.tool(
    "quick_add_task",
    "Create a task using Todoist's natural language processing for intelligent parsing of due dates, project assignments, labels, and priorities. This tool accepts free-form text input and automatically extracts structured task data. Examples: 'Buy groceries tomorrow #shopping @urgent' creates a task with due date, project, and label; 'Meeting with client next Monday at 2pm #work' sets specific datetime; 'Submit report by Friday !!!' adds high priority. Supports syntax: due dates ('tomorrow', 'next Monday at 2pm'), projects (#Work), labels (@urgent), priorities (! to !!!), assignees (+email), times ('at 3pm'). Returns the created task object with all parsed metadata.",
    quickAddTaskSchema,
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
