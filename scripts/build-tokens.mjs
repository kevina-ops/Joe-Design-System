#!/usr/bin/env node

/**
 * Token Build Script
 * 
 * Reads tokens/joe-tokens.json and generates:
 * - tokens/output/css/variables.css (CSS custom properties)
 * - tokens/output/tailwind/theme.cjs (Tailwind theme configuration)
 * 
 * Part of PRD Section 4.2: Token Transformation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const TOKENS_FILE = path.join(rootDir, 'tokens', 'joe-tokens.json');
const CSS_OUTPUT_DIR = path.join(rootDir, 'tokens', 'output', 'css');
const CSS_OUTPUT_FILE = path.join(CSS_OUTPUT_DIR, 'variables.css');
const TAILWIND_OUTPUT_DIR = path.join(rootDir, 'tokens', 'output', 'tailwind');
const TAILWIND_OUTPUT_FILE = path.join(TAILWIND_OUTPUT_DIR, 'theme.cjs');

// Ensure output directories exist
function ensureDirectories() {
  [CSS_OUTPUT_DIR, TAILWIND_OUTPUT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * Normalizes W3C DTCG format ($value, $type) to legacy (value, type) so the rest
 * of the pipeline works unchanged. Accepts both formats.
 */
function normalizeToLegacy(obj) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return obj;
  const normalized = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'value' || k === 'type' || k === '$value' || k === '$type') continue;
    normalized[k] = normalizeToLegacy(v);
  }
  if (obj.value !== undefined || obj.$value !== undefined) {
    normalized.value = obj.$value ?? obj.value;
    normalized.type = obj.$type ?? obj.type;
  }
  return normalized;
}

/**
 * Resolves token references (e.g., {primitives.colors.white} -> actual value)
 * Handles nested references by resolving in multiple passes
 */
function resolveTokenReferences(tokens, maxPasses = 10) {
  // First, create a deep copy
  let resolved = JSON.parse(JSON.stringify(tokens));
  
  // Resolve references in multiple passes until no more references remain
  for (let pass = 0; pass < maxPasses; pass++) {
    let hasReferences = false;
    
    const resolveValue = (obj) => {
      if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
        if (obj.value !== undefined) {
          // This is a token with a value
          let tokenValue = obj.value;
          
          // Resolve references in the format {primitives.colors.white}
          if (typeof tokenValue === 'string' && tokenValue.startsWith('{') && tokenValue.endsWith('}')) {
            const refPath = tokenValue.slice(1, -1);
            const refValue = getNestedValue(resolved, refPath);
            if (refValue !== undefined && !(typeof refValue === 'string' && refValue.startsWith('{') && refValue.endsWith('}'))) {
              obj.value = refValue;
              hasReferences = true;
            }
          }
        } else {
          // Nested object, recurse
          for (const key in obj) {
            resolveValue(obj[key]);
          }
        }
      }
    };
    
    resolveValue(resolved);
    
    if (!hasReferences) {
      break;
    }
  }
  
  return resolved;
}

/**
 * Gets a nested value from an object using dot notation
 * Handles token references by looking for .value property
 */
function getNestedValue(obj, path) {
  const parts = path.split('.');
  let current = obj;
  
  for (const key of parts) {
    if (current && current[key] !== undefined) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  // If the final value is a token object, return value ($value or value)
  if (current && typeof current === 'object') {
    const v = current.value ?? current.$value;
    if (v !== undefined) return v;
  }
  return current;
}

/**
 * Converts a token path to a CSS variable name
 * Example: primitives.colors.blue.500 -> --joe-primitives-colors-blue-500
 */
function tokenPathToCSSVar(path) {
  return `--joe-${path.replace(/\./g, '-')}`;
}

/**
 * Converts a token path to a Tailwind path
 * Example: primitives.colors.blue.500 -> primitives.colors.blue.500
 */
function tokenPathToTailwindPath(path) {
  return path;
}

/**
 * Flattens tokens into a path-value map
 */
function flattenTokens(tokens, prefix = '', result = {}) {
  for (const [key, value] of Object.entries(tokens)) {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const tokenVal = value.value ?? value.$value;
      if (tokenVal !== undefined) {
        // This is a token (legacy or W3C DTCG)
        result[currentPath] = tokenVal;
      } else {
        // Nested object, recurse
        flattenTokens(value, currentPath, result);
      }
    }
  }
  
  return result;
}

