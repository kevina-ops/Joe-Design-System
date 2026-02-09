#!/usr/bin/env node

/**
 * Import Figma Variables from Folder Export
 * 
 * This script imports tokens from multiple JSON files exported from Figma's
 * "Export modes" feature. Each collection was exported separately.
 * 
 * Usage:
 *   node scripts/import-figma-folder.mjs [--folder <path>] [--mode <mode-name>]
 * 
 * Default folder: tokens/obra-variables-figma-export
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DEFAULT_FOLDER = path.join(rootDir, 'tokens', 'obra-variables-figma-export');
const JOE_TOKENS_FILE = path.join(rootDir, 'tokens', 'joe-tokens.json');
const BACKUP_FILE = path.join(rootDir, 'tokens', 'joe-tokens.json.backup');

/**
 * Converts Figma color value to hex string
 */
function convertColorValue(colorValue) {
  if (typeof colorValue === 'string') {
    // Already a hex string
    if (colorValue.startsWith('#')) {
      return colorValue;
    }
    // Try to parse as reference
    return colorValue;
  }
  
  if (colorValue && typeof colorValue === 'object') {
    // Color object with hex property
    if (colorValue.hex) {
      return colorValue.hex;
    }
    // Color object with components (RGB)
    if (colorValue.components && Array.isArray(colorValue.components)) {
      const [r, g, b] = colorValue.components;
      const alpha = colorValue.alpha !== undefined ? colorValue.alpha : 1;
      const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
      const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      if (alpha < 1) {
        // Convert to rgba if alpha is not 1
        return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
      }
      return hex;
    }
  }
  
  return colorValue;
}

/**
 * Converts Figma token value to our format
 */
function convertTokenValue(token, tokenType) {
  const value = token.$value;
  
  if (tokenType === 'color') {
    return convertColorValue(value);
  }
  
  if (tokenType === 'spacing' || tokenType === 'borderRadius') {
    if (typeof value === 'number') {
      return `${value}px`;
    }
    return value;
  }
  
  return value;
}

/**
 * Determines token type from Figma token
 */
function getTokenType(figmaToken, fileName, collectionName) {
  const type = figmaToken.$type;
  const lowerFile = fileName.toLowerCase();
  const lowerCollection = collectionName.toLowerCase();
  
  if (type === 'color') return 'color';
  if (type === 'number') {
    if (lowerFile.includes('spacing') || lowerCollection.includes('spacing')) return 'spacing';
    if (lowerFile.includes('radius') || lowerFile.includes('radii') || lowerCollection.includes('radius')) return 'borderRadius';
    return 'dimension';
  }
  if (type === 'string') {
    if (lowerFile.includes('font') || lowerFile.includes('typography')) {
      if (lowerFile.includes('family') || lowerFile.includes('font')) return 'fontFamilies';
      if (lowerFile.includes('size')) return 'fontSizes';
      if (lowerFile.includes('weight')) return 'fontWeights';
      if (lowerFile.includes('line') || lowerFile.includes('height')) return 'lineHeights';
    }
    return 'string';
  }
  
  return type || 'string';
}

/**
 * Resolves alias references
 */
function resolveAlias(token, allTokens) {
  const aliasData = token.$extensions?.com?.figma?.aliasData;
  if (!aliasData) {
    return null;
  }
  
  const targetName = aliasData.targetVariableName;
  const targetSet = aliasData.targetVariableSetName;
  
  // Try to find the referenced token
  // This is a simplified resolution - in practice, you might need more sophisticated lookup
  return null; // For now, return null and use the direct value
}

/**
 * Processes a single token file
 */
function processTokenFile(filePath, fileName, collectionName, allTokens) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const tokens = JSON.parse(content);
  
  const result = {};
  
  const processToken = (obj, path = []) => {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path, key];
      
      if (value && typeof value === 'object' && value.$type !== undefined) {
        // This is a token
        const tokenType = getTokenType(value, fileName, collectionName);
        const tokenValue = convertTokenValue(value, tokenType);
        
        // Try to resolve alias
        const aliasValue = resolveAlias(value, allTokens);
        const finalValue = aliasValue || tokenValue;
        
        // Create nested structure
        let current = result;
        for (let i = 0; i < currentPath.length - 1; i++) {
          if (!current[currentPath[i]]) {
            current[currentPath[i]] = {};
          }
          current = current[currentPath[i]];
        }
        
        current[currentPath[currentPath.length - 1]] = {
          $type: tokenType,
          $value: finalValue,
          ...(value.$description && { $description: value.$description }),
        };
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Nested object, recurse
        processToken(value, currentPath);
      }
    }
  };
  
  processToken(tokens);
  return result;
}

