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

# MCP Server Testing
bun run inspector # Build and launch MCP Inspector for visual testing
bun run preinspector # Build server (runs automatically before inspector)

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
├── index.ts      # Minimal entry point (delegates to server.ts)
├── server.ts     # MCP server initialization and configuration
├── mcp/          # Modular MCP architecture with colocation
│   ├── resources/ # Resource handlers with co-located schemas
│   │   ├── index.ts      # registerResources() aggregator
│   │   └── projects.ts   # Project resources + Zod schemas
│   └── tools/     # Tool handlers with co-located schemas  
│       ├── index.ts      # registerTools() aggregator
│       └── projects.ts   # Project tools + Zod schemas (future)
└── lib/
    └── todoist/  # Todoist API client wrapper
        ├── client.ts     # TodoistClient class with CRUD operations
        ├── types.ts      # TypeScript types and interfaces
        └── client.spec.ts # Comprehensive test suite
scripts/          # Build and utility scripts
├── build.ts      # Bun.build configuration
dist/             # Built output (executable with shebang)
```

## Architecture

**Modular MCP Architecture**: The project uses a colocation pattern for better maintainability:

- **Entry Point**: `src/index.ts` is minimal and delegates to `src/server.ts`
- **Server Initialization**: `src/server.ts` handles McpServer setup, environment variables, and component registration
- **Resource/Tool Registration**: Modular functions (`registerResources`, `registerTools`) aggregate feature-specific handlers
- **Colocation Principle**: Schemas are co-located with their usage in resource/tool files rather than centralized

**MCP Server Structure**: Uses `McpServer` (high-level API) from `@modelcontextprotocol/sdk` instead of low-level `Server` class:

- **Automatic Capability Detection**: Server capabilities inferred from registered resources/tools
- **Simplified Registration**: `.resource()` and `.tool()` methods vs manual request handlers
- **Zod Integration**: Direct Zod schema usage for type-safe parameter validation
- **Error Handling**: Framework handles McpError conversion automatically

**Todoist Integration Layer**: Complete `TodoistClient` class in `src/lib/todoist/client.ts`:

- **API Wrapper**: Wraps `@doist/todoist-api-typescript` with project CRUD operations
- **Pagination**: Automatic pagination handling in `getProjects()` method  
- **Environment**: Accepts API token as string parameter, environment handling in calling code

**Current Implementation State**: 
- **Resources**: Project list (`todoist://projects`) and individual projects (`todoist://projects/{id}`) implemented
- **Tools**: Structure ready but not yet implemented (placeholder in `src/mcp/tools/projects.ts`)
- **Testing**: Comprehensive TodoistClient test suite + MCP Inspector for visual testing
- **Architecture**: Extensible structure for adding tasks, labels, comments features

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
- MCP Inspector (`@modelcontextprotocol/inspector`) for visual server testing

**TypeScript**: Configured for modern features with strict checking
- ES modules with bundler resolution
- Targets ESNext for Bun runtime compatibility
- Local imports without `.js` extensions, MCP SDK imports require `.js`

## Key Implementation Notes

**MCP Protocol**: Server name is set to "todoist" and version is read from package.json. The server communicates via stdio transport, which is standard for MCP servers. Uses McpServer high-level API for simplified development.

**Environment Variables**: `TODOIST_API_TOKEN` is required for server operation. The server validates this on startup and exits with error if missing.

**Colocation Pattern**: Schemas are defined within the same file as their usage (resources/tools) rather than centralized, improving maintainability and reducing coupling.

**Extension Strategy**: New features should follow the pattern:
- Add new files to `src/mcp/resources/` or `src/mcp/tools/` 
- Co-locate Zod schemas with their usage
- Register in respective `index.ts` aggregators
- Use `ResourceTemplate` for parameterized resources

**Commit Workflow**: All commits automatically run Biome formatting via git hooks. Keep commits small and atomic - the project follows a pattern of committing tooling/dependency changes separately from feature implementation. Prefer `chore:` for skeleton implementations that don't yet provide user-facing functionality.

**Commit Messages**: Follow Conventional Commits specification (https://conventionalcommits.org/):
- `feat:` for new features
- `fix:` for bug fixes
- `chore:` for tooling, dependencies, configuration
- `ci:` for CI/CD, GitHub Actions, and build system changes
- `docs:` for documentation changes
- `style:` for formatting, code style changes
- `refactor:` for code refactoring without functional changes