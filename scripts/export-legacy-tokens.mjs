#!/usr/bin/env node

/**
 * Export Legacy-format tokens for Token Studio (Figma) sync.
 *
 * Reads tokens/joe-tokens.json and writes tokens/joe-tokens-legacy.json
 * with "value"/"type" instead of "$value"/"$type". Output matches the
 * working structure: exactly two top-level keys "primitives" and "semantic",
 * no $metadata or $themes. References stay as {primitives.colors.white} so
 * Token Studio creates two Figma collections with semantic Variables
 * referencing primitive Variables.
 *
 * joe-tokens.json is unchanged; Storybook and build-tokens.mjs use it as-is.
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

// Match working structure: only primitives + semantic, no $metadata or $themes.
// References remain {primitives.colors.white} etc.
const legacy = {
  primitives: full.primitives,
  semantic: full.semantic
};

fs.writeFileSync(LEGACY_OUTPUT, JSON.stringify(legacy, null, 2) + '\n', 'utf8');
console.log('Wrote', LEGACY_OUTPUT, '(primitives + semantic, refs {primitives.xxx})');
