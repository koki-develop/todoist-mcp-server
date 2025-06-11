import type {
  Comment,
  Label,
  PersonalProject,
  Section,
  Task,
  WorkspaceProject,
} from "@doist/todoist-api-typescript";

export type Project = PersonalProject | WorkspaceProject;
export type { Comment, Label, Task, Section };

export interface CreateProjectParams {
  name: string;
  parentId?: string;
  color?: string;
  isFavorite?: boolean;
  viewStyle?: "list" | "board" | "calendar";
}

export interface UpdateProjectParams {
  name?: string;
  color?: string;
  isFavorite?: boolean;
  viewStyle?: "list" | "board" | "calendar";
}

export interface GetTasksParams {
  projectId?: string;
  sectionId?: string;
  labelId?: string;
  filter?: string;
  lang?: string;
  ids?: string[];
}

export interface CreateTaskParams {
  content: string;
  description?: string;
  projectId?: string;
  sectionId?: string;
  parentId?: string;
  childOrder?: number;
  labels?: string[];
  priority?: number;
  dueString?: string;
  dueDate?: string;
  dueDatetime?: string;
  dueLang?: string;
  assigneeId?: string;
  duration?: number;
  durationUnit?: "minute" | "day";
}

export interface UpdateTaskParams {
  content?: string;
  description?: string;
  labels?: string[];
  priority?: number;
  dueString?: string;
  dueDate?: string;
  dueDatetime?: string;
  dueLang?: string;
  assigneeId?: string;
  duration?: number;
  durationUnit?: "minute" | "day";
}

export interface GetSectionsParams {
  projectId: string;
}

export interface CreateSectionParams {
  name: string;
  projectId: string;
  order?: number;
}

export interface UpdateSectionParams {
  name: string;
}

export interface CreateLabelParams {
  name: string;
  color?: string;
  order?: number | null;
  isFavorite?: boolean;
}

export interface UpdateLabelParams {
  name?: string;
  color?: string;
  order?: number | null;
  isFavorite?: boolean;
}

export interface CreateCommentParams {
  content: string;
  taskId?: string;
  projectId?: string;
  attachment?: {
    fileName?: string;
    fileUrl: string;
    fileType?: string;
    resourceType?: string;
  };
}

export interface UpdateCommentParams {
  content: string;
}

export interface QuickAddTaskParams {
  text: string;
  note?: string;
  reminder?: string;
  autoReminder?: boolean;
  meta?: boolean;
}
