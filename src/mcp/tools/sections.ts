import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { TodoistClient } from "../../lib/todoist/client";

// Tool-related schemas (used only in this file)
const createSectionSchema = {
  name: z.string().min(1).describe("Name of the section to create"),
  projectId: z
    .string()
    .min(1)
    .describe("ID of the project to create the section in"),
  order: z
    .number()
    .optional()
    .describe("Order of the section within the project (optional)"),
};

const updateSectionSchema = {
  id: z.string().min(1).describe("ID of the section to update"),
  name: z.string().min(1).describe("New name for the section"),
};

const deleteSectionSchema = {
  id: z.string().min(1).describe("ID of the section to delete"),
};

const getSectionsSchema = {
  projectId: z
    .string()
    .min(1)
    .describe("ID of the project to retrieve sections from"),
};

const getSectionSchema = {
  id: z.string().min(1).describe("ID of the section to retrieve"),
};

export function registerSectionTools(server: McpServer, client: TodoistClient) {
  // Create a new section
  server.tool(
    "create_section",
    "Create a new section within a Todoist project to organize tasks. Sections help categorize and group related tasks within a project. You can optionally specify the order to control where the section appears in the project hierarchy. Returns the complete section object with all metadata upon successful creation.",
    createSectionSchema,
    async ({ name, projectId, order }) => {
      const section = await client.createSection({
        name,
        projectId,
        order,
      });

      return {
        content: [
          {
            type: "text",
            text: `Section "${section.name}" created successfully with ID: ${section.id}`,
          },
          {
            type: "text",
            text: JSON.stringify(section, null, 2),
          },
        ],
      };
    },
  );

  // Update an existing section
  server.tool(
    "update_section",
    "Modify the name of an existing Todoist section. Currently, only the section name can be updated. The section will maintain its position, project assignment, and all associated tasks. Returns the updated section object with current metadata.",
    updateSectionSchema,
    async ({ id, name }) => {
      const section = await client.updateSection(id, {
        name,
      });

      return {
        content: [
          {
            type: "text",
            text: `Section "${section.name}" (ID: ${section.id}) updated successfully`,
          },
          {
            type: "text",
            text: JSON.stringify(section, null, 2),
          },
        ],
      };
    },
  );

  // Delete a section
  server.tool(
    "delete_section",
    "Permanently delete a Todoist section by its unique identifier. This action will remove the section and move any tasks in this section to the project's main area (no section). This operation cannot be undone, so use with caution. Returns confirmation of successful deletion or failure notification.",
    deleteSectionSchema,
    async ({ id }) => {
      const success = await client.deleteSection(id);

      return {
        content: [
          {
            type: "text",
            text: success
              ? `Section (ID: ${id}) deleted successfully`
              : `Failed to delete section (ID: ${id})`,
          },
        ],
      };
    },
  );

  // Get all sections for a project
  server.tool(
    "get_sections",
    "Retrieve all sections within a specific Todoist project. Returns a comprehensive list of sections with their metadata such as name, order, creation and update timestamps, and status information. Sections are returned in their display order within the project.",
    getSectionsSchema,
    async ({ projectId }) => {
      const sections = await client.getSections({ projectId });

      return {
        content: [
          {
            type: "text",
            text: `Retrieved ${sections.length} section(s) from project ${projectId}`,
          },
          {
            type: "text",
            text: JSON.stringify(sections, null, 2),
          },
        ],
      };
    },
  );

  // Get a single section by ID
  server.tool(
    "get_section",
    "Access detailed information for a specific Todoist section using its unique identifier. Provides complete section metadata including name, project assignment, order position, timestamps, and status flags.",
    getSectionSchema,
    async ({ id }) => {
      const section = await client.getSection(id);

      return {
        content: [
          {
            type: "text",
            text: `Retrieved section "${section.name}" (ID: ${section.id})`,
          },
          {
            type: "text",
            text: JSON.stringify(section, null, 2),
          },
        ],
      };
    },
  );
}
