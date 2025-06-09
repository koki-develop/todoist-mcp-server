# Todoist MCP Server

[![Version](https://img.shields.io/badge/version-0.0.3-blue.svg)](https://github.com/koki-develop/todoist-mcp-server)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Docker](https://img.shields.io/badge/docker-ghcr.io-blue.svg)](https://github.com/koki-develop/todoist-mcp-server/pkgs/container/todoist-mcp-server)

A **Model Context Protocol (MCP) server** that connects the Todoist API with AI assistants like Claude. This server enables AI assistants to interact with your Todoist projects, allowing you to manage tasks and projects through natural language conversations.

The Todoist MCP server provides a bridge between AI assistants and your Todoist workspace, enabling seamless project management through conversational interfaces.

## Prerequisites

Before using this MCP server, you'll need a **Todoist API token**:

1. Go to [Todoist Integrations Settings](https://todoist.com/app/settings/integrations)
2. You can directly access the Developer section at the following URL:
   - https://app.todoist.com/app/settings/integrations/developer
3. Copy your API token

## Usage

### Docker (Recommended)

Run the MCP server using Docker from GitHub Container Registry:

```bash
docker run -e TODOIST_API_TOKEN=<your_api_token_here> ghcr.io/koki-develop/todoist-mcp-server:latest
```

### MCP Client Configuration

To use this server with an MCP client, add the following configuration:

```json
{
  "mcpServers": {
    "todoist": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "TODOIST_API_TOKEN=<your_api_token_here>",
        "ghcr.io/koki-develop/todoist-mcp-server:latest"
      ]
    }
  }
}
```

Replace `<your_api_token_here>` with your actual Todoist API token.

## Available Features

### MCP Resources

The server provides the following resources that can be read by AI assistants:

#### `todoist://projects`
Lists all Todoist projects accessible to the authenticated user. Returns comprehensive project information including personal and workspace projects with metadata such as name, color, favorite status, view style, and hierarchy information.

#### `todoist://projects/{id}`
Accesses detailed information for a specific Todoist project using its unique identifier. Provides complete project metadata including configuration, hierarchy, and organizational details.

### MCP Tools

The server provides the following tools that AI assistants can use to modify your Todoist data:

#### `create_project`
Creates a new Todoist project with customizable settings. Allows you to set up a project with:
- **name** (required): Name of the project
- **parentId** (optional): ID of parent project for hierarchy
- **color** (optional): Color for the project
- **isFavorite** (optional): Mark project as favorite
- **viewStyle** (optional): View style (`list`, `board`, or `calendar`)

#### `update_project`
Modifies the properties of an existing Todoist project. Allows you to change:
- **id** (required): ID of the project to update
- **name** (optional): New name for the project
- **color** (optional): New color for the project
- **isFavorite** (optional): Update favorite status
- **viewStyle** (optional): New view style (`list`, `board`, or `calendar`)

#### `delete_project`
Permanently deletes a Todoist project by its unique identifier. This action removes the project and all associated tasks, sections, and comments. **This operation cannot be undone.**
- **id** (required): ID of the project to delete

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

Copyright (c) 2025 Koki Sato