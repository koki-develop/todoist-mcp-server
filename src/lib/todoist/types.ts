import type {
  PersonalProject,
  WorkspaceProject,
  Task,
} from "@doist/todoist-api-typescript";

export type Project = PersonalProject | WorkspaceProject;
export type { Task };

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
