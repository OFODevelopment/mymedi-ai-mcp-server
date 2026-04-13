/**
 * MCP Tool Definitions for MyMedi-AI Healthcare Agent API
 * 12 x402-protected REST endpoints mapped to MCP tool format.
 * Uses Zod schemas (required by @modelcontextprotocol/sdk >=1.28).
 */
import { z } from 'zod';

export const MCP_TOOLS = [
  // --- Medical Coding ---
  {
    name: 'code_lookup',
    description: 'Look up medical codes (ICD-10, CPT, HCPCS) by code string. Returns description, category, active status, and related codes.',
    price: '$0.001',
    endpoint: '/agent/v1/codes/lookup',
    schema: {
      code: z.string().describe('Medical code to look up (e.g., "M79.3", "99213", "E0601")'),
      codeType: z.enum(['icd10', 'cpt', 'hcpcs']).optional().describe('Code system (auto-detected if omitted)'),
    },
  },
  {
    name: 'code_suggest',
    description: 'Get AI-powered medical code suggestions from a clinical description. Returns ranked code suggestions with relevance scores.',
    price: '$0.01',
    endpoint: '/agent/v1/codes/suggest',
    schema: {
      description: z.string().describe('Clinical description to find codes for (e.g., "chronic lower back pain")'),
      codeType: z.enum(['icd10', 'cpt', 'hcpcs']).optional().describe('Limit to specific code system'),
      limit: z.number().optional().describe('Max suggestions to return (default 10, max 50)'),
    },
  },
  {
    name: 'code_validate',
    description: 'Validate a medical code for correctness, active status, and context. Returns warnings and errors.',
    price: '$0.005',
    endpoint: '/agent/v1/codes/validate',
    schema: {
      code: z.string().describe('Medical code to validate'),
      codeType: z.enum(['icd10', 'cpt', 'hcpcs']).optional(),
      context: z.object({
        dateOfService: z.string().optional().describe('Date of service (YYYY-MM-DD) for temporal validation'),
      }).optional(),
    },
  },

  // --- Prior Authorization ---
  {
    name: 'pa_predict',
    description: 'Predict prior authorization approval probability for a procedure. Returns approval likelihood (0-1), confidence level, estimated processing days, and contributing factors.',
    price: '$0.05',
    endpoint: '/agent/v1/pa/predict',
    schema: {
      procedureCode: z.string().describe('CPT/HCPCS procedure code'),
      diagnosisCodes: z.array(z.string()).optional().describe('Supporting ICD-10 diagnosis codes'),
      payerId: z.string().optional().describe('Insurance payer ID'),
      patientAge: z.number().optional().describe('Patient age in years'),
      patientGender: z.enum(['M', 'F', 'O']).optional(),
    },
  },
  {
    name: 'pa_status',
    description: 'Check the status of a prior authorization request. Returns current status, dates, and expiration info.',
    price: '$0.02',
    endpoint: '/agent/v1/pa/status',
    schema: {
      authorizationId: z.string().optional().describe('Prior authorization ID'),
      trackingNumber: z.string().optional().describe('Tracking number (alternative to authorizationId)'),
    },
  },

  // --- NLP ---
  {
    name: 'ner_extract',
    description: 'Extract medical named entities from clinical text. Identifies ICD-10 codes, CPT codes, dates, medications, and 12 entity types with confidence scores.',
    price: '$0.02',
    endpoint: '/agent/v1/ner/extract',
    schema: {
      text: z.string().describe('Clinical text to extract entities from'),
      entityTypes: z.array(z.string()).optional().describe('Filter to specific entity types'),
    },
  },

  // --- Claims ---
  {
    name: 'claims_validate',
    description: 'Pre-submission claims validation. Checks for errors, missing fields, code mismatches, and provides fix suggestions before you submit to the payer.',
    price: '$0.05',
    endpoint: '/agent/v1/claims/validate',
    schema: {
      claim: z.object({
        patientId: z.string(),
        providerId: z.string(),
        dateOfService: z.string().describe('YYYY-MM-DD'),
        diagnosisCodes: z.array(z.string()),
        procedureCodes: z.array(z.string()),
        modifiers: z.array(z.string()).optional(),
        placeOfService: z.string().optional(),
      }).describe('Claim data to validate'),
    },
  },

  // --- Compliance ---
  {
    name: 'compliance_audit',
    description: 'HIPAA compliance audit. Scans data for PHI exposure (SSN, MRN, DOB patterns), returns findings with severity, score (0-100), and remediation recommendations.',
    price: '$0.25',
    endpoint: '/agent/v1/compliance/audit',
    schema: {
      data: z.record(z.unknown()).describe('Data to audit for compliance issues'),
      auditType: z.enum(['general', 'hipaa']).optional().describe('Type of audit (default: general)'),
    },
  },

  // --- Data Enrichment ---
  {
    name: 'provider_search',
    description: 'Search the NPI provider directory. Find healthcare providers by name, specialty, or location.',
    price: '$0.005',
    endpoint: '/agent/v1/providers/search',
    schema: {
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      organizationName: z.string().optional(),
      taxonomy: z.string().optional().describe('Provider taxonomy/specialty code'),
      city: z.string().optional(),
      state: z.string().optional().describe('2-letter state code'),
      limit: z.number().optional().describe('Max results (default 10, max 50)'),
    },
  },
  {
    name: 'provider_enrich',
    description: 'AI-enriched provider intelligence from NPI number. Returns practice details, specialties, affiliations, and market context.',
    price: '$0.05',
    endpoint: '/agent/v1/providers/enrich',
    schema: {
      npi: z.string().describe('10-digit NPI number'),
    },
  },
  {
    name: 'drug_enrich',
    description: 'Drug information enrichment via OpenFDA. Returns drug details, indications, interactions, and AI analysis.',
    price: '$0.03',
    endpoint: '/agent/v1/drugs/enrich',
    schema: {
      drugName: z.string().describe('Drug name (brand or generic, min 2 chars)'),
      searchField: z.enum(['brand_name', 'generic_name']).optional().describe('Search by brand or generic name'),
    },
  },
  {
    name: 'market_analysis',
    description: 'Healthcare specialty market analysis for a specific state. Returns provider density, competition metrics, and market opportunity data.',
    price: '$0.10',
    endpoint: '/agent/v1/market/analysis',
    schema: {
      state: z.string().describe('2-letter state code (e.g., "TX", "CA")'),
      specialty: z.string().describe('Medical specialty (e.g., "cardiology", "orthopedics")'),
    },
  },
];

export function getToolByName(name) {
  return MCP_TOOLS.find((t) => t.name === name);
}
