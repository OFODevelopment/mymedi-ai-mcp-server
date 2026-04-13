#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { MCP_TOOLS, getToolByName } from './tools.js';

const API_BASE_URL = process.env.MCP_API_BASE_URL || 'https://mymedi-ai.com';
const API_KEY = process.env.MCP_API_KEY || '';

const server = new McpServer({
  name: 'mymedi-ai',
  version: '1.0.0',
});

for (const tool of MCP_TOOLS) {
  server.tool(
    tool.name,
    tool.description,
    tool.schema,
    async (params) => {
      const toolDef = getToolByName(tool.name);
      if (!toolDef) {
        return { content: [{ type: 'text', text: `Unknown tool: ${tool.name}` }], isError: true };
      }

      try {
        const response = await fetch(`${API_BASE_URL}${toolDef.endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(API_KEY && { 'X-API-Key': API_KEY }),
            'X-Agent-ID': 'mcp-client',
            'User-Agent': '@mymedi-ai/mcp-server/1.0',
          },
          body: JSON.stringify(params),
        });

        if (response.status === 402) {
          const paymentInfo = await response.json();
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                error: 'payment_required',
                message: `This tool costs ${toolDef.price} per call. Register at ${API_BASE_URL}/bot-marketplace/register for an API key with 100 free starter credits.`,
                price: toolDef.price,
                register: `${API_BASE_URL}/bot-marketplace/register`,
                ...paymentInfo,
              }, null, 2),
            }],
            isError: true,
          };
        }

        if (!response.ok) {
          const error = await response.json().catch(() => ({ message: response.statusText }));
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ error: true, status: response.status, ...error }, null, 2),
            }],
            isError: true,
          };
        }

        const data = await response.json();

        const creditsSpent = response.headers.get('X-Credits-Spent');
        const creditsRemaining = response.headers.get('X-Credits-Remaining');
        if (creditsSpent) {
          data._billing = {
            creditsSpent: parseInt(creditsSpent, 10),
            creditsRemaining: creditsRemaining ? parseInt(creditsRemaining, 10) : undefined,
            priceUSD: toolDef.price,
          };
        }

        return {
          content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        };
      } catch (err) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: true,
              message: err.message,
              hint: 'Ensure MCP_API_BASE_URL and MCP_API_KEY environment variables are set.',
            }, null, 2),
          }],
          isError: true,
        };
      }
    }
  );
}

// Smithery sandbox support — allows scanning tools without real credentials
export function createSandboxServer() {
  const sandboxServer = new McpServer({
    name: 'mymedi-ai',
    version: '1.0.0',
  });

  for (const tool of MCP_TOOLS) {
    sandboxServer.tool(
      tool.name,
      tool.description,
      tool.schema,
      async () => ({ content: [{ type: 'text', text: 'sandbox' }] }),
    );
  }

  return sandboxServer;
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Only auto-connect when run directly (not imported for scanning)
const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('index.js') ||
  process.argv[1].endsWith('mymedi-ai-mcp')
);
if (isDirectRun) {
  main();
}
