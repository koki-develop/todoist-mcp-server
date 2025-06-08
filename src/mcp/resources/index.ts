import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { TodoistClient } from "../../lib/todoist/client";
import { registerProjectResources } from "./projects";
import { registerTaskResources } from "./tasks";

export function registerResources(server: McpServer, client: TodoistClient) {
  registerProjectResources(server, client);
  registerTaskResources(server, client);
}
