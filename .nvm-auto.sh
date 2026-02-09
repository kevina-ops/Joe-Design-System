#!/bin/bash
# Helper script to automatically switch Node version when entering this directory
# Source this file or add to your shell config for automatic switching

# Check if .nvmrc exists
if [ -f .nvmrc ]; then
  # Get the Node version from .nvmrc
  NODE_VERSION=$(cat .nvmrc)
  
  # Check if nvm is available
  if command -v nvm &> /dev/null || [ -s "$HOME/.nvm/nvm.sh" ]; then
    # Load nvm if not already loaded
    [ -s "$HOME/.nvm/nvm.sh" ] && \. "$HOME/.nvm/nvm.sh"
    
    # Check current Node version
    CURRENT_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    REQUIRED_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
    
    # Switch if needed
    if [ "$CURRENT_VERSION" != "$REQUIRED_VERSION" ]; then
      echo "🔄 Switching to Node.js $NODE_VERSION (from .nvmrc)"
      nvm use
    fi
  fi
fi
