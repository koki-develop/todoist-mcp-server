import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { TodoistClient } from "../../lib/todoist/client";

// Tool-related schemas (used only in this file)
const createTaskSchema = {
  content: z.string().min(1).describe("Task content/title"),
  description: z
    .string()
    .optional()
    .describe("Detailed task description (optional)"),
  projectId: z
    .string()
    .optional()
    .describe("ID of the project to add the task to (optional)"),
  sectionId: z
    .string()
    .optional()
    .describe("ID of the section within the project (optional)"),
  parentId: z
    .string()
    .optional()
    .describe("ID of parent task for creating subtasks (optional)"),
  childOrder: z
    .number()
    .optional()
    .describe("Position in project/parent task (optional)"),
  labels: z
    .array(z.string())
    .optional()
    .describe("Array of label names to assign (optional)"),
  priority: z
    .number()
    .min(1)
    .max(4)
    .optional()
    .describe(
      "Priority level: 1=normal, 2=high, 3=very high, 4=urgent (optional)",
    ),
  dueString: z
    .string()
    .optional()
    .describe(
      "Natural language due date like 'tomorrow', 'next Monday at 2pm' (optional)",
    ),
  dueDate: z
    .string()
    .optional()
    .describe("Due date in YYYY-MM-DD format (optional)"),
  dueDatetime: z
    .string()
    .optional()
    .describe("Due datetime in RFC 3339 format (optional)"),
  dueLang: z
    .string()
    .optional()
    .describe("Language for natural language due date parsing (optional)"),
  assigneeId: z
    .string()
    .optional()
    .describe("ID of user to assign task to (optional)"),
  duration: z.number().optional().describe("Task duration amount (optional)"),
  durationUnit: z
    .enum(["minute", "day"])
    .optional()
    .describe("Duration unit: minute or day (optional)"),
};

const updateTaskSchema = {
  id: z.string().min(1).describe("ID of the task to update"),
  content: z
    .string()
    .min(1)
    .optional()
    .describe("New task content/title (optional)"),
  description: z
    .string()
    .optional()
    .describe("New task description (optional)"),
  labels: z
    .array(z.string())
    .optional()
    .describe("New array of label names (optional)"),
  priority: z
    .number()
    .min(1)
    .max(4)
    .optional()
    .describe(
      "New priority level: 1=normal, 2=high, 3=very high, 4=urgent (optional)",
    ),
  dueString: z
    .string()
    .optional()
    .describe("New natural language due date (optional)"),
  dueDate: z
    .string()
    .optional()
    .describe("New due date in YYYY-MM-DD format (optional)"),
  dueDatetime: z
    .string()
    .optional()
    .describe("New due datetime in RFC 3339 format (optional)"),
  dueLang: z
    .string()
    .optional()
    .describe("Language for natural language due date parsing (optional)"),
  assigneeId: z.string().optional().describe("New assignee user ID (optional)"),
  duration: z
    .number()
    .optional()
    .describe("New task duration amount (optional)"),
  durationUnit: z
    .enum(["minute", "day"])
    .optional()
    .describe("New duration unit (optional)"),
};

const deleteTaskSchema = {
  id: z.string().min(1).describe("ID of the task to delete"),
};

const closeTaskSchema = {
  id: z.string().min(1).describe("ID of the task to mark as completed"),
};

const reopenTaskSchema = {
  id: z.string().min(1).describe("ID of the completed task to reopen"),
};

const getTasksSchema = {
  projectId: z
    .string()
    .optional()
    .describe("Filter tasks by project ID (optional)"),
  sectionId: z
    .string()
    .optional()
    .describe("Filter tasks by section ID (optional)"),
  labelId: z
    .string()
    .optional()
    .describe("Filter tasks by label ID (optional)"),
  filter: z
    .string()
    .optional()
    .describe("Custom filter query in Todoist filter syntax (optional)"),
  lang: z
    .string()
    .optional()
    .describe("Language for filter parsing (optional)"),
  ids: z
    .array(z.string())
    .optional()
    .describe("Array of specific task IDs to retrieve (optional)"),
};

const getTaskSchema = {
  id: z.string().min(1).describe("ID of the task to retrieve"),
};

