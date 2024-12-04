#!/bin/bash

# Ensure NVM is loaded
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Find all .nvmrc files in subdirectories
echo "Searching for .nvmrc files..."
find . -name ".nvmrc" | while read -r nvmrc_path; do
  dir_path=$(dirname "$nvmrc_path")
  echo "Processing .nvmrc in $dir_path..."

  # Change to the directory containing the .nvmrc
  cd "$dir_path" || exit 1

  # Read the Node version from .nvmrc
  node_version=$(cat .nvmrc)

  # Install and use the specified Node.js version
  echo "Installing Node.js version $node_version..."
  nvm install "$node_version"
  

  # Return to the root directory
  cd - > /dev/null || exit 1
done

echo "Node.js setup complete for all .nvmrc files."
