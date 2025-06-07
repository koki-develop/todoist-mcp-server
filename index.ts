import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import packageJson from "./package.json" with { type: "json" };

const server = new Server(
  {
    name: "todoist",
    version: packageJson.version,
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  },
);

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  throw new McpError(
    ErrorCode.InvalidRequest,
    `Unknown resource: ${request.params.uri}`,
  );
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  throw new McpError(
    ErrorCode.InvalidRequest,
    `Unknown tool: ${request.params.name}`,
  );
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Todoist MCP server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
