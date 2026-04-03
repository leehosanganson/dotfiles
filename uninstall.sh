#!/usr/bin/env bash
if ! command -v stow &> /dev/null; then
    echo "stow is not installed. Please install it first." >&2
    exit 1
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
    echo "unstow $folder"
    stow -D "$folder"
done

popd >/dev/null
echo "Done! All directories unstowed."
