- sync tokens with Figma (Token Studio) before deploy
    - import/sync joe-tokens into Figma via Token Studio so design uses same tokens (see tokens/README.md § Token Studio)
    - create a button in Figma using those tokens (validates design–code alignment)
    - test round-trip: change a token in Token Studio → export → update joe-tokens.json → run tokens:build → confirm Storybook shows the change (Storybook only updates when joe-tokens.json changes and you rebuild) also check if variables.css will update (and why we need this)

- spec driven development setup (also check mcp's that we need)

- deploy storybook on chromatic (research before doing it)

- research if docusaurus might be useful