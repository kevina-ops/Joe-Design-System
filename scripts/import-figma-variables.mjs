#!/usr/bin/env node

/**
 * Import Figma Variables from "Export modes" JSON
 * 
 * This script imports variables exported from Figma's native "Export modes" feature.
 * This captures ALL variable types (colors, spacing, typography, radii, shadows, etc.)
 * types: colors, spacing, typography, border radii, shadows, etc.
 * 
 * Usage:
 *   node scripts/import-figma-variables.mjs <path-to-figma-export.json> [--mode <mode-name>]
 * 
 * The script will:
 * 1. Read the Figma variables JSON export
 * 2. Convert Figma variable format to Joe token structure
 * 3. Map all variable types (colors, spacing, typography, radii, shadows)
 * 4. Merge with existing joe-tokens.json (backing up first)
 * 5. Support mode selection (defaults to first mode or 'shadcn')
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
 * Converts Figma variable value to token value
 * Handles references, colors, numbers, strings
 */
function convertFigmaValue(figmaValue, variableType) {
  if (typeof figmaValue === 'string') {
    // Check if it's a reference (e.g., "{primitives.colors.white}" or "neutral/950")
    if (figmaValue.includes('/')) {
      // Figma variable reference format (e.g., "neutral/950")
      // Convert to our reference format
      const parts = figmaValue.split('/');
      if (parts.length === 2) {
        return `{primitives.colors.${parts[0]}.${parts[1]}}`;
      }
    }
    if (figmaValue.startsWith('{') && figmaValue.endsWith('}')) {
      // Already a reference
      return figmaValue;
    }
    // Check if it's a hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(figmaValue) || /^#[0-9A-Fa-f]{8}$/.test(figmaValue)) {
      return figmaValue;
    }
    // Check if it's rgba/rgb
    if (figmaValue.startsWith('rgb')) {
      return figmaValue;
    }
    // String value
    return figmaValue;
  }
  
  if (typeof figmaValue === 'number') {
    // Convert to string with unit if needed
    if (variableType === 'spacing' || variableType === 'borderRadius') {
      return `${figmaValue}px`;
    }
    return figmaValue.toString();
  }
  
  return figmaValue;
}

/**
 * Determines token type from Figma variable type
 */
function getTokenType(figmaVariableType, collectionName) {
  const lowerCollection = collectionName.toLowerCase();
  
  if (figmaVariableType === 'COLOR') return 'color';
  if (figmaVariableType === 'FLOAT' || figmaVariableType === 'NUMBER') {
    if (lowerCollection.includes('spacing')) return 'spacing';
    if (lowerCollection.includes('radius') || lowerCollection.includes('radii')) return 'borderRadius';
    if (lowerCollection.includes('shadow')) return 'boxShadow';
    return 'dimension';
  }
  if (figmaVariableType === 'STRING') {
    if (lowerCollection.includes('font') || lowerCollection.includes('typography')) {
      if (lowerCollection.includes('family') || lowerCollection.includes('font')) return 'fontFamilies';
      if (lowerCollection.includes('size')) return 'fontSizes';
      if (lowerCollection.includes('weight')) return 'fontWeights';
      if (lowerCollection.includes('line') || lowerCollection.includes('height')) return 'lineHeights';
    }
    return 'string';
  }
  if (figmaVariableType === 'BOOLEAN') return 'boolean';
  
  return 'string'; // fallback
}

/**
 * Converts Figma variable name to token path
 * Handles nested names like "border.radius.sm" -> ["border", "radius", "sm"]
 */
function nameToPath(name) {
  return name.split(/[.\-_]/).filter(Boolean);
}

/**
 * Maps Figma variables to Joe token structure
 */
