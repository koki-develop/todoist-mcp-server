import type {
  Comment,
  Label,
  PersonalProject,
  Section,
  Task,
  WorkspaceProject,
} from "@doist/todoist-api-typescript";
import { z } from "zod";

export type Project = PersonalProject | WorkspaceProject;
export type { Comment, Label, Task, Section };

// Color schema
export const colorSchema = z.enum([
  "berry_red",
  "red",
  "orange",
  "yellow",
  "olive_green",
  "lime_green",
  "green",
  "mint_green",
  "teal",
  "sky_blue",
  "light_blue",
  "blue",
  "grape",
  "violet",
  "lavender",
  "magenta",
  "salmon",
  "charcoal",
  "grey",
  "taupe",
]);

// Project schemas
export const createProjectParamsSchema = z.object({
  name: z.string().min(1).describe("Name of the project to create"),
  parentId: z.string().optional().describe("ID of parent project (optional)"),
  color: colorSchema.optional().describe("Color for the project (optional)"),
  isFavorite: z
    .boolean()
    .optional()
    .describe("Mark project as favorite (optional)"),
  viewStyle: z
    .enum(["list", "board", "calendar"])
    .optional()
    .describe("View style for the project (optional)"),
});

// Client update schemas (without ID)
export const updateProjectClientSchema = z.object({
  name: z
    .string()
    .min(1)
    .optional()
    .describe("New name for the project (optional)"),
  color: colorSchema
    .optional()
    .describe("New color for the project (optional)"),
  isFavorite: z
    .boolean()
    .optional()
    .describe("Mark project as favorite or not (optional)"),
  viewStyle: z
    .enum(["list", "board", "calendar"])
    .optional()
    .describe("New view style for the project (optional)"),
});

export const updateProjectParamsSchema = z.object({
  id: z.string().min(1).describe("ID of the project to update"),
  name: z
    .string()
    .min(1)
    .optional()
    .describe("New name for the project (optional)"),
  color: colorSchema
    .optional()
    .describe("New color for the project (optional)"),
  isFavorite: z
    .boolean()
    .optional()
    .describe("Mark project as favorite or not (optional)"),
  viewStyle: z
    .enum(["list", "board", "calendar"])
    .optional()
    .describe("New view style for the project (optional)"),
});

export const deleteProjectParamsSchema = z.object({
  id: z.string().min(1).describe("ID of the project to delete"),
});

export const getProjectsParamsSchema = z.object({});

export const getProjectParamsSchema = z.object({
  id: z.string().min(1).describe("ID of the project to retrieve"),
});

// Section schemas
export const getSectionsParamsSchema = z.object({
  projectId: z
    .string()
    .min(1)
    .describe("ID of the project to get sections from"),
});

export const createSectionParamsSchema = z.object({
  name: z.string().min(1).describe("Name of the section to create"),
  projectId: z
    .string()
    .min(1)
    .describe("ID of the project to create section in"),
  order: z.number().optional().describe("Display order position (optional)"),
});

export const updateSectionParamsSchema = z.object({
  id: z.string().min(1).describe("ID of the section to update"),
  name: z.string().min(1).describe("New name for the section"),
});

// Client update schemas (without ID)
export const updateSectionClientSchema = z.object({
  name: z.string().min(1).describe("New name for the section"),
});

export const deleteSectionParamsSchema = z.object({
  id: z.string().min(1).describe("ID of the section to delete"),
});

export const getSectionParamsSchema = z.object({
  id: z.string().min(1).describe("ID of the section to retrieve"),
});

// Task schemas
export const getTasksParamsSchema = z.object({
  projectId: z.string().optional().describe("Filter by project ID (optional)"),
  sectionId: z.string().optional().describe("Filter by section ID (optional)"),
  labelId: z.string().optional().describe("Filter by label ID (optional)"),
  filter: z.string().optional().describe("Filter expression (optional)"),
  lang: z.string().optional().describe("Language for filter (optional)"),
  ids: z
    .array(z.string())
    .optional()
    .describe("Specific task IDs to retrieve (optional)"),
});

