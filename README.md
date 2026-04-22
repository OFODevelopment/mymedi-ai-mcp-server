# @mymedi-ai/mcp-server

MCP server for healthcare AI. Connect Claude Desktop, Cursor, VS Code, or any MCP client to **20 HIPAA-compliant medical billing + clinical intelligence tools** backed by 81K+ codes and 7 free government data sources.

## Quick Start

Two ways to pay — pick either:

### Option A: Register for credits (10 free)

```bash
curl -X POST https://mymedi-ai.com/bot-marketplace/register \
  -H "Content-Type: application/json" \
  -d '{"name": "my-agent"}'
# → { apiKey, credits: 10 }
```

### Option B: Anonymous per-call USDC (no signup)

Send USDC on Base to the treasury wallet and include the signed payment in `X-402-Payment` header. True agent-to-agent commerce. See [`/agent/v1/pricing`](https://mymedi-ai.com/agent/v1/pricing) for details.

### Or try free

```bash
curl "https://mymedi-ai.com/agent/v1/demo?code=99213"
```

Returns basic code metadata (10/hour rate-limited). Paid tier unlocks RVU, Medicare reimbursement (PFS + OPPS), crosswalks, and AI features.

## Client Setup

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

## Tools (20)

### Medical Coding
| Tool | Description | Price |
|------|-------------|-------|
| `code_lookup` | Look up ICD-10, CPT, HCPCS codes (81K+ codes) | $0.001 |
| `code_suggest` | AI code suggestions from clinical text | $0.01 |
| `code_validate` | Validate code correctness and status | $0.005 |
| `code_crossref` | Cross-reference codes across ICD-10/CPT/HCPCS | $0.02 |
| `code_reimbursement` | Medicare PFS + OPPS reimbursement rates (RVU, $) | $0.01 |

### Prior Auth & Claims
| Tool | Description | Price |
|------|-------------|-------|
| `pa_predict` | Prior auth approval prediction (0–1) | $0.05 |
| `pa_status` | Check prior auth status | $0.02 |
| `claims_validate` | Pre-submission claims validation | $0.05 |
| `ner_extract` | Extract medical entities from clinical text | $0.02 |
| `compliance_audit` | HIPAA compliance audit | $0.25 |

### Drug Intelligence
| Tool | Description | Price |
|------|-------------|-------|
| `drug_lookup` | OpenFDA drug info + adverse events | $0.01 |
| `drug_interactions` | FDA co-reported adverse event signals | $0.03 |
| `drug_rxnorm` | NIH RxNorm + clinical interactions | $0.02 |
| `drug_enrich` | AI-enriched drug intelligence | $0.03 |

### Providers & Market
| Tool | Description | Price |
|------|-------------|-------|
| `provider_search` | NPI provider directory search | $0.005 |
| `provider_enrich` | AI-enriched provider intelligence | $0.05 |
| `provider_payments` | Sunshine Act physician payments (CMS Open Payments) | $0.02 |
| `market_analysis` | Specialty market analysis by state | $0.10 |

### Clinical & Public Health
| Tool | Description | Price |
|------|-------------|-------|
| `trials_search` | Active clinical trials (ClinicalTrials.gov) | $0.03 |
| `disease_surveillance` | CDC NNDSS case counts + trends | $0.02 |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MCP_API_KEY` | API key from registration (omit for anonymous USDC) | — |
| `MCP_API_BASE_URL` | API base URL | `https://mymedi-ai.com` |

## Payment

- **Free tier**: 10 starter credits on registration ($0.01 sample — enough to try the $0.001 and $0.005 tiers)
- **Credit rate**: $0.001 per credit (1 credit = 1 cheapest call)
- **x402 USDC**: Pay per call on Base chain — no signup, agent-native commerce
- **Stripe**: Credit packages at [mymedi-ai.com/bot-marketplace/credits/pricing](https://mymedi-ai.com/bot-marketplace/credits/pricing)
- **USDC deposit**: Send to treasury wallet and redeem for credits

## Credit Balance Headers

Every paid response includes:

| Header | Meaning |
|--------|---------|
| `X-Credits-Remaining` | Balance after this call |
| `X-Credits-Spent` | Credits this call consumed |
| `X-Credits-Warning` | `low` (<50), `critical` (<10), `depleted` (0) |
| `X-Credits-Action-Required` | `top-up` or `top-up-soon` when balance is tight |

Your SDK/agent can watch for these to trigger auto-top-up.

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

## Data Sources

All 7 license-free government sources:

- **ICD-10 / HCPCS / CPT**: CMS PFS RVU 2026 (public domain)
- **NPI provider directory**: CMS (public domain)
- **OpenFDA**: drug labels, adverse events, interactions
- **RxNorm**: NIH normalized drug terminology
- **ClinicalTrials.gov**: active clinical trials
- **CMS Open Payments**: Sunshine Act physician payments
- **CDC NNDSS**: notifiable disease surveillance

## Links

- [API Discovery](https://mymedi-ai.com/agent/v1/discovery)
- [Try the demo](https://mymedi-ai.com/agent/v1/demo?code=99213)
- [Register for API Key](https://mymedi-ai.com/bot-marketplace/register)
- [Pricing](https://mymedi-ai.com/bot-marketplace/credits/pricing)
- [Marketplace homepage](https://mymedi-ai.com/bot-marketplace/)

## License

MIT
