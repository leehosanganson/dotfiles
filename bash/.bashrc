# Git Bash (Windows) configuration.
# Managed via dotfiles (this repo) and symlinked into $USERPROFILE by
# setup-windows.ps1. This is Windows-only and excluded from the Linux stow.

# Reload this file after editing.
alias src='source ~/.bashrc'

# Shared shell tools (aliases + functions) also used by zsh.
[ -f ~/.config/bash-tools/tools.sh ] && source ~/.config/bash-tools/tools.sh

# Azure CLI
export PATH=$PATH:"/c/Program Files/Microsoft SDKs/Azure/CLI2/wbin"

# Editor. VS Code; --wait so git/CLI tools block until the tab is closed.
export EDITOR='code --wait'
export VISUAL="$EDITOR"

export DOCKER_SQL_MOUNT_PATH='/d/DockerMount/SQL'

# Autocomplete
if ! [ -f ~/.git-completion.bash ]; then
  curl https://raw.githubusercontent.com/git/git/master/contrib/completion/git-completion.bash -o ~/.git-completion.bash
fi

source ~/.git-completion.bash