export const createTaskParamsSchema = z.object({
  content: z.string().min(1).describe("Task content"),
  description: z.string().optional().describe("Task description (optional)"),
  projectId: z.string().optional().describe("Project ID (optional)"),
  sectionId: z.string().optional().describe("Section ID (optional)"),
  parentId: z.string().optional().describe("Parent task ID (optional)"),
  childOrder: z
    .number()
    .optional()
    .describe("Order among child tasks (optional)"),
  labels: z.array(z.string()).optional().describe("Label IDs (optional)"),
  priority: z.number().optional().describe("Task priority 1-4 (optional)"),
  dueString: z
    .string()
    .optional()
    .describe("Due date in natural language (optional)"),
  dueDate: z.string().optional().describe("Due date YYYY-MM-DD (optional)"),
  dueDatetime: z
    .string()
    .optional()
    .describe("Due datetime RFC3339 (optional)"),
  dueLang: z
    .string()
    .optional()
    .describe("Language for due date parsing (optional)"),
  assigneeId: z.string().optional().describe("Assignee user ID (optional)"),
  duration: z.number().optional().describe("Duration amount (optional)"),
  durationUnit: z
    .enum(["minute", "day"])
    .optional()
    .describe("Duration unit (optional)"),
});

export const updateTaskParamsSchema = z.object({
  id: z.string().min(1).describe("ID of the task to update"),
  content: z.string().min(1).optional().describe("New task content (optional)"),
  description: z
    .string()
    .optional()
    .describe("New task description (optional)"),
  labels: z.array(z.string()).optional().describe("New label IDs (optional)"),
  priority: z.number().optional().describe("New task priority 1-4 (optional)"),
  dueString: z
    .string()
    .optional()
    .describe("New due date in natural language (optional)"),
  dueDate: z.string().optional().describe("New due date YYYY-MM-DD (optional)"),
  dueDatetime: z
    .string()
    .optional()
    .describe("New due datetime RFC3339 (optional)"),
  dueLang: z
    .string()
    .optional()
    .describe("Language for due date parsing (optional)"),
  assigneeId: z.string().optional().describe("New assignee user ID (optional)"),
  duration: z.number().optional().describe("New duration amount (optional)"),
  durationUnit: z
    .enum(["minute", "day"])
    .optional()
    .describe("New duration unit (optional)"),
});

// Client update schemas (without ID)
export const updateTaskClientSchema = z.object({
  content: z.string().min(1).optional().describe("New task content (optional)"),
  description: z
    .string()
    .optional()
    .describe("New task description (optional)"),
  labels: z.array(z.string()).optional().describe("New label IDs (optional)"),
  priority: z.number().optional().describe("New task priority 1-4 (optional)"),
  dueString: z
    .string()
    .optional()
    .describe("New due date in natural language (optional)"),
  dueDate: z.string().optional().describe("New due date YYYY-MM-DD (optional)"),
  dueDatetime: z
    .string()
    .optional()
    .describe("New due datetime RFC3339 (optional)"),
  dueLang: z
    .string()
    .optional()
    .describe("Language for due date parsing (optional)"),
  assigneeId: z.string().optional().describe("New assignee user ID (optional)"),
  duration: z.number().optional().describe("New duration amount (optional)"),
  durationUnit: z
    .enum(["minute", "day"])
    .optional()
    .describe("New duration unit (optional)"),
});

export const deleteTaskParamsSchema = z.object({
  id: z.string().min(1).describe("ID of the task to delete"),
});

export const getTaskParamsSchema = z.object({
  id: z.string().min(1).describe("ID of the task to retrieve"),
});

export const closeTaskParamsSchema = z.object({
  id: z.string().min(1).describe("ID of the task to close"),
});

export const reopenTaskParamsSchema = z.object({
  id: z.string().min(1).describe("ID of the task to reopen"),
});