/**
 * Category config for Storybook Design Token addon.
 * Addon only includes CSS files that contain "@tokens"; categories are parsed from
 * /* @tokens CategoryName *\/ and /* @tokens-end *\/ comments.
 */
const CSS_TOKEN_CATEGORIES = [
  { prefix: 'primitives.colors', name: 'Colors - Primitives', presenter: 'Color' },
  { prefix: 'semantic.color', name: 'Colors - Semantic', presenter: 'Color' },
  { prefix: 'primitives.space', name: 'Spacing', presenter: 'Spacing' },
  { prefix: 'primitives.radii', name: 'Border Radius', presenter: 'BorderRadius' },
  { prefix: 'primitives.fontSizes', name: 'Font Size', presenter: 'FontSize' },
  { prefix: 'primitives.fontWeights', name: 'Font Weight', presenter: 'FontWeight' },
  { prefix: 'primitives.lineHeights', name: 'Line Height', presenter: 'LineHeight' },
  { prefix: 'primitives.fonts', name: 'Font Family', presenter: 'FontFamily' },
];

/**
 * Generates CSS variables file with @tokens comments for storybook-design-token addon.
 */
function generateCSSVariables(resolvedTokens) {
  const flatTokens = flattenTokens(resolvedTokens);
  const cssVars = [];
  
  cssVars.push(':root {');
  
  const sortedPaths = Object.keys(flatTokens).sort();
  
  for (const category of CSS_TOKEN_CATEGORIES) {
    const pathsInCategory = sortedPaths.filter((p) => p === category.prefix || p.startsWith(category.prefix + '.'));
    if (pathsInCategory.length === 0) continue;

    cssVars.push(`  /* @tokens ${category.name} @presenter ${category.presenter} */`);
    for (const tokenPath of pathsInCategory) {
      const value = flatTokens[tokenPath];
      const cssVarName = tokenPathToCSSVar(tokenPath);
      let cssValue = value;
      if (typeof value === 'number') {
        cssValue = value.toString();
      } else if (typeof value === 'string') {
        cssValue = value;
      }
      cssVars.push(`  ${cssVarName}: ${cssValue};`);
    }
    cssVars.push('  /* @tokens-end */');
  }
  
  cssVars.push('}');
  cssVars.push('');
  
  return cssVars.join('\n');
}

/**
 * Generates Tailwind theme configuration
 */
