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

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`id`** | **Yes** | ID of the project to retrieve |

#### `create_project`
Creates a new Todoist project with customizable settings.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`name`** | **Yes** | Name of the project |
| `parentId` | No | ID of parent project for hierarchy |
| `color` | No | Color for the project |
| `isFavorite` | No | Mark project as favorite |
| `viewStyle` | No | View style (`list`, `board`, or `calendar`) |

#### `update_project`
Modifies the properties of an existing Todoist project.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`id`** | **Yes** | ID of the project to update |
| `name` | No | New name for the project |
| `color` | No | New color for the project |
| `isFavorite` | No | Update favorite status |
| `viewStyle` | No | New view style (`list`, `board`, or `calendar`) |

#### `delete_project`
Permanently deletes a Todoist project by its unique identifier. This action removes the project and all associated tasks, sections, and comments. **This operation cannot be undone.**

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`id`** | **Yes** | ID of the project to delete |

### Sections

#### `get_sections`
Retrieves all sections within a specific Todoist project. Returns a comprehensive list of sections with their metadata such as name, order, creation and update timestamps, and status information. Sections are returned in their display order within the project.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`projectId`** | **Yes** | ID of the project to retrieve sections from |

#### `get_section`
Accesses detailed information for a specific Todoist section using its unique identifier. Provides complete section metadata including name, project assignment, order position, timestamps, and status flags.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`id`** | **Yes** | ID of the section to retrieve |

#### `create_section`
Creates a new section within a Todoist project to organize tasks. Sections help categorize and group related tasks within a project.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`name`** | **Yes** | Name of the section to create |
| **`projectId`** | **Yes** | ID of the project to create the section in |
| `order` | No | Order of the section within the project |

#### `update_section`
Modifies the name of an existing Todoist section. Currently, only the section name can be updated.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`id`** | **Yes** | ID of the section to update |
| **`name`** | **Yes** | New name for the section |

#### `delete_section`
Permanently deletes a Todoist section by its unique identifier. This action removes the section and moves any tasks in this section to the project's main area. **This operation cannot be undone.**

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`id`** | **Yes** | ID of the section to delete |

### Tasks

#### `get_tasks`
Retrieves Todoist tasks with flexible filtering options. Returns a comprehensive list of tasks with their metadata including content, description, project assignment, due dates, priority levels, labels, completion status, and hierarchy information. Without filters, returns all tasks accessible to the authenticated user.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `projectId` | No | Filter tasks by project ID |
| `sectionId` | No | Filter tasks by section ID |
| `labelId` | No | Filter tasks by label ID |
| `filter` | No | Custom filter query in Todoist filter syntax |
| `lang` | No | Language for filter parsing |
| `ids` | No | Array of specific task IDs to retrieve |

#### `get_task`
Accesses detailed information for a specific Todoist task using its unique identifier. Provides complete task metadata including content, description, project and section assignment, due date information, priority level, assigned labels, completion status, parent-child relationships, and timestamps.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`id`** | **Yes** | ID of the task to retrieve |

#### `create_task`
Creates a new Todoist task with comprehensive configuration options.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`content`** | **Yes** | Task content/title |
| `description` | No | Detailed task description |
| `projectId` | No | ID of the project to add the task to |
| `sectionId` | No | ID of the section within the project |
| `parentId` | No | ID of parent task for creating subtasks |
| `childOrder` | No | Position in project/parent task |
| `labels` | No | Array of label names to assign |
| `priority` | No | Priority level (1=normal, 2=high, 3=very high, 4=urgent) |
| `dueString` | No | Natural language due date like 'tomorrow', 'next Monday at 2pm' |
| `dueDate` | No | Due date in YYYY-MM-DD format |
| `dueDatetime` | No | Due datetime in RFC 3339 format |
| `dueLang` | No | Language for natural language due date parsing |
| `assigneeId` | No | ID of user to assign task to |
| `duration` | No | Task duration amount |
| `durationUnit` | No | Duration unit (minute or day) |


#### `update_task`
Modifies the properties of an existing Todoist task.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`id`** | **Yes** | ID of the task to update |
| `content` | No | New task content/title |
| `description` | No | New task description |
| `labels` | No | New array of label names |
| `priority` | No | New priority level (1=normal, 2=high, 3=very high, 4=urgent) |
| `dueString` | No | New natural language due date |
| `dueDate` | No | New due date in YYYY-MM-DD format |
| `dueDatetime` | No | New due datetime in RFC 3339 format |
| `dueLang` | No | Language for natural language due date parsing |
| `assigneeId` | No | New assignee user ID |
| `duration` | No | New task duration amount |
| `durationUnit` | No | New duration unit |

#### `delete_task`
Permanently deletes a Todoist task by its unique identifier. This action removes the task and all associated comments and attachments. If the task has subtasks, they will also be deleted. **This operation cannot be undone.**

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`id`** | **Yes** | ID of the task to delete |

#### `close_task`
Marks a Todoist task as completed. This action moves the task to the completed state while preserving all task data and history. Completed tasks can be reopened later if needed.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`id`** | **Yes** | ID of the task to mark as completed |

#### `reopen_task`
Reopens a previously completed Todoist task, returning it to active status. This action restores the task to its previous state before completion.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`id`** | **Yes** | ID of the completed task to reopen |

