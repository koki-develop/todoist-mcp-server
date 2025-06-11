import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { TodoistClient } from "../../lib/todoist/client";
import {
  createProjectCommentParamsSchema,
  createTaskCommentParamsSchema,
  deleteCommentParamsSchema,
  getProjectCommentsParamsSchema,
  getTaskCommentsParamsSchema,
  updateCommentParamsSchema,
} from "../../lib/todoist/types";
export function registerCommentTools(server: McpServer, client: TodoistClient) {
  // Create a new task comment
  server.tool(
    "create_task_comment",
    "Add a comment to a specific Todoist task. Supports rich text content and optional file attachments. Returns the complete comment object with all metadata upon successful creation.",
    createTaskCommentParamsSchema.shape,
    async ({ content, taskId, attachment }) => {
      // Validate attachment if provided
      if (attachment && !attachment.fileUrl) {
        throw new Error("fileUrl is required when attachment is provided");
      }

      const comment = await client.createTaskComment({
        content,
        taskId,
        attachment,
      });

      return {
        content: [
          {
            type: "text",
            text: `Comment created successfully on task (ID: ${taskId}) with ID: ${comment.id}`,
          },
          {
            type: "text",
            text: JSON.stringify(comment, null, 2),
          },
        ],
      };
    },
  );

  // Create a new project comment
  server.tool(
    "create_project_comment",
    "Add a comment to a specific Todoist project. Supports rich text content and optional file attachments. Returns the complete comment object with all metadata upon successful creation.",
    createProjectCommentParamsSchema.shape,
    async ({ content, projectId, attachment }) => {
      // Validate attachment if provided
      if (attachment && !attachment.fileUrl) {
        throw new Error("fileUrl is required when attachment is provided");
      }

      const comment = await client.createProjectComment({
        content,
        projectId,
        attachment,
      });

      return {
        content: [
          {
            type: "text",
            text: `Comment created successfully on project (ID: ${projectId}) with ID: ${comment.id}`,
          },
          {
            type: "text",
            text: JSON.stringify(comment, null, 2),
          },
        ],
      };
    },
  );

  // Update an existing comment
  server.tool(
    "update_comment",
    "Update the content of an existing comment in Todoist. This allows you to modify the text content of comments on tasks or projects. The comment's metadata such as posting time, author, and attachments are preserved. Returns the updated comment object with current content.",
    updateCommentParamsSchema.shape,
    async (params) => {
      const comment = await client.updateComment(params);

      return {
        content: [
          {
            type: "text",
            text: `Comment updated successfully with ID: ${comment.id}`,
          },
          {
            type: "text",
            text: JSON.stringify(comment, null, 2),
          },
        ],
      };
    },
  );

  // Get comments for a specific task
  server.tool(
    "get_task_comments",
    "Retrieve all comments associated with a specific Todoist task. Returns a comprehensive list of comments with their metadata including content, author information, timestamps, file attachments, and reactions. Comments are returned in chronological order. Automatically handles pagination to retrieve all comments for the task.",
    getTaskCommentsParamsSchema.shape,
    async ({ taskId }) => {
      const comments = await client.getTaskComments({ taskId });

      return {
        content: [
          {
            type: "text",
            text: `Retrieved ${comments.length} comment(s) for task ID: ${taskId}`,
          },
          {
            type: "text",
            text: JSON.stringify(comments, null, 2),
          },
        ],
      };
    },
  );

  // Get comments for a specific project
  server.tool(
    "get_project_comments",
    "Retrieve all comments associated with a specific Todoist project. Returns a comprehensive list of project-level comments with their metadata including content, author information, timestamps, file attachments, and reactions. Comments are returned in chronological order. Automatically handles pagination to retrieve all comments for the project.",
    getProjectCommentsParamsSchema.shape,
    async ({ projectId }) => {
      const comments = await client.getProjectComments({ projectId });

      return {
        content: [
          {
            type: "text",
            text: `Retrieved ${comments.length} comment(s) for project ID: ${projectId}`,
          },
          {
            type: "text",
            text: JSON.stringify(comments, null, 2),
          },
        ],
      };
    },
  );

  // Delete a comment
  server.tool(
    "delete_comment",
    "Permanently delete a comment by its unique identifier. This action will remove the comment from its associated task or project. This operation cannot be undone, so use with caution. Returns confirmation of successful deletion or failure notification.",
    deleteCommentParamsSchema.shape,
    async ({ id }) => {
      const success = await client.deleteComment({ id });

      return {
        content: [
          {
            type: "text",
            text: success
              ? `Comment (ID: ${id}) deleted successfully`
              : `Failed to delete comment (ID: ${id})`,
          },
        ],
      };
    },
  );
}
