import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { TodoistClient } from "../../lib/todoist/client";

// Tool-related schemas (used only in this file)
const createCommentSchema = {
  content: z.string().min(1).describe("The text content of the comment"),
  taskId: z
    .string()
    .optional()
    .describe(
      "ID of the task to comment on (mutually exclusive with projectId)",
    ),
  projectId: z
    .string()
    .optional()
    .describe(
      "ID of the project to comment on (mutually exclusive with taskId)",
    ),
  attachment: z
    .object({
      fileName: z.string().optional().describe("Name of the attached file"),
      fileUrl: z.string().describe("URL of the file to attach"),
      fileType: z.string().optional().describe("MIME type of the file"),
      resourceType: z.string().optional().describe("Type of resource"),
    })
    .optional()
    .describe("File attachment (optional)"),
};

const getTaskCommentsSchema = {
  taskId: z
    .string()
    .min(1)
    .describe("ID of the task to retrieve comments from"),
};

const getProjectCommentsSchema = {
  projectId: z
    .string()
    .min(1)
    .describe("ID of the project to retrieve comments from"),
};

const deleteCommentSchema = {
  id: z.string().min(1).describe("ID of the comment to delete"),
};
export function registerCommentTools(server: McpServer, client: TodoistClient) {
  // Create a new comment
  server.tool(
    "create_comment",
    "Add a comment to a Todoist task or project. Supports rich text content and optional file attachments. You must specify either a task ID or project ID, but not both. Returns the complete comment object with all metadata upon successful creation.",
    createCommentSchema,
    async ({ content, taskId, projectId, attachment }) => {
      // Validate that exactly one of taskId or projectId is provided
      if (!taskId && !projectId) {
        throw new Error(
          "Either taskId or projectId must be provided, but not both",
        );
      }
      if (taskId && projectId) {
        throw new Error(
          "Cannot specify both taskId and projectId - they are mutually exclusive",
        );
      }

      // Validate attachment if provided
      if (attachment && !attachment.fileUrl) {
        throw new Error("fileUrl is required when attachment is provided");
      }

      const comment = await client.createComment({
        content,
        taskId,
        projectId,
        attachment,
      });

      const target = taskId
        ? `task (ID: ${taskId})`
        : `project (ID: ${projectId})`;

      return {
        content: [
          {
            type: "text",
            text: `Comment created successfully on ${target} with ID: ${comment.id}`,
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
    getTaskCommentsSchema,
    async ({ taskId }) => {
      const comments = await client.getTaskComments(taskId);

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
    getProjectCommentsSchema,
    async ({ projectId }) => {
      const comments = await client.getProjectComments(projectId);

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
    deleteCommentSchema,
    async ({ id }) => {
      const success = await client.deleteComment(id);

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
