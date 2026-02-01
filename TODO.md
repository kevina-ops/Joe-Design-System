** Storybook <> Token Studio **
- research if we need to scope design tokens per view
- sync tokens with Figma (Token Studio) before deploy
    - import/sync joe-tokens into Figma via Token Studio so design uses same tokens (see tokens/README.md § Token Studio)
    - create a button in Figma using those tokens (validates design–code alignment)
    - test round-trip: change a token in Token Studio → export → update joe-tokens.json → run tokens:build → confirm Storybook shows the change (Storybook only updates when joe-tokens.json changes and you rebuild)
- deploy storybook on chromatic (research before doing it)

** Process **
- spec driven development setup
- check mcp's that we need

** Misc **
- research if docusaurus might be useful