function generateTailwindTheme(resolvedTokens) {
  const theme = {
    colors: {},
    fontFamily: {},
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
    borderRadius: {},
    spacing: {},
    zIndex: {},
    boxShadow: {},
    transitionProperty: {},
    transitionDuration: {},
    transitionTimingFunction: {}
  };
  
  // Process primitives
  if (resolvedTokens.primitives) {
    const primitives = resolvedTokens.primitives;
    
    // Colors
    if (primitives.colors) {
      const processColor = (colors, prefix = '') => {
        for (const [key, value] of Object.entries(colors)) {
          const currentPath = prefix ? `${prefix}.${key}` : key;
          
          const tokenVal = value.value ?? value.$value;
          if (tokenVal !== undefined) {
            // Leaf color value (legacy or W3C DTCG)
            const tailwindPath = currentPath.split('.');
            let target = theme.colors;
            for (let i = 0; i < tailwindPath.length - 1; i++) {
              if (!target[tailwindPath[i]]) {
                target[tailwindPath[i]] = {};
              }
              target = target[tailwindPath[i]];
            }
            target[tailwindPath[tailwindPath.length - 1]] = tokenVal;
          } else if (typeof value === 'object') {
            processColor(value, currentPath);
          }
        }
      };
      processColor(primitives.colors);
    }
    
    // Font families
    if (primitives.fonts) {
      for (const [key, value] of Object.entries(primitives.fonts)) {
        const v = value?.value ?? value?.$value;
        if (v) theme.fontFamily[key] = v;
      }
    }
    // Font sizes
    if (primitives.fontSizes) {
      for (const [key, value] of Object.entries(primitives.fontSizes)) {
        const v = value?.value ?? value?.$value;
        if (v) theme.fontSize[key] = v;
      }
    }
    // Font weights
    if (primitives.fontWeights) {
      for (const [key, value] of Object.entries(primitives.fontWeights)) {
        const v = value?.value ?? value?.$value;
        if (v !== undefined) theme.fontWeight[key] = v;
      }
    }
    // Line heights
    if (primitives.lineHeights) {
      for (const [key, value] of Object.entries(primitives.lineHeights)) {
        const v = value?.value ?? value?.$value;
        if (v) theme.lineHeight[key] = v;
      }
    }
    // Border radius
    if (primitives.radii) {
      for (const [key, value] of Object.entries(primitives.radii)) {
        const v = value?.value ?? value?.$value;
        if (v) theme.borderRadius[key] = v;
      }
    }
    // Spacing
    if (primitives.space) {
      for (const [key, value] of Object.entries(primitives.space)) {
        const v = value?.value ?? value?.$value;
        if (v !== undefined) theme.spacing[key] = v;
      }
    }
  }
  
  // Process semantic tokens
  if (resolvedTokens.semantic) {
    const semantic = resolvedTokens.semantic;
    
    // Semantic colors
    if (semantic.color) {
      const processSemanticColor = (colors, prefix = '') => {
        for (const [key, value] of Object.entries(colors)) {
          const currentPath = prefix ? `${prefix}.${key}` : key;
          
          const tokenVal = value.value ?? value.$value;
          if (tokenVal !== undefined) {
            const tailwindPath = currentPath.split('.');
            let target = theme.colors;
            for (let i = 0; i < tailwindPath.length - 1; i++) {
              if (!target[tailwindPath[i]]) {
                target[tailwindPath[i]] = {};
              }
              target = target[tailwindPath[i]];
            }
            target[tailwindPath[tailwindPath.length - 1]] = tokenVal;
          } else if (typeof value === 'object') {
            processSemanticColor(value, currentPath);
          }
        }
      };
      processSemanticColor(semantic.color);
    }
    
    // Semantic spacing
    if (semantic.spacing) {
      for (const [key, value] of Object.entries(semantic.spacing)) {
        const v = value?.value ?? value?.$value;
        if (v !== undefined) theme.spacing[key] = v;
      }
    }
    // Semantic border radius
    if (semantic.borderRadius) {
      for (const [key, value] of Object.entries(semantic.borderRadius)) {
        const v = value?.value ?? value?.$value;
        if (v) theme.borderRadius[key] = v;
      }
    }
    // Semantic z-index
    if (semantic.zIndex) {
      for (const [key, value] of Object.entries(semantic.zIndex)) {
        const v = value?.value ?? value?.$value;
        if (v !== undefined) theme.zIndex[key] = v;
      }
    }
  }
  
  // Generate the CommonJS module
  const themeStr = JSON.stringify(theme, null, 2);
  return `/**\n * Generated Tailwind theme from joe-tokens.json\n * Do not edit manually - this file is auto-generated\n */\n\nmodule.exports = ${themeStr};\n`;
}

/**
 * Main build function
 */
function buildTokens() {
  console.log('🔨 Building tokens...');
  
  // Ensure output directories exist
  ensureDirectories();
  
  // Read tokens file
  if (!fs.existsSync(TOKENS_FILE)) {
    console.error(`❌ Tokens file not found: ${TOKENS_FILE}`);
    process.exit(1);
  }
  
  const tokensContent = fs.readFileSync(TOKENS_FILE, 'utf-8');
  let tokens = JSON.parse(tokensContent);
  // Support both Legacy (type/value) and W3C DTCG ($type/$value) formats
  tokens = normalizeToLegacy(tokens);
  // Resolve token references
  console.log('📝 Resolving token references...');
  const resolvedTokens = resolveTokenReferences(tokens, 10);
  
  // Generate CSS variables
  console.log('🎨 Generating CSS variables...');
  const cssContent = generateCSSVariables(resolvedTokens);
  fs.writeFileSync(CSS_OUTPUT_FILE, cssContent, 'utf-8');
  console.log(`✅ Generated: ${CSS_OUTPUT_FILE}`);
  
  // Generate Tailwind theme
  console.log('⚡ Generating Tailwind theme...');
  const tailwindContent = generateTailwindTheme(resolvedTokens);
  fs.writeFileSync(TAILWIND_OUTPUT_FILE, tailwindContent, 'utf-8');
  console.log(`✅ Generated: ${TAILWIND_OUTPUT_FILE}`);
  
  console.log('✨ Token build complete!');
}

// Handle watch mode
const isWatch = process.argv.includes('--watch');

if (isWatch) {
  console.log('👀 Watching for changes...');
  fs.watchFile(TOKENS_FILE, { interval: 1000 }, () => {
    console.log('\n📝 Tokens file changed, rebuilding...');
    buildTokens();
  });
  buildTokens();
} else {
  buildTokens();
}
