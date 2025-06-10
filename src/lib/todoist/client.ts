import { TodoistApi } from "@doist/todoist-api-typescript";
import type {
  CreateLabelParams,
  CreateProjectParams,
  CreateSectionParams,
  CreateTaskParams,
  GetSectionsParams,
  GetTasksParams,
  Label,
  Project,
  Section,
  Task,
  UpdateProjectParams,
  UpdateSectionParams,
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
    const tasks: Task[] = [];
    let cursor: string | null = null;

    do {
      const response = await this._api.getTasks({ ...params, cursor });
      tasks.push(...response.results);
      cursor = response.nextCursor;
    } while (cursor);

    return tasks;
  }

  async getTask(id: string): Promise<Task> {
    return this._api.getTask(id);
  }

  async createTask(params: CreateTaskParams): Promise<Task> {
    // Convert our params to match API requirements
    // biome-ignore lint/suspicious/noExplicitAny: Required for API parameter conversion
    const apiParams = { ...params } as any;
    // API requires either dueDate OR dueDatetime, not both
    if (apiParams.dueDate && apiParams.dueDatetime) {
      apiParams.dueDate = undefined; // Prefer dueDatetime if both are provided
    }
    // Map childOrder to order for API
    if (apiParams.childOrder !== undefined) {
      apiParams.order = apiParams.childOrder;
      apiParams.childOrder = undefined;
    }
    return this._api.addTask(apiParams);
  }

  async updateTask(id: string, params: UpdateTaskParams): Promise<Task> {
    // Convert our params to match API requirements
    // biome-ignore lint/suspicious/noExplicitAny: Required for API parameter conversion
    const apiParams = { ...params } as any;
    // API requires either dueDate OR dueDatetime, not both
    if (apiParams.dueDate && apiParams.dueDatetime) {
      apiParams.dueDate = undefined; // Prefer dueDatetime if both are provided
    }
    return this._api.updateTask(id, apiParams);
  }

  async deleteTask(id: string): Promise<boolean> {
    return this._api.deleteTask(id);
  }

  async closeTask(id: string): Promise<boolean> {
    return this._api.closeTask(id);
  }

  async reopenTask(id: string): Promise<boolean> {
    return this._api.reopenTask(id);
  }

  async getSections(params: GetSectionsParams): Promise<Section[]> {
    const sections: Section[] = [];
    let cursor: string | null = null;

    do {
      const response = await this._api.getSections({
        projectId: params.projectId,
        cursor,
      });
      sections.push(...response.results);
      cursor = response.nextCursor;
    } while (cursor);

    return sections;
  }

  async getSection(id: string): Promise<Section> {
    return this._api.getSection(id);
  }

  async createSection(params: CreateSectionParams): Promise<Section> {
    return this._api.addSection({
      name: params.name,
      projectId: params.projectId,
      order: params.order,
    });
  }

  async updateSection(
    id: string,
    params: UpdateSectionParams,
  ): Promise<Section> {
    return this._api.updateSection(id, {
      name: params.name,
    });
  }

  async deleteSection(id: string): Promise<boolean> {
    return this._api.deleteSection(id);
  }

  async createLabel(params: CreateLabelParams): Promise<Label> {
    return this._api.addLabel({
      name: params.name,
      color: params.color,
      order: params.order,
      isFavorite: params.isFavorite,
    });
  }

  async getLabels(): Promise<Label[]> {
    const labels: Label[] = [];
    let cursor: string | null = null;

    do {
      const response = await this._api.getLabels({ cursor });
      labels.push(...response.results);
      cursor = response.nextCursor;
    } while (cursor);

    return labels;
  }

  async deleteLabel(id: string): Promise<boolean> {
    return this._api.deleteLabel(id);
  }
}
