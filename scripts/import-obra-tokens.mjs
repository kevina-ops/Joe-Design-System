#!/usr/bin/env node

/**
 * Import Obra Tokens from Figma Export
 * 
 * This script imports tokens exported from Obra shadcn/ui Figma kit.
 * It merges Obra tokens into the existing joe-tokens.json structure, preserving
 * the primitives + semantic structure while using Obra's default values.
 * 
 * Usage:
 *   node scripts/import-obra-tokens.mjs <path-to-obra-tokens.json>
 * 
 * The script will:
 * 1. Read the Obra tokens JSON file
 * 2. Map Obra tokens to the primitives/semantic structure
 * 3. Merge with existing joe-tokens.json (backing up first)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const JOE_TOKENS_FILE = path.join(rootDir, 'tokens', 'joe-tokens.json');
const BACKUP_FILE = path.join(rootDir, 'tokens', 'joe-tokens.json.backup');

/**
 * Normalizes token format (handles both Legacy and W3C DTCG)
 */
function normalizeToken(token) {
  if (!token || typeof token !== 'object') return token;
  
  // If it's already normalized, return as-is
  if (token.$value !== undefined || token.value !== undefined) {
    return {
      $type: token.$type ?? token.type,
      $value: token.$value ?? token.value,
      ...(token.$description && { $description: token.$description }),
      ...(token.description && { $description: token.description }),
    };
  }
  
  // Otherwise, it's a nested object
  const normalized = {};
  for (const [key, value] of Object.entries(token)) {
    if (key.startsWith('$') || key === 'type' || key === 'value' || key === 'description') {
      continue;
    }
    normalized[key] = normalizeToken(value);
  }
  return normalized;
}

/**
 * Maps Obra token structure to Joe structure
 * Obra typically uses a flat or different structure, we need to map it to primitives/semantic
 */