// Label schemas
export const createLabelParamsSchema = z.object({
  name: z.string().min(1).describe("Name of the label to create"),
  color: colorSchema.optional().describe("Color for the label (optional)"),
  order: z
    .number()
    .nullable()
    .optional()
    .describe("Display order position (optional)"),
  isFavorite: z
    .boolean()
    .optional()
    .describe("Mark label as favorite (optional)"),
});

export const updateLabelParamsSchema = z.object({
  id: z.string().min(1).describe("ID of the label to update"),
  name: z
    .string()
    .min(1)
    .optional()
    .describe("New name for the label (optional)"),
  color: colorSchema.optional().describe("New color for the label (optional)"),
  order: z
    .number()
    .nullable()
    .optional()
    .describe("New display order position (optional)"),
  isFavorite: z.boolean().optional().describe("New favorite status (optional)"),
});

// Client update schemas (without ID)
export const updateLabelClientSchema = z.object({
  name: z
    .string()
    .min(1)
    .optional()
    .describe("New name for the label (optional)"),
  color: colorSchema.optional().describe("New color for the label (optional)"),
  order: z
    .number()
    .nullable()
    .optional()
    .describe("New display order position (optional)"),
  isFavorite: z.boolean().optional().describe("New favorite status (optional)"),
});

export const getLabelsParamsSchema = z.object({});

export const getLabelParamsSchema = z.object({
  id: z.string().min(1).describe("ID of the label to retrieve"),
});

export const deleteLabelParamsSchema = z.object({
  id: z
    .string()
    .min(1)
    .describe("Unique identifier of the label to permanently delete"),
});

// Comment schemas
export const createTaskCommentParamsSchema = z.object({
  content: z.string().min(1).describe("Comment content"),
  taskId: z.string().min(1).describe("ID of the task to comment on"),
  attachment: z
    .object({
      fileName: z.string().optional().describe("File name (optional)"),
      fileUrl: z.string().describe("File URL"),
      fileType: z.string().optional().describe("File type (optional)"),
      resourceType: z.string().optional().describe("Resource type (optional)"),
    })
    .optional()
    .describe("File attachment (optional)"),
});

export const createProjectCommentParamsSchema = z.object({
  content: z.string().min(1).describe("Comment content"),
  projectId: z.string().min(1).describe("ID of the project to comment on"),
  attachment: z
    .object({
      fileName: z.string().optional().describe("File name (optional)"),
      fileUrl: z.string().describe("File URL"),
      fileType: z.string().optional().describe("File type (optional)"),
      resourceType: z.string().optional().describe("Resource type (optional)"),
    })
    .optional()
    .describe("File attachment (optional)"),
});

export const updateCommentParamsSchema = z.object({
  id: z.string().min(1).describe("ID of the comment to update"),
  content: z.string().min(1).describe("New comment content"),
});

// Client update schemas (without ID)
export const updateCommentClientSchema = z.object({
  content: z.string().min(1).describe("New comment content"),
});

export const getTaskCommentsParamsSchema = z.object({
  taskId: z.string().min(1).describe("ID of the task to get comments from"),
});

export const getProjectCommentsParamsSchema = z.object({
  projectId: z
    .string()
    .min(1)
    .describe("ID of the project to get comments from"),
});

export const deleteCommentParamsSchema = z.object({
  id: z.string().min(1).describe("ID of the comment to delete"),
});

// Advanced schemas
export const quickAddTaskParamsSchema = z.object({
  text: z.string().min(1).describe("Task text with natural language parsing"),
  note: z.string().optional().describe("Additional note (optional)"),
  reminder: z.string().optional().describe("Reminder settings (optional)"),
  autoReminder: z.boolean().optional().describe("Auto reminder (optional)"),
  meta: z.boolean().optional().describe("Include metadata (optional)"),
});

// Move tasks schemas
export const moveTasksToProjectParamsSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).describe("Array of task IDs to move"),
  projectId: z.string().min(1).describe("Target project ID"),
});

export const moveTasksToSectionParamsSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).describe("Array of task IDs to move"),
  sectionId: z.string().min(1).describe("Target section ID"),
});

export const moveTasksToParentParamsSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).describe("Array of task IDs to move"),
  parentId: z.string().min(1).describe("Target parent task ID"),
});

// Client move task schemas (without IDs since they're passed separately)
export const moveTasksToProjectClientSchema = z.object({
  projectId: z.string().min(1).describe("Target project ID"),
});

export const moveTasksToSectionClientSchema = z.object({
  sectionId: z.string().min(1).describe("Target section ID"),
});

export const moveTasksToParentClientSchema = z.object({
  parentId: z.string().min(1).describe("Target parent task ID"),
});

// Inferred types from schemas
export type Color = z.infer<typeof colorSchema>;
export type CreateProjectParams = z.infer<typeof createProjectParamsSchema>;
// MCP parameter types (include ID for MCP tools)
export type DeleteProjectParams = z.infer<typeof deleteProjectParamsSchema>;
export type GetProjectsParams = z.infer<typeof getProjectsParamsSchema>;
export type GetProjectParams = z.infer<typeof getProjectParamsSchema>;
export type GetSectionsParams = z.infer<typeof getSectionsParamsSchema>;
export type CreateSectionParams = z.infer<typeof createSectionParamsSchema>;
export type DeleteSectionParams = z.infer<typeof deleteSectionParamsSchema>;
export type GetSectionParams = z.infer<typeof getSectionParamsSchema>;
export type GetTasksParams = z.infer<typeof getTasksParamsSchema>;
export type CreateTaskParams = z.infer<typeof createTaskParamsSchema>;
export type DeleteTaskParams = z.infer<typeof deleteTaskParamsSchema>;
export type GetTaskParams = z.infer<typeof getTaskParamsSchema>;
export type CloseTaskParams = z.infer<typeof closeTaskParamsSchema>;
export type ReopenTaskParams = z.infer<typeof reopenTaskParamsSchema>;
export type CreateLabelParams = z.infer<typeof createLabelParamsSchema>;
export type GetLabelsParams = z.infer<typeof getLabelsParamsSchema>;
export type GetLabelParams = z.infer<typeof getLabelParamsSchema>;
export type DeleteLabelParams = z.infer<typeof deleteLabelParamsSchema>;
export type CreateTaskCommentParams = z.infer<
  typeof createTaskCommentParamsSchema
>;
export type CreateProjectCommentParams = z.infer<
  typeof createProjectCommentParamsSchema
>;
export type GetTaskCommentsParams = z.infer<typeof getTaskCommentsParamsSchema>;
export type GetProjectCommentsParams = z.infer<
  typeof getProjectCommentsParamsSchema
>;
export type DeleteCommentParams = z.infer<typeof deleteCommentParamsSchema>;
export type QuickAddTaskParams = z.infer<typeof quickAddTaskParamsSchema>;
export type MoveTasksToProjectParams = z.infer<
  typeof moveTasksToProjectParamsSchema
>;
export type MoveTasksToSectionParams = z.infer<
  typeof moveTasksToSectionParamsSchema
>;
export type MoveTasksToParentParams = z.infer<
  typeof moveTasksToParentParamsSchema
>;

// Client interface types (without IDs for update operations)
export type UpdateProjectParams = z.infer<typeof updateProjectClientSchema>;
export type UpdateSectionParams = z.infer<typeof updateSectionClientSchema>;
export type UpdateTaskParams = z.infer<typeof updateTaskClientSchema>;
export type UpdateLabelParams = z.infer<typeof updateLabelClientSchema>;
export type UpdateCommentParams = z.infer<typeof updateCommentClientSchema>;
export type MoveTasksToProjectClientParams = z.infer<
  typeof moveTasksToProjectClientSchema
>;
export type MoveTasksToSectionClientParams = z.infer<
  typeof moveTasksToSectionClientSchema
>;
export type MoveTasksToParentClientParams = z.infer<
  typeof moveTasksToParentClientSchema
>;