#### `move_tasks_to_project`
Moves multiple tasks to a different project within Todoist. This tool enables efficient bulk task reorganization by changing the project assignment for multiple tasks simultaneously. All specified tasks will be moved from their current locations to the target project.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`ids`** | **Yes** | Array of task IDs to move to the project |
| **`projectId`** | **Yes** | ID of the destination project |

#### `move_tasks_to_section`
Moves multiple tasks to a different section within Todoist. This tool allows bulk task organization by changing the section assignment for multiple tasks at once. All specified tasks will be moved from their current locations to the target section.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`ids`** | **Yes** | Array of task IDs to move to the section |
| **`sectionId`** | **Yes** | ID of the destination section |

#### `move_tasks_to_parent`
Moves multiple tasks to become subtasks of another task within Todoist. This tool enables creation of task hierarchies by making multiple tasks children of a specified parent task. All specified tasks will be converted to subtasks of the target parent.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`ids`** | **Yes** | Array of task IDs to move as subtasks |
| **`parentId`** | **Yes** | ID of the parent task |

### Labels

#### `create_label`
Creates a new personal label with customizable properties including name, color, display order, and favorite status. Labels can be used to categorize and organize tasks across projects.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`name`** | **Yes** | Name of the label to create |
| `color` | No | Color code or key for the label |
| `order` | No | Display order position (can be null) |
| `isFavorite` | No | Mark label as favorite |

#### `update_label`
Modifies the properties of an existing personal label. Allows you to change the label's name, color, display order, and favorite status. All parameters except the label ID are optional, so you can update only the specific properties you want to change.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`id`** | **Yes** | ID of the label to update |
| `name` | No | New name for the label |
| `color` | No | New color code or key for the label |
| `order` | No | New display order position (can be null) |
| `isFavorite` | No | New favorite status |

#### `get_label`
Retrieves a specific personal label by its unique ID with complete metadata including name, color, order, and favorite status. Returns detailed information about the requested label for use in task organization and filtering. Requires a valid label ID that belongs to the authenticated user.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`id`** | **Yes** | ID of the label to retrieve |

#### `get_labels`
Retrieves all personal labels accessible to the authenticated user with their complete metadata including name, color, order, and favorite status. Returns a comprehensive list of labels that can be used for task organization and filtering. This tool provides read-only access to label information and handles pagination automatically.

#### `delete_label`
Permanently deletes a personal label by its unique identifier. **WARNING: This action is IRREVERSIBLE** and will automatically remove the label from all associated tasks. Use with caution as deleted labels cannot be recovered.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`id`** | **Yes** | Unique identifier of the label to permanently delete |

### Comments

#### `create_task_comment`
Adds a comment to a specific Todoist task. Supports rich text content and optional file attachments. Returns the complete comment object with all metadata upon successful creation.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`content`** | **Yes** | The text content of the comment |
| **`taskId`** | **Yes** | ID of the task to comment on |
| `attachment` | No | File attachment object with URL and metadata |
| `attachment.fileUrl` | **Yes*** | URL of the file to attach (*required if attachment is provided) |
| `attachment.fileName` | No | Name of the attached file |
| `attachment.fileType` | No | MIME type of the file |
| `attachment.resourceType` | No | Type of resource |

#### `create_project_comment`
Adds a comment to a specific Todoist project. Supports rich text content and optional file attachments. Returns the complete comment object with all metadata upon successful creation.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`content`** | **Yes** | The text content of the comment |
| **`projectId`** | **Yes** | ID of the project to comment on |
| `attachment` | No | File attachment object with URL and metadata |
| `attachment.fileUrl` | **Yes*** | URL of the file to attach (*required if attachment is provided) |
| `attachment.fileName` | No | Name of the attached file |
| `attachment.fileType` | No | MIME type of the file |
| `attachment.resourceType` | No | Type of resource |

#### `update_comment`
Update the content of an existing comment in Todoist. This allows you to modify the text content of comments on tasks or projects. **The comment's metadata such as posting time, author, and attachments are preserved.** Returns the updated comment object with current content.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`id`** | **Yes** | ID of the comment to update |
| **`content`** | **Yes** | New text content for the comment |

#### `get_task_comments`
Retrieves all comments associated with a specific Todoist task. Returns a comprehensive list of comments with their metadata including content, author information, timestamps, file attachments, and reactions. Comments are returned in chronological order. Automatically handles pagination to retrieve all comments for the task.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`taskId`** | **Yes** | ID of the task to retrieve comments from |

#### `get_project_comments`
Retrieves all comments associated with a specific Todoist project. Returns a comprehensive list of project-level comments with their metadata including content, author information, timestamps, file attachments, and reactions. Comments are returned in chronological order. Automatically handles pagination to retrieve all comments for the project.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`projectId`** | **Yes** | ID of the project to retrieve comments from |

#### `delete_comment`
Permanently deletes a comment by its unique identifier. This action will remove the comment from its associated task or project. **This operation cannot be undone, so use with caution.** Returns confirmation of successful deletion or failure notification.

| Parameter | Required | Description |
|-----------|----------|-------------|
| **`id`** | **Yes** | ID of the comment to delete |
## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

Copyright (c) 2025 Koki Sato