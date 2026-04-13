# @mymedi-ai/mcp-server

MCP server for healthcare AI. Connect Claude Desktop, Cursor, VS Code, or any MCP client to 12 HIPAA-compliant medical billing tools.

## Quick Start

```bash
# Get a free API key (100 starter credits)
curl -X POST https://mymedi-ai.com/bot-marketplace/register \
  -H "Content-Type: application/json" \
  -d '{"name": "my-agent", "description": "My healthcare agent"}'
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mymedi-ai": {
      "command": "npx",
      "args": ["-y", "@mymedi-ai/mcp-server"],
      "env": {
        "MCP_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Cursor / VS Code

Add to MCP settings:

```json
{
  "mymedi-ai": {
    "command": "npx",
    "args": ["-y", "@mymedi-ai/mcp-server"],
    "env": {
      "MCP_API_KEY": "your-api-key"
    }
  }
}
```

### Claude Code

```bash
claude mcp add mymedi-ai -- npx -y @mymedi-ai/mcp-server
```

## Tools

| Tool | Description | Price |
|------|-------------|-------|
| `code_lookup` | Look up ICD-10, CPT, HCPCS codes | $0.001 |
| `code_suggest` | AI code suggestions from clinical text | $0.01 |
| `code_validate` | Validate code correctness and status | $0.005 |
| `pa_predict` | Prior auth approval prediction (0-1) | $0.05 |
| `pa_status` | Check prior auth status | $0.02 |
| `ner_extract` | Extract medical entities from text | $0.02 |
| `claims_validate` | Pre-submission claims validation | $0.05 |
| `compliance_audit` | HIPAA compliance audit | $0.25 |
| `provider_search` | Search NPI provider directory | $0.005 |
| `provider_enrich` | AI-enriched provider intelligence | $0.05 |
| `drug_enrich` | Drug info via OpenFDA | $0.03 |
| `market_analysis` | Healthcare market analysis by state | $0.10 |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MCP_API_KEY` | API key from registration | (required) |
| `MCP_API_BASE_URL` | API base URL | `https://mymedi-ai.com` |

## Payment

- **Free tier**: 100 starter credits on registration
- **Credit rate**: $0.001 per credit
- **x402**: Pay-per-call with USDC on Base chain
- **Stripe**: Purchase credit packages at [mymedi-ai.com](https://mymedi-ai.com)

## SDK

For programmatic use without MCP, install the SDK:

```bash
npm install @mymedi-ai/sdk
```

```javascript
import { MyMediAI } from '@mymedi-ai/sdk';

const client = new MyMediAI({ apiKey: 'your-api-key' });
const result = await client.codeLookup('M79.3');
```

## Links

- [API Documentation](https://mymedi-ai.com/agent/v1/discovery)
- [Register for API Key](https://mymedi-ai.com/bot-marketplace/register)
- [Pricing](https://mymedi-ai.com/bot-marketplace/credits/pricing)

## License

MIT
