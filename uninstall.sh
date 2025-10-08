if [[ -z $DOTFILES ]]; then
    DOTFILES=$HOME/.dotfiles
fi

if [[ -z $STOW_FOLDERS ]]; then
    STOW_FOLDERS="ghostty,nvim,tmux,wezterm,zsh,aerospace,sketchybar,obsidian"
fi

pushd $DOTFILES
for folder in $(echo $STOW_FOLDERS | sed "s/,/ /g")
do
    echo "Removing $folder"
    stow -D $folder
done
popd
