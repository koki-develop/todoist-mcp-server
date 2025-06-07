import type {
  PersonalProject,
  WorkspaceProject,
} from "@doist/todoist-api-typescript";

export type Project = PersonalProject | WorkspaceProject;

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