function mapObraToJoeStructure(obraTokens) {
  const joeStructure = {
    primitives: {
      colors: {},
      fonts: {},
      fontSizes: {},
      fontWeights: {},
      lineHeights: {},
      radii: {},
      space: {},
    },
    semantic: {
      color: {
        background: {},
        text: {},
        action: {},
        status: {},
        border: {},
      },
    },
    $themes: [],
    $metadata: {
      tokenSetOrder: ['primitives', 'semantic'],
    },
  };

  // Helper to set nested value
  const setNestedValue = (obj, path, value) => {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  };

  // Flatten Obra tokens and map them
  const flattenTokens = (tokens, prefix = '') => {
    const result = {};
    for (const [key, value] of Object.entries(tokens)) {
      const currentPath = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const tokenValue = value.$value ?? value.value;
        if (tokenValue !== undefined) {
          // This is a token
          result[currentPath] = normalizeToken(value);
        } else {
          // Nested object, recurse
          Object.assign(result, flattenTokens(value, currentPath));
        }
      }
    }
    return result;
  };

  const flatObra = flattenTokens(obraTokens);
  
  // Map common Obra token patterns to Joe structure
  // This is a heuristic mapping - adjust based on actual Obra structure
  for (const [path, token] of Object.entries(flatObra)) {
    const lowerPath = path.toLowerCase();
    
    // Map colors
    if (token.$type === 'color' || token.type === 'color') {
      // Primitives colors (grey, blue, red, etc.)
      if (lowerPath.includes('grey') || lowerPath.includes('gray') || 
          lowerPath.includes('slate') || lowerPath.includes('neutral')) {
        const colorPath = path.replace(/^(colors?|color)\.?/i, '').replace(/\./g, '-');
        setNestedValue(joeStructure.primitives.colors, colorPath.replace(/-/g, '.'), token);
      } else if (lowerPath.includes('blue') || lowerPath.includes('primary')) {
        const colorPath = path.replace(/^(colors?|color)\.?/i, '').replace(/\./g, '-');
        setNestedValue(joeStructure.primitives.colors, colorPath.replace(/-/g, '.'), token);
      } else if (lowerPath.includes('red') || lowerPath.includes('destructive')) {
        const colorPath = path.replace(/^(colors?|color)\.?/i, '').replace(/\./g, '-');
        setNestedValue(joeStructure.primitives.colors, colorPath.replace(/-/g, '.'), token);
      } else if (lowerPath.includes('green') || lowerPath.includes('success')) {
        const colorPath = path.replace(/^(colors?|color)\.?/i, '').replace(/\./g, '-');
        setNestedValue(joeStructure.primitives.colors, colorPath.replace(/-/g, '.'), token);
      } else if (lowerPath.includes('yellow') || lowerPath.includes('warning')) {
        const colorPath = path.replace(/^(colors?|color)\.?/i, '').replace(/\./g, '-');
        setNestedValue(joeStructure.primitives.colors, colorPath.replace(/-/g, '.'), token);
      } else if (lowerPath.includes('background') || lowerPath.includes('bg')) {
        if (lowerPath.includes('default') || lowerPath.includes('base')) {
          joeStructure.semantic.color.background.default = token;
        } else if (lowerPath.includes('muted') || lowerPath.includes('surface')) {
          joeStructure.semantic.color.background.muted = token;
        } else {
          joeStructure.semantic.color.background.surface = token;
        }
      } else if (lowerPath.includes('foreground') || lowerPath.includes('text')) {
        if (lowerPath.includes('primary') || lowerPath.includes('default')) {
          joeStructure.semantic.color.text.primary = token;
        } else if (lowerPath.includes('secondary') || lowerPath.includes('muted')) {
          joeStructure.semantic.color.text.secondary = token;
        } else if (lowerPath.includes('tertiary')) {
          joeStructure.semantic.color.text.tertiary = token;
        } else if (lowerPath.includes('inverse') || lowerPath.includes('on-dark')) {
          joeStructure.semantic.color.text.inverse = token;
        }
      } else if (lowerPath.includes('primary') && (lowerPath.includes('action') || lowerPath.includes('button'))) {
        joeStructure.semantic.color.action.primary = token;
      } else if (lowerPath.includes('destructive') && (lowerPath.includes('action') || lowerPath.includes('button'))) {
        joeStructure.semantic.color.action.destructive = token;
      } else if (lowerPath.includes('border')) {
        joeStructure.semantic.color.border.default = token;
      }
    }
    
    // Map spacing
    if (token.$type === 'spacing' || token.type === 'spacing') {
      const spacingPath = path.replace(/^(spacing|space)\.?/i, '').replace(/\./g, '-');
      setNestedValue(joeStructure.primitives.space, spacingPath.replace(/-/g, '.'), token);
    }
    
    // Map border radius
    if (token.$type === 'borderRadius' || token.type === 'borderRadius') {
      const radiusPath = path.replace(/^(radius|radii|borderradius)\.?/i, '').replace(/\./g, '-');
      setNestedValue(joeStructure.primitives.radii, radiusPath.replace(/-/g, '.'), token);
    }
    
    // Map font sizes
    if (token.$type === 'fontSizes' || token.type === 'fontSizes') {
      const fontSizePath = path.replace(/^(fontsizes?|fontsize)\.?/i, '').replace(/\./g, '-');
      setNestedValue(joeStructure.primitives.fontSizes, fontSizePath.replace(/-/g, '.'), token);
    }
    
    // Map font weights
    if (token.$type === 'fontWeights' || token.type === 'fontWeights') {
      const fontWeightPath = path.replace(/^(fontweights?|fontweight)\.?/i, '').replace(/\./g, '-');
      setNestedValue(joeStructure.primitives.fontWeights, fontWeightPath.replace(/-/g, '.'), token);
    }
    
    // Map line heights
    if (token.$type === 'lineHeights' || token.type === 'lineHeights') {
      const lineHeightPath = path.replace(/^(lineheights?|lineheight)\.?/i, '').replace(/\./g, '-');
      setNestedValue(joeStructure.primitives.lineHeights, lineHeightPath.replace(/-/g, '.'), token);
    }
    
    // Map font families
    if (token.$type === 'fontFamilies' || token.type === 'fontFamilies') {
      const fontFamilyPath = path.replace(/^(fontfamilies?|fontfamily|fonts?)\.?/i, '').replace(/\./g, '-');
      setNestedValue(joeStructure.primitives.fonts, fontFamilyPath.replace(/-/g, '.'), token);
    }
  }

  return joeStructure;
}