function mapFigmaToJoeStructure(figmaExport, selectedMode) {
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
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
  };

  // Process each collection
  for (const collection of figmaExport.collections || []) {
    const collectionName = collection.name || '';
    const lowerCollectionName = collectionName.toLowerCase();
    
    // Determine if this is primitives or semantic
    const isPrimitive = lowerCollectionName.includes('raw') || 
                       lowerCollectionName.includes('primitive') ||
                       (!lowerCollectionName.includes('semantic') && 
                        !lowerCollectionName.includes('action') &&
                        !lowerCollectionName.includes('background') &&
                        !lowerCollectionName.includes('text'));

    // Process each variable in the collection
    for (const variable of collection.variables || []) {
      const variableName = variable.name || '';
      const variableType = variable.type || 'STRING';
      const modes = variable.valuesByMode || {};
      
      // Select mode (use provided mode or first available)
      let modeValue = null;
      if (selectedMode && modes[selectedMode] !== undefined) {
        modeValue = modes[selectedMode];
      } else {
        // Use first available mode
        const modeKeys = Object.keys(modes);
        if (modeKeys.length > 0) {
          modeValue = modes[modeKeys[0]];
        }
      }

      if (modeValue === null || modeValue === undefined) {
        console.warn(`⚠️  Skipping variable ${variableName} - no value found`);
        continue;
      }

      const tokenType = getTokenType(variableType, collectionName);
      const tokenValue = convertFigmaValue(modeValue, tokenType);
      
      const token = {
        $type: tokenType,
        $value: tokenValue,
      };

      // Determine target path
      const namePath = nameToPath(variableName);
      
      if (isPrimitive) {
        // Map to primitives
        if (tokenType === 'color') {
          // Handle color paths like "neutral/950" -> ["neutral", "950"]
          if (namePath.length >= 2 && /^\d+$/.test(namePath[namePath.length - 1])) {
            // Last part is a number, treat as color scale
            const colorName = namePath.slice(0, -1).join('.');
            const scaleValue = namePath[namePath.length - 1];
            setNestedValue(joeStructure.primitives.colors, [...nameToPath(colorName), scaleValue], token);
          } else {
            setNestedValue(joeStructure.primitives.colors, namePath, token);
          }
        } else if (tokenType === 'spacing') {
          setNestedValue(joeStructure.primitives.space, namePath, token);
        } else if (tokenType === 'borderRadius') {
          setNestedValue(joeStructure.primitives.radii, namePath, token);
        } else if (tokenType === 'fontFamilies') {
          setNestedValue(joeStructure.primitives.fonts, namePath, token);
        } else if (tokenType === 'fontSizes') {
          setNestedValue(joeStructure.primitives.fontSizes, namePath, token);
        } else if (tokenType === 'fontWeights') {
          setNestedValue(joeStructure.primitives.fontWeights, namePath, token);
        } else if (tokenType === 'lineHeights') {
          setNestedValue(joeStructure.primitives.lineHeights, namePath, token);
        }
      } else {
        // Map to semantic
        if (tokenType === 'color') {
          // Map semantic colors
          const lowerName = variableName.toLowerCase();
          if (lowerName.includes('background') || lowerName.includes('bg')) {
            if (lowerName.includes('default') || lowerName.includes('base')) {
              joeStructure.semantic.color.background.default = token;
            } else if (lowerName.includes('muted') || lowerName.includes('surface')) {
              joeStructure.semantic.color.background.muted = token;
            } else {
              joeStructure.semantic.color.background.surface = token;
            }
          } else if (lowerName.includes('foreground') || lowerName.includes('text')) {
            if (lowerName.includes('primary') || lowerName.includes('default')) {
              joeStructure.semantic.color.text.primary = token;
            } else if (lowerName.includes('secondary') || lowerName.includes('muted')) {
              joeStructure.semantic.color.text.secondary = token;
            } else if (lowerName.includes('tertiary')) {
              joeStructure.semantic.color.text.tertiary = token;
            } else if (lowerName.includes('inverse')) {
              joeStructure.semantic.color.text.inverse = token;
            }
          } else if (lowerName.includes('primary') && (lowerName.includes('action') || lowerName.includes('button'))) {
            joeStructure.semantic.color.action.primary = token;
          } else if (lowerName.includes('destructive')) {
            joeStructure.semantic.color.action.destructive = token;
          } else if (lowerName.includes('border')) {
            joeStructure.semantic.color.border.default = token;
          } else {
            // Generic semantic color - add to appropriate category
            setNestedValue(joeStructure.semantic.color, namePath, token);
          }
        }
      }
    }
  }

  return joeStructure;
}

/**
 * Merges Figma tokens into existing Joe tokens
 */
