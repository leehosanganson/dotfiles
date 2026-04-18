# Neovim Configuration

A minimal neovim 0.12+ configuration using [lazy.nvim](https://github.com/folke/lazy.nvim).

## Features

- **Colorscheme**: [catppuccin](https://github.com/catppuccin/nvim)
- **Syntax**: [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter)
- **LSP**: [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig)
- **Completion**: [blink.cmp](https://github.com/saghen/blink.cmp)
- **Formatting**: [conform.nvim](https://github.com/stevearc/conform.nvim)
- **Picker / Dashboard**: [snacks.nvim](https://github.com/folke/snacks.nvim)
- **Tmux integration**: [vim-tmux-navigator](https://github.com/christoomey/vim-tmux-navigator)

## Installation

```shell
# Back up existing config
mv ~/.config/nvim ~/.config/nvim.bak

# Clone
git clone https://github.com/leehosanganson/dotfiles ~/.config/nvim --sparse
cd ~/.config/nvim
git sparse-checkout set nvim/.config/nvim

# Or stow directly
cd dotfiles && stow nvim
```

## Structure

```
nvim/.config/nvim/
├── init.lua               # Entry point: options, keymaps, lazy bootstrap
└── lua/
    ├── config/
    │   ├── options.lua    # Vim options
    │   └── keymaps.lua    # Global key mappings
    └── plugins/
        ├── colorscheme.lua
        ├── treesitter.lua
        ├── lsp.lua
        ├── completion.lua
        ├── conform.lua
        └── editor.lua     # snacks.nvim, vim-tmux-navigator
```