/**
 * Merges Obra tokens into existing Joe tokens
 */
function mergeTokens(existingJoe, obraMapped) {
  // Deep merge function
  const deepMerge = (target, source) => {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) {
          target[key] = {};
        }
        // Check if it's a token object (has $value or value)
        if (source[key].$value !== undefined || source[key].value !== undefined) {
          // Replace token
          target[key] = source[key];
        } else {
          // Recurse
          deepMerge(target[key], source[key]);
        }
      } else {
        target[key] = source[key];
      }
    }
    return target;
  };

  const merged = JSON.parse(JSON.stringify(existingJoe));
  
  // Merge primitives
  if (obraMapped.primitives) {
    deepMerge(merged.primitives, obraMapped.primitives);
  }
  
  // Merge semantic
  if (obraMapped.semantic) {
    deepMerge(merged.semantic, obraMapped.semantic);
  }
  
  return merged;
}

/**
 * Main import function
 */
function importObraTokens(obraTokensPath) {
  console.log('📥 Importing Obra tokens...');
  
  // Read Obra tokens
  if (!fs.existsSync(obraTokensPath)) {
    console.error(`❌ Obra tokens file not found: ${obraTokensPath}`);
    process.exit(1);
  }
  
  const obraContent = fs.readFileSync(obraTokensPath, 'utf-8');
  const obraTokens = JSON.parse(obraContent);
  console.log('✅ Read Obra tokens file');
  
  // Read existing Joe tokens
  if (!fs.existsSync(JOE_TOKENS_FILE)) {
    console.error(`❌ Joe tokens file not found: ${JOE_TOKENS_FILE}`);
    process.exit(1);
  }
  
  // Backup existing tokens
  const existingContent = fs.readFileSync(JOE_TOKENS_FILE, 'utf-8');
  fs.writeFileSync(BACKUP_FILE, existingContent, 'utf-8');
  console.log(`💾 Backed up existing tokens to: ${BACKUP_FILE}`);
  
  const existingJoe = JSON.parse(existingContent);
  
  // Map Obra to Joe structure
  console.log('🔄 Mapping Obra tokens to Joe structure...');
  const obraMapped = mapObraToJoeStructure(obraTokens);
  
  // Merge tokens
  console.log('🔀 Merging tokens...');
  const merged = mergeTokens(existingJoe, obraMapped);
  
  // Write merged tokens
  fs.writeFileSync(JOE_TOKENS_FILE, JSON.stringify(merged, null, 2), 'utf-8');
  console.log(`✅ Merged tokens written to: ${JOE_TOKENS_FILE}`);
  
  console.log('\n✨ Import complete!');
  console.log('📝 Next steps:');
  console.log('   1. Review the merged tokens in joe-tokens.json');
  console.log('   2. Run: npm run tokens:build');
  console.log('   3. If needed, restore backup: cp tokens/joe-tokens.json.backup tokens/joe-tokens.json');
}

// Run if called directly
const obraTokensPath = process.argv[2];
if (!obraTokensPath) {
  console.error('Usage: node scripts/import-obra-tokens.mjs <path-to-obra-tokens.json>');
  console.error('\nExample:');
  console.error('  node scripts/import-obra-tokens.mjs ./obra-tokens-export.json');
  process.exit(1);
}

importObraTokens(obraTokensPath);
