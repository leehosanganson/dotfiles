# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:$HOME/.local/bin:/usr/local/bin:$PATH

# Path to your Oh My Zsh installation.
export ZSH="$HOME/.oh-my-zsh"

ZSH_THEME="agnoster"

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment one of the following lines to change the auto-update behavior
# zstyle ':omz:update' mode disabled  # disable automatic updates
# zstyle ':omz:update' mode auto      # update automatically without asking
# zstyle ':omz:update' mode reminder  # just remind me to update when it's time

# Uncomment the following line to change how often to auto-update (in days).
# zstyle ':omz:update' frequency 13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS="true"

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# You can also set it to another string to have that shown instead of the default red dots.
# e.g. COMPLETION_WAITING_DOTS="%F{yellow}waiting...%f"
# Caution: this setting can cause issues with multiline prompts in zsh < 5.7.1 (see #5765)
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# ZSH Completions
fpath+=${ZSH_CUSTOM:-${ZSH:-~/.oh-my-zsh}/custom}/plugins/zsh-completions/src

# Plugins
plugins=(
  git
  fzf
  zsh-completions
  zsh-autosuggestions
  zsh-syntax-highlighting
)

source $ZSH/oh-my-zsh.sh

# Theme - Start Command Prompt on a new line
prompt_end() {
  if [[ -n $CURRENT_BG ]]; then
      print -n "%{%k%F{$CURRENT_BG}%}$SEGMENT_SEPARATOR"
  else
      print -n "%{%k%}"
  fi

  print -n "%{%f%}"
  CURRENT_BG='' 

  #Adds the new line and ➜ as the start character.
  printf "\n ➜";
}

# FZF
export FZF_BASE=/path/to/fzf/install/dir
export FZF_DEFAULT_OPTS='--height 40% --layout=reverse --border'
# export FZF_DEFAULT_COMMAND='fd --hidden --strip-cwd-prefix --exclude .git --exclude node_modules'
export FZF_TMUX_OPTS=" -p90%,70% "

# Zoxide
eval "$(zoxide init zsh)"

# Alias 
# For a full list of active aliases, run `alias`.
alias vim="nvim"
alias zshconfig="nvim ~/.zshrc"
alias ip="ipconfig getifaddr en1"
alias k="kubectl"

# fcd - find directory
alias fcd='cd "$(find . -type d | fzf)"'

# fh - search in your command history and execute selected command
fh() {
  eval $( ([ -n "$ZSH_NAME" ] && fc -l 1 || history) | fzf +s --tac | sed 's/ *[0-9]* *//')
}

# Lazygit - 'q' to quit at selected directory, 'shift-q' to quit normally
lg()
{
    export LAZYGIT_NEW_DIR_FILE=~/.lazygit/newdir

    lazygit "$@"

    if [ -f $LAZYGIT_NEW_DIR_FILE ]; then
            cd "$(cat $LAZYGIT_NEW_DIR_FILE)"
            rm -f $LAZYGIT_NEW_DIR_FILE > /dev/null
    fi
}

# Go
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin

# Rust
export PATH=$PATH:$HOME/.cargo/bin

# Python
export PATH="$PATH:/usr/bin/python"
export PATH=$PATH:$HOME/Library/Python/3.9/bin
export PATH=$PATH:$HOME/Library/Python/3.11/bin

export PATH="$HOME/.rd/bin:$PATH"

# Kubernetes
source <(kubectl completion zsh)

# Velero
source <(velero completion zsh)

# Orbstack / Docker
export DOCKER_DEFAULT_PLATFORM=linux/amd64
