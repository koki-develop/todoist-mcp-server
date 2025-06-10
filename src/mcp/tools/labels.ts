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

const getLabelsSchema = {};

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
}