/**
 * Maps processed tokens to Joe structure
 */
function mapToJoeStructure(processedTokens, collectionName) {
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
  };

  const lowerCollection = collectionName.toLowerCase();
  const isPrimitive = lowerCollection.includes('raw') || 
                     lowerCollection.includes('primitive') ||
                     lowerCollection.includes('absolute');

  // Helper to set nested value
  const setNestedValue = (target, path, token) => {
    let current = target;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    current[path[path.length - 1]] = token;
  };

  // Process all tokens
  const processTokens = (tokens, prefix = []) => {
    for (const [key, value] of Object.entries(tokens)) {
      const currentPath = [...prefix, key];
      
      if (value && typeof value === 'object' && value.$type !== undefined) {
        // This is a token
        const tokenType = value.$type;
        
        if (isPrimitive) {
          // Map to primitives
          if (tokenType === 'color') {
            setNestedValue(joeStructure.primitives.colors, currentPath, value);
          } else if (tokenType === 'spacing') {
            setNestedValue(joeStructure.primitives.space, currentPath, value);
          } else if (tokenType === 'borderRadius') {
            setNestedValue(joeStructure.primitives.radii, currentPath, value);
          } else if (tokenType === 'fontFamilies') {
            setNestedValue(joeStructure.primitives.fonts, currentPath, value);
          } else if (tokenType === 'fontSizes') {
            setNestedValue(joeStructure.primitives.fontSizes, currentPath, value);
          } else if (tokenType === 'fontWeights') {
            setNestedValue(joeStructure.primitives.fontWeights, currentPath, value);
          } else if (tokenType === 'lineHeights') {
            setNestedValue(joeStructure.primitives.lineHeights, currentPath, value);
          }
        } else {
          // Map to semantic
          if (tokenType === 'color') {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes('background') || lowerKey.includes('bg')) {
              if (lowerKey.includes('default') || lowerKey.includes('base')) {
                joeStructure.semantic.color.background.default = value;
              } else if (lowerKey.includes('muted') || lowerKey.includes('surface')) {
                joeStructure.semantic.color.background.muted = value;
              } else {
                joeStructure.semantic.color.background.surface = value;
              }
            } else if (lowerKey.includes('foreground') || lowerKey.includes('text')) {
              if (lowerKey.includes('primary') || lowerKey.includes('default')) {
                joeStructure.semantic.color.text.primary = value;
              } else if (lowerKey.includes('secondary') || lowerKey.includes('muted')) {
                joeStructure.semantic.color.text.secondary = value;
              } else {
                setNestedValue(joeStructure.semantic.color.text, currentPath, value);
              }
            } else {
              setNestedValue(joeStructure.semantic.color, currentPath, value);
            }
          }
        }
      } else if (value && typeof value === 'object') {
        // Nested object, recurse
        processTokens(value, currentPath);
      }
    }
  };

  processTokens(processedTokens);
  return joeStructure;
}

/**
 * Merges tokens into existing Joe tokens
 */
