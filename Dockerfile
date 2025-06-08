# ============================================================================
# Base stage
# ============================================================================
FROM oven/bun:1.2.15 AS base
WORKDIR /usr/src/app

# ============================================================================
# Install dependencies stage
# ============================================================================
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install production dependencies
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# ============================================================================
# Build stage
# ============================================================================
FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production
RUN bun run build

# ============================================================================
# Release stage
# ============================================================================
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json .

# Add OCI source label for better image metadata
LABEL org.opencontainers.image.source=https://github.com/koki-develop/todoist-mcp-server

# Run as non-root user
USER bun

# Run the MCP server
ENTRYPOINT ["bun", "run", "dist/index.js"]