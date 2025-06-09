import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import packageJson from "../package.json" with { type: "json" };
import { TodoistClient } from "./lib/todoist/client";
import { registerTools } from "./mcp/tools";

export async function runServer() {
  // Get Todoist API token from environment variables
  const apiToken = process.env.TODOIST_API_TOKEN;
  if (!apiToken) {
    console.error("Error: TODOIST_API_TOKEN environment variable is required");
    process.exit(1);
  }

  // Initialize Todoist client
  const todoistClient = new TodoistClient(apiToken);

  // Create MCP server
  const server = new McpServer({
    name: "todoist",
    version: packageJson.version,
  });

  // Register tools
  registerTools(server, todoistClient);

  // Start server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Todoist MCP server running on stdio");
}
