#!/usr/bin/env node

/**
 * Export Legacy-format tokens for Token Studio (Figma) sync.
 *
 * Reads tokens/joe-tokens.json and writes tokens/joe-tokens-legacy.json
 * in a SINGLE token set "joe" so that primitives and semantic tokens live
 * in the same Figma variable collection. References are rewritten from
 * {primitives.colors.white} to {joe.colors.white} so Token Studio can
 * create variable-to-variable aliases within that collection.
 *
 * joe-tokens.json is unchanged (primitives + semantic); Storybook and
 * build-tokens.mjs continue to use joe-tokens.json. Only the legacy file
 * structure changes for Figma.
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

const SET_NAME = 'joe';

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

/** Rewrite reference strings from {primitives.xxx} to {joe.xxx} (or current SET_NAME). */
function rewriteReferences(obj) {
  if (typeof obj === 'string') {
    if (obj.startsWith('{primitives.') && obj.endsWith('}')) {
      return '{' + SET_NAME + '.' + obj.slice(12, -1) + '}';
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(rewriteReferences);
  }
  if (typeof obj === 'object' && obj !== null) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = rewriteReferences(v);
    }
    return out;
  }
  return obj;
}

const raw = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
const full = normalizeToLegacy(raw);
if (!full.primitives || !full.semantic) {
  console.error('joe-tokens.json must have top-level "primitives" and "semantic"');
  process.exit(1);
}

// Single set "joe": primitives at top level, then "semantic" key. All in one Figma collection.
const joeSet = {
  ...full.primitives,
  semantic: full.semantic
};
const joeWithRefs = rewriteReferences(joeSet);

const legacy = {
  [SET_NAME]: joeWithRefs,
  $metadata: {
    tokenSetOrder: [SET_NAME]
  }
};

fs.writeFileSync(LEGACY_OUTPUT, JSON.stringify(legacy, null, 2) + '\n', 'utf8');
console.log('Wrote', LEGACY_OUTPUT, '(single set "' + SET_NAME + '", references as {' + SET_NAME + '.xxx})');
