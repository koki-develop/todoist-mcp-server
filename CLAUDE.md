# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Todoist MCP (Model Context Protocol) server** built with TypeScript and Bun. The project integrates Todoist with AI assistants like Claude through the MCP standard, allowing AI to interact with Todoist tasks and projects.

## Development Commands

```bash
# Install dependencies and setup tools
bun install       # Install Node.js dependencies
mise install      # Install required tool versions (Bun, Node.js)

# Build and run
bun run build     # Build the MCP server to dist/index.js
node dist/index.js # Run the built MCP server
# or for development: bun run src/index.ts

# Code quality
bun run lint      # Check code with Biome
bun run format    # Format and fix code with Biome

# Development workflow
bun run prepare   # Install git hooks (runs automatically on install)
```

## Project Structure

```
src/              # Source code
├── index.ts      # Main MCP server implementation
scripts/          # Build and utility scripts
├── build.ts      # Bun.build configuration
dist/             # Built output (executable with shebang)
```

## Architecture

**MCP Server Structure**: The main server is implemented in `src/index.ts` using the official `@modelcontextprotocol/sdk`. It follows the standard MCP pattern:

- **Server Setup**: Creates MCP server with stdio transport for communication
- **Request Handlers**: Implements MCP request handlers for resources and tools
- **Error Handling**: Uses `McpError` for standardized error responses

**Current State**: The server is scaffolded with empty handlers. Actual Todoist integration needs implementation:
- Resources: For reading Todoist data (tasks, projects, labels)
- Tools: For modifying Todoist data (create/update/delete tasks)
- Authentication: API token handling for Todoist API

## Development Tooling

**Tool Version Management**: Uses `mise.toml` for reproducible environments
- Bun 1.2.15 for development and package management  
- Node.js 22.16.0 for production runtime

**Build System**: Custom Bun.build configuration in `scripts/build.ts`
- Targets Node.js runtime with external packages
- Adds executable shebang to output
- Cleans and rebuilds to `dist/` directory

**Code Quality**: Biome replaces ESLint + Prettier
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