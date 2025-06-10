import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { TodoistClient } from "../../lib/todoist/client";

// Tool-related schemas (used only in this file)
const createLabelSchema = {
  name: z.string().min(1).describe("Name of the label to create"),
  color: z
    .string()
    .optional()
    .describe("Color code or key for the label (optional)"),
  order: z
    .number()
    .nullable()
    .optional()
    .describe("Display order position (optional)"),
  isFavorite: z
    .boolean()
    .optional()
    .describe("Mark label as favorite (optional)"),
};

const updateLabelSchema = {
  id: z.string().min(1).describe("ID of the label to update"),
  name: z
    .string()
    .min(1)
    .optional()
    .describe("New name for the label (optional)"),
  color: z
    .string()
    .optional()
    .describe("New color code or key for the label (optional)"),
  order: z
    .number()
    .nullable()
    .optional()
    .describe("New display order position (optional)"),
  isFavorite: z.boolean().optional().describe("New favorite status (optional)"),
};

const getLabelsSchema = {};

const deleteLabelSchema = {
  id: z
    .string()
    .min(1)
    .describe("Unique identifier of the label to permanently delete"),
};

export function registerLabelTools(server: McpServer, client: TodoistClient) {
  // Create a new label
  server.tool(
    "create_label",
    "Create a new personal label with customizable properties including name, color, display order, and favorite status. Returns the complete label object with all metadata upon successful creation.",
    createLabelSchema,
    async ({ name, color, order, isFavorite }) => {
      const label = await client.createLabel({
        name,
        color,
        order,
        isFavorite,
      });

      return {
        content: [
          {
            type: "text",
            text: `Label "${label.name}" created successfully with ID: ${label.id}`,
          },
          {
            type: "text",
            text: JSON.stringify(label, null, 2),
          },
        ],
      };
    },
  );

  // Update an existing label
  server.tool(
    "update_label",
    "Modify the properties of an existing personal label. Allows you to change the label's name, color, display order, and favorite status. All parameters except the label ID are optional, so you can update only the specific properties you want to change. Returns the updated label object with all current metadata.",
    updateLabelSchema,
    async ({ id, name, color, order, isFavorite }) => {
      const label = await client.updateLabel(id, {
        name,
        color,
        order,
        isFavorite,
      });

      return {
        content: [
          {
            type: "text",
            text: `Label "${label.name}" (ID: ${label.id}) updated successfully`,
          },
          {
            type: "text",
            text: JSON.stringify(label, null, 2),
          },
        ],
      };
    },
  );

  // Get all labels
  server.tool(
    "get_labels",
    "Retrieve all personal labels accessible to the authenticated user with their complete metadata including name, color, order, and favorite status. Returns a comprehensive list of labels that can be used for task organization and filtering. This tool provides read-only access to label information and handles pagination automatically.",
    getLabelsSchema,
    async () => {
      const labels = await client.getLabels();

      return {
        content: [
          {
            type: "text",
            text: `Retrieved ${labels.length} label(s)`,
          },
          {
            type: "text",
            text: JSON.stringify(labels, null, 2),
          },
        ],
      };
    },
  );

  // Delete a label
  server.tool(
    "delete_label",
    "PERMANENTLY delete a personal label by its ID. WARNING: This action is IRREVERSIBLE and will automatically remove the label from all associated tasks. Use with caution as deleted labels cannot be recovered. Validates the label ID and provides clear success/failure messaging.",
    deleteLabelSchema,
    async ({ id }) => {
      const success = await client.deleteLabel(id);

      return {
        content: [
          {
            type: "text",
            text: success
              ? `Label with ID "${id}" has been permanently deleted successfully. The label has been automatically removed from all associated tasks.`
              : `Failed to delete label with ID "${id}". The label may not exist or you may not have permission to delete it.`,
          },
        ],
      };
    },
  );
}
