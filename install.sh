#!/usr/bin/env bash
if ! command -v stow &> /dev/null; then
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt update && sudo apt install -y stow
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install stow
    else
        echo "Please install stow manually (apt/brew/etc.)" >&2
        exit 1
    fi
fi

if [[ -z $DOTFILES ]]; then
    DOTFILES=$HOME/dotfiles
fi

pushd "$DOTFILES" >/dev/null

# Dynamically find all directories (excluding common non-stow files/scripts)
STOW_FOLDERS=$(find . -maxdepth 1 -type d ! -name '.' \
    | sed 's|^\./||' \
    | grep -E -v '^(install\.sh|uninstall\.sh|secrets|\.git)$' \
    | tr '\n' ' ')

if [[ -z "$STOW_FOLDERS" ]]; then
    echo "No stowable directories found!" >&2
    exit 1
fi

echo "Found stow folders: $STOW_FOLDERS"
for folder in $STOW_FOLDERS; do
    echo "stow $folder"
    stow -D "$folder" 2>/dev/null || true
    stow $folder
done

popd >/dev/null
echo "Done! All directories stowed."
