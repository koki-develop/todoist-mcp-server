import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { TodoistClient } from "../../lib/todoist/client";
import { registerCommentTools } from "./comments";
import { registerLabelTools } from "./labels";
import { registerProjectTools } from "./projects";
import { registerSectionTools } from "./sections";
import { registerTaskTools } from "./tasks";

export function registerTools(server: McpServer, client: TodoistClient) {
  registerProjectTools(server, client);
  registerSectionTools(server, client);
  registerTaskTools(server, client);
  registerLabelTools(server, client);
  registerCommentTools(server, client);
}
