#!/usr/bin/env node

/**
 * Export Legacy-format tokens for Token Studio (Figma) sync.
 *
 * Reads tokens/joe-tokens.json and writes tokens/joe-tokens-legacy.json
 * with "value"/"type" instead of "$value"/"$type". References like
 * {primitives.colors.white} are left unchanged so Token Studio can
 * create variable-to-variable references in Figma when using Legacy format.
 *
 * Usage: npm run tokens:legacy
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const TOKENS_FILE = path.join(rootDir, 'tokens', 'joe-tokens.json');
const LEGACY_OUTPUT = path.join(rootDir, 'tokens', 'joe-tokens-legacy.json');

function normalizeToLegacy(obj) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return obj;
  const normalized = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'value' || k === 'type' || k === '$value' || k === '$type' || k === '$description' || k === '$themes' || k === '$metadata') continue;
    normalized[k] = normalizeToLegacy(v);
  }
  if (obj.value !== undefined || obj.$value !== undefined) {
    normalized.value = obj.$value ?? obj.value;
    normalized.type = obj.$type ?? obj.type;
  }
  if (obj.$description !== undefined || obj.description !== undefined) {
    normalized.description = obj.$description ?? obj.description;
  }
  return normalized;
}

const raw = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
const full = normalizeToLegacy(raw);
if (!full.primitives || !full.semantic) {
  console.error('joe-tokens.json must have top-level "primitives" and "semantic"');
  process.exit(1);
}
// Include $metadata.tokenSetOrder so Token Studio exports primitives FIRST, then semantic.
// That order is required for semantic Variables to be created as aliases to primitive Variables
// (referenced variables must exist in Figma before the referencing variables are created).
const legacy = {
  primitives: full.primitives,
  semantic: full.semantic,
  $metadata: {
    tokenSetOrder: ['primitives', 'semantic']
  }
};
fs.writeFileSync(LEGACY_OUTPUT, JSON.stringify(legacy, null, 2) + '\n', 'utf8');
console.log('Wrote', LEGACY_OUTPUT);