function mergeTokens(existingJoe, figmaMapped) {
  const deepMerge = (target, source) => {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        // Check if it's a token object (has $value or value)
        if (source[key].$value !== undefined || source[key].value !== undefined) {
          // Replace token
          target[key] = source[key];
        } else {
          // Recurse
          if (!target[key]) {
            target[key] = {};
          }
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
  if (figmaMapped.primitives) {
    deepMerge(merged.primitives, figmaMapped.primitives);
  }
  
  // Merge semantic
  if (figmaMapped.semantic) {
    deepMerge(merged.semantic, figmaMapped.semantic);
  }
  
  return merged;
}

/**
 * Main import function
 */
function importFigmaVariables(figmaExportPath, selectedMode) {
  console.log('📥 Importing Figma variables from Export modes...');
  
  // Read Figma export
  if (!fs.existsSync(figmaExportPath)) {
    console.error(`❌ Figma export file not found: ${figmaExportPath}`);
    process.exit(1);
  }
  
  const figmaContent = fs.readFileSync(figmaExportPath, 'utf-8');
  let figmaExport;
  try {
    figmaExport = JSON.parse(figmaContent);
  } catch (e) {
    console.error(`❌ Invalid JSON file: ${figmaExportPath}`);
    console.error(e.message);
    process.exit(1);
  }
  
  // Validate structure
  if (!figmaExport.collections || !Array.isArray(figmaExport.collections)) {
    console.error('❌ Invalid Figma export format. Expected "collections" array.');
    console.error('Make sure you exported using Figma\'s "Export modes" feature from the Variables panel.');
    process.exit(1);
  }
  
  console.log(`✅ Read Figma export (${figmaExport.collections.length} collections)`);
  
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
  
  // Map Figma to Joe structure
  console.log(`🔄 Mapping Figma variables to Joe structure${selectedMode ? ` (mode: ${selectedMode})` : ''}...`);
  const figmaMapped = mapFigmaToJoeStructure(figmaExport, selectedMode);
  
  // Count tokens
  const countTokens = (obj) => {
    let count = 0;
    for (const value of Object.values(obj)) {
      if (value && typeof value === 'object') {
        if (value.$value !== undefined || value.value !== undefined) {
          count++;
        } else {
          count += countTokens(value);
        }
      }
    }
    return count;
  };
  
  const primitivesCount = countTokens(figmaMapped.primitives);
  const semanticCount = countTokens(figmaMapped.semantic);
  console.log(`   Found ${primitivesCount} primitive tokens, ${semanticCount} semantic tokens`);
  
  // Merge tokens
  console.log('🔀 Merging tokens...');
  const merged = mergeTokens(existingJoe, figmaMapped);
  
  // Write merged tokens
  fs.writeFileSync(JOE_TOKENS_FILE, JSON.stringify(merged, null, 2), 'utf-8');
  console.log(`✅ Merged tokens written to: ${JOE_TOKENS_FILE}`);
  
  console.log('\n✨ Import complete!');
  console.log('📝 Next steps:');
  console.log('   1. Review the merged tokens in joe-tokens.json');
  console.log('   2. Run: npm run tokens:build');
  console.log('   3. If needed, restore backup: cp tokens/joe-tokens.json.backup tokens/joe-tokens.json');
}

// Parse command line arguments
const args = process.argv.slice(2);
const figmaExportPath = args.find(arg => !arg.startsWith('--'));
const modeArg = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] || 
                (args.includes('--mode') && args[args.indexOf('--mode') + 1] ? args[args.indexOf('--mode') + 1] : null);

if (!figmaExportPath) {
  console.error('Usage: node scripts/import-figma-variables.mjs <path-to-figma-export.json> [--mode <mode-name>]');
  console.error('\nExample:');
  console.error('  node scripts/import-figma-variables.mjs ./figma-variables-export.json');
  console.error('  node scripts/import-figma-variables.mjs ./figma-variables-export.json --mode shadcn');
  console.error('\nTo export from Figma:');
  console.error('  1. Open Variables panel in Figma');
  console.error('  2. Right-click on a collection');
  console.error('  3. Select "Export modes"');
  console.error('  4. Save the JSON file');
  process.exit(1);
}

importFigmaVariables(figmaExportPath, modeArg);
