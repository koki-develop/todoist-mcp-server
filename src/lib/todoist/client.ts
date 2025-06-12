import { TodoistApi } from "@doist/todoist-api-typescript";
import type {
  CloseTaskParams,
  Comment,
  CreateLabelParams,
  CreateProjectCommentParams,
  CreateProjectParams,
  CreateSectionParams,
  CreateTaskCommentParams,
  CreateTaskParams,
  DeleteCommentParams,
  DeleteLabelParams,
  DeleteProjectParams,
  DeleteSectionParams,
  DeleteTaskParams,
  GetLabelParams,
  GetProjectCommentsParams,
  GetProjectParams,
  GetSectionParams,
  GetSectionsParams,
  GetTaskCommentsParams,
  GetTaskParams,
  GetTasksByFilterParams,
  GetTasksParams,
  Label,
  MoveTasksToParentParams,
  MoveTasksToProjectParams,
  MoveTasksToSectionParams,
  Project,
  ReopenTaskParams,
  Section,
  Task,
  UpdateCommentParams,
  UpdateLabelParams,
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

  async getProject(params: GetProjectParams): Promise<Project> {
    return this._api.getProject(params.id);
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

  async updateProject(params: UpdateProjectParams): Promise<Project> {
    return this._api.updateProject(params.id, {
      name: params.name,
      color: params.color,
      isFavorite: params.isFavorite,
      viewStyle: params.viewStyle,
    });
  }

  async deleteProject(params: DeleteProjectParams): Promise<boolean> {
    return this._api.deleteProject(params.id);
  }

  async getTasks(params: GetTasksParams): Promise<Task[]> {
    const tasks: Task[] = [];
    let cursor: string | null = null;

    do {
      const response = await this._api.getTasks({
        projectId: params.projectId,
        sectionId: params.sectionId,
        parentId: params.parentId,
        label: params.label,
        ids: params.ids,
        cursor,
      });
      tasks.push(...response.results);
      cursor = response.nextCursor;
    } while (cursor);

    return tasks;
  }

  async getTasksByFilter(params: GetTasksByFilterParams): Promise<Task[]> {
    const tasks: Task[] = [];
    let cursor: string | null = null;

    do {
      const response = await this._api.getTasksByFilter({
        query: params.query,
        lang: params.lang,
        cursor,
      });
      tasks.push(...response.results);
      cursor = response.nextCursor;
    } while (cursor);

    return tasks;
  }

  async getTask(params: GetTaskParams): Promise<Task> {
    return this._api.getTask(params.id);
  }

  async createTask(params: CreateTaskParams): Promise<Task> {
    // Convert our params to match API requirements
    // biome-ignore lint/suspicious/noExplicitAny: Required for API parameter conversion
    const apiParams = { ...params } as any;
    // API requires either dueDate OR dueDatetime, not both
    if (apiParams.dueDate && apiParams.dueDatetime) {
      apiParams.dueDate = undefined; // Prefer dueDatetime if both are provided
    }
    return this._api.addTask(apiParams);
  }

  async updateTask(params: UpdateTaskParams): Promise<Task> {
    // Convert our params to match API requirements
    // biome-ignore lint/suspicious/noExplicitAny: Required for API parameter conversion
    const { id, ...apiParams } = params as any;
    // API requires either dueDate OR dueDatetime, not both
    if (apiParams.dueDate && apiParams.dueDatetime) {
      apiParams.dueDate = undefined; // Prefer dueDatetime if both are provided
    }
    return this._api.updateTask(id, apiParams);
  }

  async deleteTask(params: DeleteTaskParams): Promise<boolean> {
    return this._api.deleteTask(params.id);
  }

  async closeTask(params: CloseTaskParams): Promise<boolean> {
    return this._api.closeTask(params.id);
  }

  async reopenTask(params: ReopenTaskParams): Promise<boolean> {
    return this._api.reopenTask(params.id);
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

  async getSection(params: GetSectionParams): Promise<Section> {
    return this._api.getSection(params.id);
  }

  async createSection(params: CreateSectionParams): Promise<Section> {
    return this._api.addSection({
      name: params.name,
      projectId: params.projectId,
      order: params.order,
    });
  }

  async updateSection(params: UpdateSectionParams): Promise<Section> {
    return this._api.updateSection(params.id, {
      name: params.name,
    });
  }

  async deleteSection(params: DeleteSectionParams): Promise<boolean> {
    return this._api.deleteSection(params.id);
  }

  async createLabel(params: CreateLabelParams): Promise<Label> {
    return this._api.addLabel({
      name: params.name,
      color: params.color,
      order: params.order,
      isFavorite: params.isFavorite,
    });
  }

  async updateLabel(params: UpdateLabelParams): Promise<Label> {
    return this._api.updateLabel(params.id, {
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

  async getLabel(params: GetLabelParams): Promise<Label> {
    return this._api.getLabel(params.id);
  }

  async deleteLabel(params: DeleteLabelParams): Promise<boolean> {
    return this._api.deleteLabel(params.id);
  }

  async createTaskComment(params: CreateTaskCommentParams): Promise<Comment> {
    return this._api.addComment({
      content: params.content,
      taskId: params.taskId,
      attachment: params.attachment,
    });
  }

  async createProjectComment(
    params: CreateProjectCommentParams,
  ): Promise<Comment> {
    return this._api.addComment({
      content: params.content,
      projectId: params.projectId,
      attachment: params.attachment,
    });
  }

  async updateComment(params: UpdateCommentParams): Promise<Comment> {
    return this._api.updateComment(params.id, {
      content: params.content,
    });
  }

  async getTaskComments(params: GetTaskCommentsParams): Promise<Comment[]> {
    const comments: Comment[] = [];
    let cursor: string | null = null;

    do {
      const response = await this._api.getComments({
        taskId: params.taskId,
        cursor,
      });
      comments.push(...response.results);
      cursor = response.nextCursor;
    } while (cursor);

    return comments;
  }

  async getProjectComments(
    params: GetProjectCommentsParams,
  ): Promise<Comment[]> {
    const comments: Comment[] = [];
    let cursor: string | null = null;

    do {
      const response = await this._api.getComments({
        projectId: params.projectId,
        cursor,
      });
      comments.push(...response.results);
      cursor = response.nextCursor;
    } while (cursor);

    return comments;
  }

  async deleteComment(params: DeleteCommentParams): Promise<boolean> {
    return this._api.deleteComment(params.id);
  }

  async moveTasksToProject(params: MoveTasksToProjectParams): Promise<Task[]> {
    return this._api.moveTasks(params.ids, { projectId: params.projectId });
  }

  async moveTasksToSection(params: MoveTasksToSectionParams): Promise<Task[]> {
    return this._api.moveTasks(params.ids, { sectionId: params.sectionId });
  }

  async moveTasksToParent(params: MoveTasksToParentParams): Promise<Task[]> {
    return this._api.moveTasks(params.ids, { parentId: params.parentId });
  }
}
