# Todoist MCP Server

[![Version](https://img.shields.io/github/v/release/koki-develop/todoist-mcp-server)](https://github.com/koki-develop/todoist-mcp-server/releases/latest)
[![License](https://img.shields.io/github/license/koki-develop/todoist-mcp-server)](./LICENSE)
[![Docker](https://img.shields.io/badge/docker-ghcr.io-blue.svg)](https://github.com/koki-develop/todoist-mcp-server/pkgs/container/todoist-mcp-server)

A **Model Context Protocol (MCP) server** that connects the Todoist API with AI assistants like Claude. This server enables AI assistants to interact with your Todoist projects, sections, and tasks, allowing you to manage your entire productivity workflow through natural language conversations.

The Todoist MCP server provides a bridge between AI assistants and your Todoist workspace, enabling seamless project, section, and task management through conversational interfaces.

## Prerequisites

Before using this MCP server, you'll need a **Todoist API token**:

1. Go to [Todoist Developer Settings](https://app.todoist.com/app/settings/integrations/developer)
2. Copy your API token

## Usage

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

### MCP Tools

The server provides the following tools that AI assistants can use to interact with your Todoist data:

#### `get_projects`
Retrieves all Todoist projects accessible to the authenticated user. Returns comprehensive project information including personal and workspace projects with metadata such as name, color, favorite status, view style, and hierarchy information.

#### `get_project`
Accesses detailed information for a specific Todoist project using its unique identifier. Provides complete project metadata including configuration, hierarchy, and organizational details.
- **id** (required): ID of the project to retrieve

#### `get_tasks`
Retrieves Todoist tasks with flexible filtering options. Returns a comprehensive list of tasks with their metadata including content, description, project assignment, due dates, priority levels, labels, completion status, and hierarchy information. Without filters, returns all tasks accessible to the authenticated user.
- **projectId** (optional): Filter tasks by project ID
- **sectionId** (optional): Filter tasks by section ID
- **labelId** (optional): Filter tasks by label ID
- **filter** (optional): Custom filter query in Todoist filter syntax
- **lang** (optional): Language for filter parsing
- **ids** (optional): Array of specific task IDs to retrieve

#### `get_task`
Accesses detailed information for a specific Todoist task using its unique identifier. Provides complete task metadata including content, description, project and section assignment, due date information, priority level, assigned labels, completion status, parent-child relationships, and timestamps.
- **id** (required): ID of the task to retrieve

#### `get_sections`
Retrieves all sections within a specific Todoist project. Returns a comprehensive list of sections with their metadata such as name, order, creation and update timestamps, and status information. Sections are returned in their display order within the project.
- **projectId** (required): ID of the project to retrieve sections from

#### `get_section`
Accesses detailed information for a specific Todoist section using its unique identifier. Provides complete section metadata including name, project assignment, order position, timestamps, and status flags.
- **id** (required): ID of the section to retrieve

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

#### `create_section`
Creates a new section within a Todoist project to organize tasks. Sections help categorize and group related tasks within a project.
- **name** (required): Name of the section to create
- **projectId** (required): ID of the project to create the section in
- **order** (optional): Order of the section within the project

#### `update_section`
Modifies the name of an existing Todoist section. Currently, only the section name can be updated.
- **id** (required): ID of the section to update
- **name** (required): New name for the section

#### `delete_section`
Permanently deletes a Todoist section by its unique identifier. This action removes the section and moves any tasks in this section to the project's main area. **This operation cannot be undone.**
- **id** (required): ID of the section to delete

#### `create_task`
Creates a new Todoist task with comprehensive configuration options. Allows you to set up a task with:
- **content** (required): Task content/title
- **description** (optional): Detailed task description
- **projectId** (optional): ID of the project to add the task to
- **sectionId** (optional): ID of the section within the project
- **parentId** (optional): ID of parent task for creating subtasks
- **childOrder** (optional): Position in project/parent task
- **labels** (optional): Array of label names to assign
- **priority** (optional): Priority level (1=normal, 2=high, 3=very high, 4=urgent)
- **dueString** (optional): Natural language due date like 'tomorrow', 'next Monday at 2pm'
- **dueDate** (optional): Due date in YYYY-MM-DD format
- **dueDatetime** (optional): Due datetime in RFC 3339 format
- **dueLang** (optional): Language for natural language due date parsing
- **assigneeId** (optional): ID of user to assign task to
- **duration** (optional): Task duration amount
- **durationUnit** (optional): Duration unit (minute or day)

#### `update_task`
Modifies the properties of an existing Todoist task. Allows you to change:
- **id** (required): ID of the task to update
- **content** (optional): New task content/title
- **description** (optional): New task description
- **labels** (optional): New array of label names
- **priority** (optional): New priority level (1=normal, 2=high, 3=very high, 4=urgent)
- **dueString** (optional): New natural language due date
- **dueDate** (optional): New due date in YYYY-MM-DD format
- **dueDatetime** (optional): New due datetime in RFC 3339 format
- **dueLang** (optional): Language for natural language due date parsing
- **assigneeId** (optional): New assignee user ID
- **duration** (optional): New task duration amount
- **durationUnit** (optional): New duration unit

#### `delete_task`
Permanently deletes a Todoist task by its unique identifier. This action removes the task and all associated comments and attachments. If the task has subtasks, they will also be deleted. **This operation cannot be undone.**
- **id** (required): ID of the task to delete

#### `close_task`
Marks a Todoist task as completed. This action moves the task to the completed state while preserving all task data and history. Completed tasks can be reopened later if needed.
- **id** (required): ID of the task to mark as completed

#### `reopen_task`
Reopens a previously completed Todoist task, returning it to active status. This action restores the task to its previous state before completion.
- **id** (required): ID of the completed task to reopen

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

Copyright (c) 2025 Koki Sato