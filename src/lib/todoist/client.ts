import { TodoistApi } from "@doist/todoist-api-typescript";
import type {
  CreateProjectParams,
  CreateTaskParams,
  GetTasksParams,
  Project,
  Task,
  UpdateProjectParams,
  UpdateTaskParams,
} from "./types";

export class TodoistClient {
  private _api: TodoistApi;

  constructor(apiToken: string) {
    this._api = new TodoistApi(apiToken);
  }

  async getProjects(): Promise<Project[]> {
    const projects: Project[] = [];
    let cursor: string | null = null;

    do {
      const response = await this._api.getProjects({ cursor });
      projects.push(...response.results);
      cursor = response.nextCursor;
    } while (cursor);

    return projects;
  }

  async getProject(id: string): Promise<Project> {
    return this._api.getProject(id);
  }

  async createProject(params: CreateProjectParams): Promise<Project> {
    return this._api.addProject({
      name: params.name,
      parentId: params.parentId,
      color: params.color,
      isFavorite: params.isFavorite,
      viewStyle: params.viewStyle,
    });
  }

  async updateProject(
    id: string,
    params: UpdateProjectParams,
  ): Promise<Project> {
    return this._api.updateProject(id, {
      name: params.name,
      color: params.color,
      isFavorite: params.isFavorite,
      viewStyle: params.viewStyle,
    });
  }

  async deleteProject(id: string): Promise<boolean> {
    return this._api.deleteProject(id);
  }

  async getTasks(params?: GetTasksParams): Promise<Task[]> {
    return this._api.getTasks(params);
  }

  async getTask(id: string): Promise<Task> {
    return this._api.getTask(id);
  }

  async createTask(params: CreateTaskParams): Promise<Task> {
    return this._api.addTask(params);
  }

  async updateTask(
    id: string,
    params: UpdateTaskParams,
  ): Promise<Task> {
    return this._api.updateTask(id, params);
  }

  async deleteTask(id: string): Promise<boolean> {
    return this._api.deleteTask(id);
  }

  async closeTask(id: string): Promise<boolean> {
    return this._api.closeTask(id);
  }

  async reopenTask(id: string): Promise<Task> {
    return this._api.reopenTask(id);
  }
}
