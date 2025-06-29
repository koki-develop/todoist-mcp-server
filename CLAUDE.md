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
bun dist/index.js # Run the built MCP server
# or for development: bun run src/index.ts

# Docker
docker build -t todoist-mcp-server .  # Build Docker image
docker run -e TODOIST_API_TOKEN=token todoist-mcp-server  # Run in container

# Testing
bun test          # Run all tests
bun test src/lib/todoist/client.spec.ts  # Run specific test file

# Code quality
bun run lint      # Check code with Biome
bun run format    # Format and fix code with Biome
bun run typecheck # Run TypeScript type checking

# MCP Server Testing
bun run inspector # Build and launch MCP Inspector for visual testing
bun run preinspector # Build server (runs automatically before inspector)

# GitHub Actions linting (requires mise tools)
actionlint        # Lint GitHub Actions workflow files
ghalint run       # Check GitHub Actions policies
zizmor . --persona=auditor  # Security audit GitHub Actions

# Action version management
pinact run -u     # Update GitHub Actions to latest versions

# Development workflow
bun run prepare   # Install git hooks (runs automatically on install)
```

## Project Structure

```
src/              # Source code
├── index.ts      # Minimal entry point (delegates to server.ts)
├── server.ts     # MCP server initialization and configuration
├── mcp/          # Modular MCP architecture with colocation
│   └── tools/     # Tool handlers with co-located schemas  
│       ├── index.ts      # registerTools() aggregator
│       ├── projects.ts   # Project tools (CRUD + read operations)
│       ├── sections.ts   # Section tools (CRUD + read operations)
│       ├── tasks.ts      # Task tools (CRUD + close/reopen + read operations)
│       ├── labels.ts     # Label tools (create + update + individual/list read + delete operations)
│       ├── comments.ts   # Comment tools (separate task/project creation + read with pagination + update/delete)
└── lib/
    └── todoist/  # Todoist API client wrapper
        ├── client.ts     # TodoistClient class with CRUD operations
        ├── types.ts      # TypeScript types and interfaces
        └── client.spec.ts # Comprehensive test suite
