import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { TodoistClient } from "../../lib/todoist/client";
import {
  closeTaskParamsSchema,
  createTaskParamsSchema,
  deleteTaskParamsSchema,
  getTaskParamsSchema,
  getTasksByFilterParamsSchema,
  getTasksParamsSchema,
  moveTasksToParentParamsSchema,
  moveTasksToProjectParamsSchema,
  moveTasksToSectionParamsSchema,
  reopenTaskParamsSchema,
  updateTaskParamsSchema,
} from "../../lib/todoist/types";

export function registerTaskTools(server: McpServer, client: TodoistClient) {
  // Create a new task
  server.tool(
    "create_task",
    "Create a new Todoist task with comprehensive configuration options. Supports setting task content, detailed descriptions, project and section assignment, parent-child relationships for subtasks, priority levels (1=normal to 4=urgent), natural language due dates, label assignments, task duration estimates, and user assignments. Returns the complete task object with all metadata upon successful creation.",
    createTaskParamsSchema.shape,
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
    updateTaskParamsSchema.shape,
    async (params) => {
      const task = await client.updateTask(params);

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
    deleteTaskParamsSchema.shape,
    async ({ id }) => {
      const success = await client.deleteTask({ id });

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
    closeTaskParamsSchema.shape,
    async ({ id }) => {
      const success = await client.closeTask({ id });

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
    reopenTaskParamsSchema.shape,
    async ({ id }) => {
      const success = await client.reopenTask({ id });

      if (success) {
        // Get the reopened task to return its details
        const task = await client.getTask({ id });
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
    getTasksParamsSchema.shape,
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

  // Get tasks using advanced filter syntax
  server.tool(
    "get_tasks_by_filter",
    "Retrieve Todoist tasks using advanced filter syntax. Supports powerful filter queries using Todoist's natural language filter syntax such as 'overdue & @work', 'today | tomorrow', 'p1 & assigned to: me', etc. This tool leverages Todoist's built-in filtering capabilities for complex task searches. Returns comprehensive task metadata including content, description, project assignment, due dates, priority levels, labels, completion status, and hierarchy information. Automatically handles pagination to retrieve all matching tasks.",
    getTasksByFilterParamsSchema.shape,
    async ({ query, lang }) => {
      const tasks = await client.getTasksByFilter({
        query,
        lang,
      });

      return {
        content: [
          {
            type: "text",
            text: `Retrieved ${tasks.length} task(s) using filter: "${query}"`,
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
    getTaskParamsSchema.shape,
    async ({ id }) => {
      const task = await client.getTask({ id });

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

  // Move multiple tasks to a different project
  server.tool(
    "move_tasks_to_project",
    "Move multiple tasks to a different project within Todoist. This will move the tasks from their current location to the specified project. Useful for reorganizing tasks when project assignments change or for bulk task management. Returns the updated task objects after successful movement with their new project assignment.",
    moveTasksToProjectParamsSchema.shape,
    async (params) => {
      const movedTasks = await client.moveTasksToProject(params);

      return {
        content: [
          {
            type: "text",
            text: `Successfully moved ${movedTasks.length} task(s) to project ${params.projectId}`,
          },
          {
            type: "text",
            text: JSON.stringify(movedTasks, null, 2),
          },
        ],
      };
    },
  );

  // Move multiple tasks to a different section
  server.tool(
    "move_tasks_to_section",
    "Move multiple tasks to a different section within Todoist. This will move the tasks from their current location to the specified section. Sections help organize tasks within projects into logical groups. Returns the updated task objects after successful movement with their new section assignment.",
    moveTasksToSectionParamsSchema.shape,
    async (params) => {
      const movedTasks = await client.moveTasksToSection(params);

      return {
        content: [
          {
            type: "text",
            text: `Successfully moved ${movedTasks.length} task(s) to section ${params.sectionId}`,
          },
          {
            type: "text",
            text: JSON.stringify(movedTasks, null, 2),
          },
        ],
      };
    },
  );

  // Move multiple tasks to become subtasks of a parent task
  server.tool(
    "move_tasks_to_parent",
    "Move multiple tasks to become subtasks of another task within Todoist. This creates a hierarchical relationship where the moved tasks become children of the specified parent task. Useful for organizing related tasks or breaking down complex tasks into subtasks. Returns the updated task objects after successful movement with their new parent assignment.",
    moveTasksToParentParamsSchema.shape,
    async (params) => {
      const movedTasks = await client.moveTasksToParent(params);

      return {
        content: [
          {
            type: "text",
            text: `Successfully moved ${movedTasks.length} task(s) to become subtasks of parent task ${params.parentId}`,
          },
          {
            type: "text",
            text: JSON.stringify(movedTasks, null, 2),
          },
        ],
      };
    },
  );
}
