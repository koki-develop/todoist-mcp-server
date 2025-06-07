# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Todoist MCP (Model Context Protocol) server** built with TypeScript and Bun. The project integrates Todoist with AI assistants like Claude through the MCP standard, allowing AI to interact with Todoist tasks and projects.

## Development Commands

```bash
# Install dependencies
bun install

# Run the MCP server
bun run index.ts

# Code quality
bun run lint      # Check code with Biome
bun run format    # Format and fix code with Biome

# Development workflow
bun run prepare   # Install git hooks (runs automatically on install)
```

## Architecture

**MCP Server Structure**: The main server is implemented in `index.ts` using the official `@modelcontextprotocol/sdk`. It follows the standard MCP pattern:

- **Server Setup**: Creates MCP server with stdio transport for communication
- **Request Handlers**: Implements MCP request handlers for resources and tools
- **Error Handling**: Uses `McpError` for standardized error responses

**Current State**: The server is scaffolded with empty handlers. Actual Todoist integration needs implementation:
- Resources: For reading Todoist data (tasks, projects, labels)
- Tools: For modifying Todoist data (create/update/delete tasks)
- Authentication: API token handling for Todoist API

## Development Tooling

**Biome**: Replaces ESLint + Prettier with a single fast tool
- Enforces unused imports/variables as errors
- Uses double quotes and space indentation
- Runs automatically on git commit via husky + lint-staged

**TypeScript**: Configured for modern features with strict checking
- ES modules with bundler resolution
- Targets ESNext for Bun runtime compatibility

## Key Implementation Notes

**MCP Protocol**: Server name is set to "todoist" and version is read from package.json. The server communicates via stdio transport, which is standard for MCP servers.

**Error Patterns**: Use `McpError` with appropriate `ErrorCode` enum values for consistent error handling across the MCP interface.

**Commit Workflow**: All commits automatically run Biome formatting via git hooks. Keep commits small and atomic - the project follows a pattern of committing tooling changes separately from feature implementation.

**Commit Messages**: Follow Conventional Commits specification (https://conventionalcommits.org/):
- `feat:` for new features
- `fix:` for bug fixes
- `chore:` for tooling, dependencies, configuration
- `docs:` for documentation changes
- `style:` for formatting, code style changes
- `refactor:` for code refactoring without functional changes