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
    DOTFILES=$HOME/.dotfiles
fi

if [[ -z $STOW_FOLDERS ]]; then
    STOW_FOLDERS="ghostty,nvim,tmux,wezterm,zsh,aerospace,sketchybar,obsidian,ai,opencode"
fi

pushd $DOTFILES
for folder in $(echo $STOW_FOLDERS | sed "s/,/ /g")
do
    echo "stow $folder"
    stow -D $folder
    stow $folder
done
popd
