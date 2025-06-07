import { TodoistApi } from "@doist/todoist-api-typescript";

export class TodoistClient {
  private _api: TodoistApi;

  constructor(apiToken: string) {
    this._api = new TodoistApi(apiToken);
  }
}
