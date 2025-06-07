# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Todoist MCP (Model Context Protocol) server** built with TypeScript and Bun. The project integrates Todoist with AI assistants like Claude through the MCP standard, allowing AI to interact with Todoist tasks and projects.

## Development Commands

```bash
# Install dependencies and setup tools
bun install       # Install Node.js dependencies
mise install      # Install required tool versions (Bun, Node.js, linting tools)

# Build and run
bun run build     # Build the MCP server to dist/index.js
node dist/index.js # Run the built MCP server
# or for development: bun run src/index.ts

# Testing
bun test          # Run all tests
bun test src/lib/todoist/client.spec.ts  # Run specific test file

# Code quality
bun run lint      # Check code with Biome
bun run format    # Format and fix code with Biome

# GitHub Actions linting (requires mise tools)
actionlint        # Lint GitHub Actions workflow files
ghalint run       # Check GitHub Actions policies
zizmor . --persona=auditor  # Security audit GitHub Actions

# Development workflow
bun run prepare   # Install git hooks (runs automatically on install)
```

## Project Structure

```
src/              # Source code
├── index.ts      # Main MCP server implementation
├── lib/
│   └── todoist/  # Todoist API client wrapper
│       ├── client.ts     # TodoistClient class with CRUD operations
│       ├── types.ts      # TypeScript types and interfaces
│       └── client.spec.ts # Comprehensive test suite
scripts/          # Build and utility scripts
├── build.ts      # Bun.build configuration
dist/             # Built output (executable with shebang)
```

## Architecture

**MCP Server Structure**: The main server is implemented in `src/index.ts` using the official `@modelcontextprotocol/sdk`. It follows the standard MCP pattern:

- **Server Setup**: Creates MCP server with stdio transport for communication
- **Request Handlers**: Implements MCP request handlers for resources and tools (currently stub implementations)
- **Error Handling**: Uses `McpError` for standardized error responses

**Todoist Integration Layer**: The project includes a complete `TodoistClient` class in `src/lib/todoist/client.ts` that wraps the `@doist/todoist-api-typescript` library. This provides a clean abstraction layer between the MCP server and the Todoist API.

**Current Implementation State**: 
- TodoistClient fully implemented with project CRUD operations (getProjects, getProject, createProject, updateProject, deleteProject)
- Automatic pagination handling in getProjects() method
- Comprehensive test suite with factory functions and mock implementations
- MCP server handlers are still empty placeholders and need to be connected to TodoistClient
- Focus is on project-related functionality first, then expanding to tasks and other features

**Integration Pattern**: The TodoistClient uses underscore-prefixed private fields (`_api`) and accepts API token as a simple string parameter, leaving environment variable handling to the calling code.

## Development Tooling

**Tool Version Management**: Uses `mise.toml` for reproducible environments
- Bun 1.2.15 for development and package management  
- Node.js 22.16.0 for production runtime
- Rust 1.87.0 for cargo-based tools
- GitHub Actions linting tools: actionlint, ghalint (via aqua), zizmor (via cargo)

**Build System**: Custom Bun.build configuration in `scripts/build.ts`
- Targets Node.js runtime with external packages
- Adds executable shebang to output
- Cleans and rebuilds to `dist/` directory

**Code Quality**: Biome replaces ESLint + Prettier
- Enforces unused imports/variables as errors
- Uses double quotes and space indentation
- Runs automatically on git commit via husky + lint-staged

**Testing**: Uses bun:test with Jest-compatible API
- Mock functions and module mocking via `mock()` and `mock.module()`
- Factory functions for creating test data (e.g., `createMockProject()`)
- Test file naming convention: `*.spec.ts`

**TypeScript**: Configured for modern features with strict checking
- ES modules with bundler resolution
- Targets ESNext for Bun runtime compatibility
- Local imports without `.js` extensions, MCP SDK imports require `.js`

## Key Implementation Notes

**MCP Protocol**: Server name is set to "todoist" and version is read from package.json. The server communicates via stdio transport, which is standard for MCP servers.

**Error Patterns**: Use `McpError` with appropriate `ErrorCode` enum values for consistent error handling across the MCP interface.

**Commit Workflow**: All commits automatically run Biome formatting via git hooks. Keep commits small and atomic - the project follows a pattern of committing tooling/dependency changes separately from feature implementation. Prefer `chore:` for skeleton implementations that don't yet provide user-facing functionality.

**Commit Messages**: Follow Conventional Commits specification (https://conventionalcommits.org/):
- `feat:` for new features
- `fix:` for bug fixes
- `chore:` for tooling, dependencies, configuration
- `ci:` for CI/CD, GitHub Actions, and build system changes
- `docs:` for documentation changes
- `style:` for formatting, code style changes
- `refactor:` for code refactoring without functional changes