export function registerTaskTools(server: McpServer, client: TodoistClient) {
  // Create a new task
  server.tool(
    "create_task",
    "Create a new Todoist task with comprehensive configuration options. Supports setting task content, detailed descriptions, project and section assignment, parent-child relationships for subtasks, priority levels (1=normal to 4=urgent), natural language due dates, label assignments, task duration estimates, and user assignments. Returns the complete task object with all metadata upon successful creation.",
    createTaskSchema,
    async ({
      content,
      description,
      projectId,
      sectionId,
      parentId,
      childOrder,
      labels,
      priority,
      dueString,
      dueDate,
      dueDatetime,
      dueLang,
      assigneeId,
      duration,
      durationUnit,
    }) => {
      const task = await client.createTask({
        content,
        description,
        projectId,
        sectionId,
        parentId,
        childOrder,
        labels,
        priority,
        dueString,
        dueDate,
        dueDatetime,
        dueLang,
        assigneeId,
        duration,
        durationUnit,
      });

      return {
        content: [
          {
            type: "text",
            text: `Task "${task.content}" created successfully with ID: ${task.id}`,
          },
          {
            type: "text",
            text: JSON.stringify(task, null, 2),
          },
        ],
      };
    },
  );

  // Update an existing task
  server.tool(
    "update_task",
    "Modify the properties of an existing Todoist task. Allows you to change task content, description, labels, priority level, due dates, assignments, and duration estimates. All parameters except the task ID are optional, so you can update only the specific properties you want to change. Supports natural language due date parsing and maintains task relationships. Returns the updated task object with all current metadata.",
    updateTaskSchema,
    async ({
      id,
      content,
      description,
      labels,
      priority,
      dueString,
      dueDate,
      dueDatetime,
      dueLang,
      assigneeId,
      duration,
      durationUnit,
    }) => {
      const task = await client.updateTask(id, {
        content,
        description,
        labels,
        priority,
        dueString,
        dueDate,
        dueDatetime,
        dueLang,
        assigneeId,
        duration,
        durationUnit,
      });

      return {
        content: [
          {
            type: "text",
            text: `Task "${task.content}" (ID: ${task.id}) updated successfully`,
          },
          {
            type: "text",
            text: JSON.stringify(task, null, 2),
          },
        ],
      };
    },
  );

  // Delete a task
  server.tool(
    "delete_task",
    "Permanently delete a Todoist task by its unique identifier. This action will remove the task and all associated comments and attachments. If the task has subtasks, they will also be deleted. This operation cannot be undone, so use with caution. Returns confirmation of successful deletion or failure notification.",
    deleteTaskSchema,
    async ({ id }) => {
      const success = await client.deleteTask(id);

      return {
        content: [
          {
            type: "text",
            text: success
              ? `Task (ID: ${id}) deleted successfully`
              : `Failed to delete task (ID: ${id})`,
          },
        ],
      };
    },
  );

  // Close/complete a task
  server.tool(
    "close_task",
    "Mark a Todoist task as completed. This action moves the task to the completed state while preserving all task data and history. Completed tasks can be reopened later if needed. If the task has incomplete subtasks, they will also be marked as completed. Returns confirmation of successful completion.",
    closeTaskSchema,
    async ({ id }) => {
      const success = await client.closeTask(id);

      return {
        content: [
          {
            type: "text",
            text: success
              ? `Task (ID: ${id}) marked as completed successfully`
              : `Failed to complete task (ID: ${id})`,
          },
        ],
      };
    },
  );

  // Reopen a completed task
  server.tool(
    "reopen_task",
    "Reopen a previously completed Todoist task, returning it to active status. This action restores the task to its previous state before completion, making it available for further work. All task metadata, labels, due dates, and assignments are preserved. Returns the reopened task object with updated status.",
    reopenTaskSchema,
    async ({ id }) => {
      const success = await client.reopenTask(id);

      if (success) {
        // Get the reopened task to return its details
        const task = await client.getTask(id);
        return {
          content: [
            {
              type: "text",
              text: `Task "${task.content}" (ID: ${task.id}) reopened successfully`,
            },
            {
              type: "text",
              text: JSON.stringify(task, null, 2),
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `Failed to reopen task with ID: ${id}`,
          },
        ],
      };
    },
  );

  // Get tasks with optional filtering
  server.tool(
    "get_tasks",
    "Retrieve Todoist tasks with flexible filtering options. Can filter by project, section, labels, or use custom Todoist filter queries. Returns a comprehensive list of tasks with their metadata including content, description, project assignment, due dates, priority levels, labels, completion status, and hierarchy information. Without filters, returns all tasks accessible to the authenticated user.",
    getTasksSchema,
    async ({ projectId, sectionId, labelId, filter, lang, ids }) => {
      const tasks = await client.getTasks({
        projectId,
        sectionId,
        labelId,
        filter,
        lang,
        ids,
      });

      return {
        content: [
          {
            type: "text",
            text: `Retrieved ${tasks.length} task(s)`,
          },
          {
            type: "text",
            text: JSON.stringify(tasks, null, 2),
          },
        ],
      };
    },
  );

  // Get a single task by ID
  server.tool(
    "get_task",
    "Access detailed information for a specific Todoist task using its unique identifier. Provides complete task metadata including content, description, project and section assignment, due date information, priority level, assigned labels, completion status, parent-child relationships, comments count, and timestamps for creation and last modification.",
    getTaskSchema,
    async ({ id }) => {
      const task = await client.getTask(id);

      return {
        content: [
          {
            type: "text",
            text: `Retrieved task "${task.content}" (ID: ${task.id})`,
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
