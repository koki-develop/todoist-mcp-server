# Todoist MCP Server

[![Version](https://img.shields.io/github/v/release/koki-develop/todoist-mcp-server)](https://github.com/koki-develop/todoist-mcp-server/releases/latest)
[![License](https://img.shields.io/github/license/koki-develop/todoist-mcp-server)](./LICENSE)
[![Docker](https://img.shields.io/badge/docker-ghcr.io-blue.svg)](https://github.com/koki-develop/todoist-mcp-server/pkgs/container/todoist-mcp-server)

A **Model Context Protocol (MCP) server** that connects the Todoist API with AI assistants like Claude. This server enables AI assistants to interact with your Todoist projects, sections, tasks, and labels, allowing you to manage your entire productivity workflow through natural language conversations.

The Todoist MCP server provides a bridge between AI assistants and your Todoist workspace, enabling seamless project, section, task, and label management through conversational interfaces.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [MCP Tools](#mcp-tools)
  - [Projects](#projects)
  - [Sections](#sections)
  - [Tasks](#tasks)
  - [Labels](#labels)
  - [Comments](#comments)
- [License](#license)

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

## MCP Tools

The server provides the following tools that AI assistants can use to interact with your Todoist data:

- [Projects](#projects)
  - [`get_projects`](#get_projects)
  - [`get_project`](#get_project)
  - [`create_project`](#create_project)
  - [`update_project`](#update_project)
  - [`delete_project`](#delete_project)
- [Sections](#sections)
  - [`get_sections`](#get_sections)
  - [`get_section`](#get_section)
  - [`create_section`](#create_section)
  - [`update_section`](#update_section)
  - [`delete_section`](#delete_section)
- [Tasks](#tasks)
  - [`get_tasks`](#get_tasks)
  - [`get_tasks_by_filter`](#get_tasks_by_filter)
  - [`get_task`](#get_task)
  - [`create_task`](#create_task)
  - [`update_task`](#update_task)
  - [`delete_task`](#delete_task)
  - [`close_task`](#close_task)
  - [`reopen_task`](#reopen_task)
  - [`move_tasks_to_project`](#move_tasks_to_project)
  - [`move_tasks_to_section`](#move_tasks_to_section)
  - [`move_tasks_to_parent`](#move_tasks_to_parent)
- [Labels](#labels)
  - [`create_label`](#create_label)
  - [`update_label`](#update_label)
  - [`get_label`](#get_label)
  - [`get_labels`](#get_labels)
  - [`delete_label`](#delete_label)
- [Comments](#comments)
  - [`create_task_comment`](#create_task_comment)
  - [`create_project_comment`](#create_project_comment)
  - [`update_comment`](#update_comment)
  - [`get_task_comments`](#get_task_comments)
  - [`get_project_comments`](#get_project_comments)
  - [`delete_comment`](#delete_comment)

### Projects

#### `get_projects`
Retrieves all Todoist projects accessible to the authenticated user. Returns comprehensive project information including personal and workspace projects with metadata such as name, color, favorite status, view style, and hierarchy information.

#### `get_project`
Accesses detailed information for a specific Todoist project using its unique identifier. Provides complete project metadata including configuration, hierarchy, and organizational details.

#### `create_project`
Creates a new Todoist project with customizable settings.

#### `update_project`
Modifies the properties of an existing Todoist project.

#### `delete_project`
Permanently deletes a Todoist project by its unique identifier. This action removes the project and all associated tasks, sections, and comments. **This operation cannot be undone.**

### Sections

#### `get_sections`
Retrieves all sections within a specific Todoist project. Returns a comprehensive list of sections with their metadata such as name, order, creation and update timestamps, and status information. Sections are returned in their display order within the project.

#### `get_section`
Accesses detailed information for a specific Todoist section using its unique identifier. Provides complete section metadata including name, project assignment, order position, timestamps, and status flags.

#### `create_section`
Creates a new section within a Todoist project to organize tasks. Sections help categorize and group related tasks within a project.

#### `update_section`
Modifies the name of an existing Todoist section. Currently, only the section name can be updated.

#### `delete_section`
Permanently deletes a Todoist section by its unique identifier. This action removes the section and moves any tasks in this section to the project's main area. **This operation cannot be undone.**

### Tasks

#### `get_tasks`
Retrieves Todoist tasks with flexible filtering options. Returns a comprehensive list of tasks with their metadata including content, description, project assignment, due dates, priority levels, labels, completion status, and hierarchy information. Without filters, returns all tasks accessible to the authenticated user.

#### `get_tasks_by_filter`
Retrieves Todoist tasks using advanced filter syntax. Supports powerful filter queries using Todoist's natural language filter syntax for complex task searches. Automatically handles pagination to retrieve all matching tasks.

#### `get_task`
Accesses detailed information for a specific Todoist task using its unique identifier. Provides complete task metadata including content, description, project and section assignment, due date information, priority level, assigned labels, completion status, parent-child relationships, and timestamps.

#### `create_task`
Creates a new Todoist task with comprehensive configuration options.

#### `update_task`
Modifies the properties of an existing Todoist task.

#### `delete_task`
Permanently deletes a Todoist task by its unique identifier. This action removes the task and all associated comments and attachments. If the task has subtasks, they will also be deleted. **This operation cannot be undone.**

#### `close_task`
Marks a Todoist task as completed. This action moves the task to the completed state while preserving all task data and history. Completed tasks can be reopened later if needed.

#### `reopen_task`
Reopens a previously completed Todoist task, returning it to active status. This action restores the task to its previous state before completion.

#### `move_tasks_to_project`
Moves multiple tasks to a different project within Todoist. This tool enables efficient bulk task reorganization by changing the project assignment for multiple tasks simultaneously. All specified tasks will be moved from their current locations to the target project.

#### `move_tasks_to_section`
Moves multiple tasks to a different section within Todoist. This tool allows bulk task organization by changing the section assignment for multiple tasks at once. All specified tasks will be moved from their current locations to the target section.

#### `move_tasks_to_parent`
Moves multiple tasks to become subtasks of another task within Todoist. This tool enables creation of task hierarchies by making multiple tasks children of a specified parent task. All specified tasks will be converted to subtasks of the target parent.

### Labels

#### `create_label`
Creates a new personal label with customizable properties including name, color, display order, and favorite status. Labels can be used to categorize and organize tasks across projects.

#### `update_label`
Modifies the properties of an existing personal label. Allows you to change the label's name, color, display order, and favorite status. All parameters except the label ID are optional, so you can update only the specific properties you want to change.

#### `get_label`
Retrieves a specific personal label by its unique ID with complete metadata including name, color, order, and favorite status. Returns detailed information about the requested label for use in task organization and filtering. Requires a valid label ID that belongs to the authenticated user.

#### `get_labels`
Retrieves all personal labels accessible to the authenticated user with their complete metadata including name, color, order, and favorite status. Returns a comprehensive list of labels that can be used for task organization and filtering. This tool provides read-only access to label information and handles pagination automatically.

#### `delete_label`
Permanently deletes a personal label by its unique identifier. **WARNING: This action is IRREVERSIBLE** and will automatically remove the label from all associated tasks. Use with caution as deleted labels cannot be recovered.

### Comments

#### `create_task_comment`
Adds a comment to a specific Todoist task. Supports rich text content and optional file attachments. Returns the complete comment object with all metadata upon successful creation.

#### `create_project_comment`
Adds a comment to a specific Todoist project. Supports rich text content and optional file attachments. Returns the complete comment object with all metadata upon successful creation.

#### `update_comment`
Update the content of an existing comment in Todoist. This allows you to modify the text content of comments on tasks or projects. **The comment's metadata such as posting time, author, and attachments are preserved.** Returns the updated comment object with current content.

#### `get_task_comments`
Retrieves all comments associated with a specific Todoist task. Returns a comprehensive list of comments with their metadata including content, author information, timestamps, file attachments, and reactions. Comments are returned in chronological order. Automatically handles pagination to retrieve all comments for the task.

#### `get_project_comments`
Retrieves all comments associated with a specific Todoist project. Returns a comprehensive list of project-level comments with their metadata including content, author information, timestamps, file attachments, and reactions. Comments are returned in chronological order. Automatically handles pagination to retrieve all comments for the project.

#### `delete_comment`
Permanently deletes a comment by its unique identifier. This action will remove the comment from its associated task or project. **This operation cannot be undone, so use with caution.** Returns confirmation of successful deletion or failure notification.
## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

Copyright (c) 2025 Koki Sato