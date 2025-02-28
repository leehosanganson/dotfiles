if [[ -z $DOTFILES ]]; then
    DOTFILES=$HOME/.dotfiles
fi

if [[ -z $STOW_FILES ]]; then
    STOW_FILES="ghostty,nvim,tmux,wezterm,zsh"
fi

pushd $DOTFILES
for folder in $(echo $STOW_FOLDERS | sed "s/,/ /g")
do
    echo "Removing $folder"
    stow -D $folder
done
popd
