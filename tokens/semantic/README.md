# Semantic Tokens

This directory contains **semantic** (alias) tokens that reference primitives from `../joe-tokens.json`.

## File Structure

| File            | Purpose                                              |
| --------------- | ---------------------------------------------------- |
| `shared.json`   | Base semantic tokens shared across all platforms     |
| `consumer.json` | Consumer app overrides (deep-merged over shared)     |
| `merchant.json` | Merchant Manager overrides (deep-merged over shared) |
| `pos.json`      | POS system overrides (deep-merged over shared)       |

## Merge Order

When building tokens for a specific platform, the build script applies this merge order:

```
primitives → shared.json → <platform>.json
```

Later files win on conflict. This allows each platform to override specific semantic values (e.g., different primary action colors) while sharing the majority of the design language.

## Adding Platform Overrides

To override a semantic token for a specific platform, add the same key path in the platform file. For example, to change the primary action color for the merchant platform:

```json
{
  "color": {
    "action": {
      "primary": {
        "$type": "color",
        "$value": "{primitives.colors.green.500}",
        "$description": "Merchant primary action"
      }
    }
  }
}
```

## Format

All tokens use **W3C DTCG** format with `$value` and `$type` keys. References use the `{path.to.token}` syntax.