scripts/          # Build and utility scripts
├── build.ts      # Bun.build configuration
dist/             # Built output (Bun runtime compatible)
Dockerfile        # Multi-stage Docker build with Bun
```

## Architecture

**Tools-Only MCP Architecture**: The project uses a colocation pattern for better maintainability:

- **Entry Point**: `src/index.ts` is minimal and delegates to `src/server.ts`
- **Server Initialization**: `src/server.ts` handles McpServer setup, environment variables, and tool registration
- **Tool Registration**: Modular function (`registerTools`) aggregates feature-specific handlers
- **Centralized Schema System**: All Zod schemas are centralized in `src/lib/todoist/types.ts` with TypeScript types inferred via z.infer

**MCP Server Structure**: Uses `McpServer` (high-level API) from `@modelcontextprotocol/sdk` instead of low-level `Server` class:

- **Automatic Capability Detection**: Server capabilities inferred from registered tools
- **Simplified Registration**: `.tool()` methods vs manual request handlers
- **Zod Integration**: Direct Zod schema usage for type-safe parameter validation
- **Error Handling**: Framework handles McpError conversion automatically

**Todoist Integration Layer**: Complete `TodoistClient` class in `src/lib/todoist/client.ts`:

- **API Wrapper**: Wraps `@doist/todoist-api-typescript` with complete project, section, task, label, and comment CRUD operations plus bulk task movement operations
- **Pagination**: Automatic pagination handling in `getProjects()`, `getSections()`, `getTasks()`, `getLabels()`, `getTaskComments()`, and `getProjectComments()` methods using cursor-based iteration
- **Individual Retrieval**: Direct methods for getting individual items: `getProject()`, `getSection()`, `getTask()`, `getLabel()`
- **Comment Management**: Full comment support via separate `createTaskComment()` and `createProjectComment()` methods, plus `getTaskComments()`, `getProjectComments()`, `updateComment()`, and `deleteComment()` with file attachment capabilities
- **Task Movement**: Bulk task reorganization via `moveTasksToProject()`, `moveTasksToSection()`, and `moveTasksToParent()` for efficient workflow management
- **Environment**: Accepts API token as string parameter, environment handling in calling code

**Current Implementation State**: 
- **Tools**: Complete tools-only implementation with both read and write operations (29 total tools):
  - **Project Tools**: `get_projects`, `get_project`, `create_project`, `update_project`, `delete_project`
  - **Section Tools**: `get_sections`, `get_section`, `create_section`, `update_section`, `delete_section`
  - **Task Tools**: `get_tasks` (with filtering), `get_tasks_by_filter` (advanced filter syntax), `get_task`, `create_task` (with deadline support), `update_task` (with deadline support), `delete_task`, `close_task`, `reopen_task`, `move_tasks_to_project`, `move_tasks_to_section`, `move_tasks_to_parent`
  - **Label Tools**: `create_label`, `update_label`, `get_label`, `get_labels`, `delete_label`
  - **Comment Tools**: `create_task_comment`, `create_project_comment`, `get_task_comments`, `get_project_comments`, `update_comment`, `delete_comment`
- **Testing**: Comprehensive TodoistClient test suite with pagination tests + MCP Inspector for visual testing
- **Architecture**: Extensible structure with full comment management

## Development Tooling

**Tool Version Management**: Uses `mise.toml` for reproducible environments
- Bun 1.2.15 for development, build, and runtime
- Node.js 22.16.0 (referenced but project uses Bun runtime)
- Rust 1.87.0 for cargo-based tools
- GitHub Actions linting tools: actionlint, ghalint (via aqua), zizmor (via cargo)

**Build System**: Custom Bun.build configuration in `scripts/build.ts`
- Targets Bun runtime with external packages
- No shebang for Docker compatibility
- Automatically sets executable permissions via `chmod +x dist/index.js`
- Cleans and rebuilds to `dist/` directory

**Code Quality**: Biome replaces ESLint + Prettier
- Enforces unused imports/variables as errors
- Uses double quotes and space indentation
- Runs automatically on git commit via husky + lint-staged

**Testing**: Uses bun:test with Jest-compatible API
- Mock functions and module mocking via `mock()` and `mock.module()`
- Factory functions for creating test data (e.g., `createMockProject()`, `createMockSection()`, `createMockTask()`, `createMockLabel()`, `createMockComment()`)
- Test file naming convention: `*.spec.ts`
- MCP Inspector (`@modelcontextprotocol/inspector`) for visual server testing
- Run single test file: `bun test src/lib/todoist/client.spec.ts`
- Pagination testing pattern: mock multiple API responses with `nextCursor` for comprehensive coverage
- Advanced feature testing: comment management with attachments and bulk task movement operations

**CI/CD**: Comprehensive GitHub Actions workflows
- **ci.yml**: lint, typecheck, test, build (with Bun executable test), and Docker container testing
- **actions-lint.yml**: GitHub Actions workflow validation (actionlint, ghalint, zizmor)
- **release.yml**: Automated release workflow with release-please and Docker publishing to GHCR
- **claude.yml**: Claude Code integration workflow triggered by @claude mentions (repository owner only)
- All jobs use pinned action versions (managed with pinact) and minimal permissions

**TypeScript**: Configured for modern features with strict checking
- ES modules with bundler resolution
- Targets ESNext for Bun runtime compatibility
- Local imports without `.js` extensions, MCP SDK imports require `.js`

## Key Implementation Notes

**MCP Protocol**: Server name is set to "todoist" and version is read from package.json. The server communicates via stdio transport, which is standard for MCP servers. Uses McpServer high-level API for simplified development.

**Environment Variables**: `TODOIST_API_TOKEN` is required for server operation. The server validates this on startup and exits with error if missing.

**Tools-Only Architecture Migration**: The project migrated from a mixed resources/tools approach to tools-only for better client compatibility. Many MCP clients have limited or no support for MCP resources, and resources cannot accept complex parameters for filtering. All previous resource functionality is now available through tools with enhanced capabilities:
- `get_projects` and `get_project` replace the previous `todoist://projects` resources
- `get_sections` and `get_section` provide project section management
- `get_tasks` and `get_task` replace the previous `todoist://tasks` resources with added filtering options
- `get_labels` and `get_label` provide comprehensive label management functionality

**Unified Schema Architecture**: All Zod schemas and TypeScript types are centralized in `src/lib/todoist/types.ts` for consistency and maintainability. This provides a single source of truth with z.infer for automatic type synchronization.

**MCP Tool Development Pattern**: For server.tool() implementations:
- Import parameter schemas from `src/lib/todoist/types.ts` (e.g., `updateProjectParamsSchema`)
- Use `ZodRawShape` (object with Zod schemas) instead of `ZodObject` for parameter schemas
- Leverage centralized schemas with comprehensive `.describe()` annotations for better UX
- Include detailed tool descriptions explaining functionality, parameters, and safety warnings
- Return structured responses with both success messages and complete object data
- TodoistClient methods follow unified `(params: Params)` pattern for consistency

