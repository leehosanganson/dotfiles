if [[ -z $DOTFILES ]]; then
    DOTFILES=$HOME/.dotfiles
fi

if [[ -z $STOW_FOLDERS ]]; then
    STOW_FOLDERS="ghostty,nvim,tmux,wezterm,zsh,aerospace,sketchybar"
fi

pushd $DOTFILES
for folder in $(echo $STOW_FOLDERS | sed "s/,/ /g")
do
    echo "stow $folder"
    stow -D $folder
    stow $folder
done
popd
