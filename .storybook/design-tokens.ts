/**
 * Design token mapping for the Storybook Design Token addon.
 * Exposes Joe tokens for the Design Tokens tab in Storybook.
 * Wired in .storybook/preview.js via parameters.designToken.
 */
import joeTheme from '../tokens/output/tailwind/theme.cjs';

export const designTokens = {
  colors: joeTheme.colors ?? {},
  spacing: joeTheme.spacing ?? {},
  borderRadius: joeTheme.borderRadius ?? {},
  fontSize: joeTheme.fontSize ?? {},
  fontWeight: joeTheme.fontWeight ?? {},
};