**API Parameter Mapping**: When interfacing with Todoist API:
- Handle parameter transformations in TodoistClient (e.g., `childOrder` → `order`)
- Manage exclusive parameters properly (e.g., `dueDate` vs `dueDatetime` - prefer datetime)
- Deadline support: `deadlineDate` (YYYY-MM-DD format) and `deadlineLang` (18 supported languages: en, da, pl, zh, ko, de, pt, ja, it, fr, sv, ru, es, nl, fi, nb, tw)
- Always handle pagination with cursor-based iteration for list methods

**Docker Support**: Multi-stage Dockerfile for efficient containerization:
- Uses official `oven/bun:1.2.15` image for all stages (supports both amd64 and arm64)
- Separates dev/prod dependencies for optimal layer caching
- Runs as non-root `bun` user for security
- Requires `TODOIST_API_TOKEN` environment variable
- OCI source label for GitHub Container Registry integration
- Automated publishing to `ghcr.io/koki-develop/todoist-mcp-server` on releases
- Multi-platform support via docker/setup-qemu-action for ARM64 emulation

**Automated Releases**: Fully automated release workflow using release-please:
- **Trigger**: Conventional commits pushed to main branch
- **Process**: Creates release PRs automatically, then publishes releases when merged
- **Versioning**: Semantic versioning based on commit types (`feat:`, `fix:`, `BREAKING CHANGE:`)
- **Docker Publishing**: Automatic image builds and publishing to GHCR with version tags
- **Security**: Uses GitHub token authentication with minimal permissions
- **Multi-Platform**: Supports both linux/amd64 and linux/arm64 architectures using QEMU emulation

**Claude Code Integration**: Repository includes GitHub Actions workflow for Claude Code integration:
- Triggered by @claude mentions in issues, PR comments, and reviews
- Restricted to repository owner only for security
- Uses anthropic_api_key from GitHub secrets
- Automatically handles code changes, commits, and PR interactions
- **Tool Permissions**: Configured with `allowed_tools` for development commands (bun run lint/format/typecheck/build, bun test), GitHub Actions linters (actionlint, ghalint, zizmor), git operations (git rebase), and dependency management (pinact)

**Extension Strategy**: New features should follow the pattern:
- Add new files to `src/mcp/tools/` 
- Define Zod schemas in `src/lib/todoist/types.ts` following `...ParamsSchema` naming convention
- Export corresponding TypeScript types using z.infer
- Register tools in `src/mcp/tools/index.ts` aggregator
- Follow existing tool patterns for consistent API design with unified `(params: Params)` interface

**Commit Workflow**: All commits automatically run Biome formatting via git hooks. Keep commits small and atomic - the project follows a pattern of committing tooling/dependency changes separately from feature implementation. Prefer `chore:` for skeleton implementations that don't yet provide user-facing functionality.

**Commit Messages**: Follow Conventional Commits specification (https://conventionalcommits.org/):
- `feat:` for new features
- `fix:` for bug fixes
- `chore:` for tooling, dependencies, configuration
- `ci:` for CI/CD, GitHub Actions, and build system changes
- `docs:` for documentation changes
- `style:` for formatting, code style changes
- `refactor:` for code refactoring without functional changes

**Important: CHANGELOG.md Management**: The `CHANGELOG.md` file is automatically generated by release-please. Never manually edit this file - all changes will be generated from conventional commit messages when releases are created.

## MCP Server Testing with Playwright

When testing the MCP server functionality, use the Playwright MCP server to automate MCP Inspector operations:

1. **Access MCP Inspector**: Navigate to http://127.0.0.1:6274 
2. **Connect to Server**: Click "Connect" button to establish connection
3. **Test Core Operations**: Systematically test tool categories:
   - **Projects**: `get_projects`, `create_project`, `delete_project`  
   - **Sections**: `create_section`, `get_sections`
   - **Tasks**: `create_task`, `get_tasks`, `get_tasks_by_filter`, `close_task`, `move_tasks_to_project`, `move_tasks_to_section`, `move_tasks_to_parent`
   - **Labels**: `create_label`, `update_label`, `get_label`, `get_labels`, `delete_label`
   - **Comments**: `create_task_comment`, `create_project_comment`, `get_task_comments`, `get_project_comments`, `update_comment`, `delete_comment`
4. **Verify Results**: Check Japanese text support, hierarchical data structure, comment management, and bulk task movement operations

This provides comprehensive validation of all 29 MCP tools through automated browser interaction.
