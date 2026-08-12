# Git Bash (Windows) login shell profile.
# Managed via dotfiles (this repo) and symlinked into $USERPROFILE by
# setup-windows.ps1. Sources .bashrc so aliases are available in interactive
# login shells.

if [ -f ~/.bashrc ]; then
    source ~/.bashrc
fi