function mergeTokens(existingJoe, newTokens) {
  const deepMerge = (target, source) => {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (source[key].$value !== undefined || source[key].value !== undefined) {
          // Token object - replace
          target[key] = source[key];
        } else {
          // Nested object - recurse
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
  
  if (newTokens.primitives) {
    deepMerge(merged.primitives, newTokens.primitives);
  }
  
  if (newTokens.semantic) {
    deepMerge(merged.semantic, newTokens.semantic);
  }
  
  return merged;
}

/**
 * Main import function
 */
function importFromFolder(folderPath, selectedMode) {
  console.log(`📥 Importing Figma variables from folder: ${folderPath}`);
  
  if (!fs.existsSync(folderPath)) {
    console.error(`❌ Folder not found: ${folderPath}`);
    process.exit(1);
  }

  // Read all JSON files
  const allTokens = {};
  const filesToProcess = [];

  const scanDirectory = (dir, relativePath = '') => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath, relPath);
      } else if (entry.name.endsWith('.json')) {
        filesToProcess.push({
          path: fullPath,
          name: entry.name,
          collection: path.dirname(relPath).split(path.sep).pop() || path.basename(relPath, '.json'),
        });
      }
    }
  };

  scanDirectory(folderPath);
  
  console.log(`📁 Found ${filesToProcess.length} JSON files`);

  // Process semantic colors with mode selection
  let filesToImport = [...filesToProcess];
  const semanticColorFiles = filesToProcess.filter(f => 
    f.path.includes('semantic colors') && f.name.includes('.tokens.json')
  );
  
  if (semanticColorFiles.length > 0 && selectedMode) {
    // Filter to selected mode
    const modeFile = semanticColorFiles.find(f => f.name.includes(selectedMode));
    if (modeFile) {
      console.log(`🎨 Using semantic colors from mode: ${selectedMode}`);
      filesToImport = filesToProcess.filter(f => 
        !(f.path.includes('semantic colors') && f.name.includes('.tokens.json')) || f === modeFile
      );
    }
  } else if (semanticColorFiles.length > 0) {
    // Use first mode (usually 'shadcn')
    const defaultModeFile = semanticColorFiles.find(f => f.name.includes('shadcn') && !f.name.includes('dark')) ||
                          semanticColorFiles[0];
    if (defaultModeFile) {
      console.log(`🎨 Using semantic colors from: ${defaultModeFile.name}`);
      filesToImport = filesToProcess.filter(f => 
        !(f.path.includes('semantic colors') && f.name.includes('.tokens.json')) || f === defaultModeFile
      );
    }
  }

  // Process each file
  let allProcessedTokens = {
    primitives: {},
    semantic: {},
  };

  for (const file of filesToImport) {
    console.log(`   Processing: ${file.name}`);
    const collectionName = file.collection || path.basename(file.name, '.json');
    const processed = processTokenFile(file.path, file.name, collectionName, allTokens);
    const mapped = mapToJoeStructure(processed, collectionName);
    
    // Merge into all tokens
    const deepMerge = (target, source) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (source[key].$value !== undefined) {
            target[key] = source[key];
          } else {
            if (!target[key]) target[key] = {};
            deepMerge(target[key], source[key]);
          }
        } else {
          target[key] = source[key];
        }
      }
    };
    
    if (mapped.primitives) {
      deepMerge(allProcessedTokens.primitives, mapped.primitives);
    }
    if (mapped.semantic) {
      deepMerge(allProcessedTokens.semantic, mapped.semantic);
    }
  }

  // Read existing Joe tokens
  if (!fs.existsSync(JOE_TOKENS_FILE)) {
    console.error(`❌ Joe tokens file not found: ${JOE_TOKENS_FILE}`);
    process.exit(1);
  }

  // Backup
  const existingContent = fs.readFileSync(JOE_TOKENS_FILE, 'utf-8');
  fs.writeFileSync(BACKUP_FILE, existingContent, 'utf-8');
  console.log(`💾 Backed up existing tokens to: ${BACKUP_FILE}`);

  const existingJoe = JSON.parse(existingContent);

  // Merge
  console.log('🔀 Merging tokens...');
  const merged = mergeTokens(existingJoe, allProcessedTokens);

  // Write
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
const folderArg = args.find(arg => arg.startsWith('--folder='))?.split('=')[1] ||
                  (args.includes('--folder') && args[args.indexOf('--folder') + 1] ? args[args.indexOf('--folder') + 1] : null);
const modeArg = args.find(arg => arg.startsWith('--mode='))?.split('=')[1] ||
                (args.includes('--mode') && args[args.indexOf('--mode') + 1] ? args[args.indexOf('--mode') + 1] : null);

const folderPath = folderArg ? path.resolve(folderArg) : DEFAULT_FOLDER;

importFromFolder(folderPath, modeArg);
