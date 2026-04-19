# Neovim Configuration

Minimal neovim 0.12 configuration using native `vim.pack.add` for plugin management — no third-party plugin manager needed.

## Plugins

- **Theme**: [catppuccin](https://github.com/catppuccin/nvim) (mocha)
- **LSP**: Native neovim 0.12 LSP (`vim.lsp.config` / `vim.lsp.enable`) — no mason
- **Completion**: [blink.cmp](https://github.com/saghen/blink.cmp)
- **Formatter**: [conform.nvim](https://github.com/stevearc/conform.nvim)
- **Linter**: [nvim-lint](https://github.com/mfussenegger/nvim-lint)
- **Treesitter**: [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter)
- **Tmux**: [vim-tmux-navigator](https://github.com/christoomey/vim-tmux-navigator)
- **Git**: [lazygit.nvim](https://github.com/kdheepak/lazygit.nvim)
- **Search**: [telescope.nvim](https://github.com/nvim-telescope/telescope.nvim) with ripgrep
- **File browser**: [oil.nvim](https://github.com/stevearc/oil.nvim)

## Requirements

- Neovim >= 0.12
- Language servers installed externally (e.g. via nix): `lua_ls`, `nixd`, `yamlls`, `helm_ls`, `jsonls`, `gopls`, `vtsls`
- [ripgrep](https://github.com/BurntSushi/ripgrep) for telescope live grep
- [lazygit](https://github.com/jesseduffield/lazygit) for git UI

## Key Mappings

| Key | Description |
|---|---|
| `<leader>ff` | Find files |
| `<leader>fg` | Live grep (ripgrep) |
| `<leader>fw` | Grep word under cursor |
| `<leader>fb` | Find buffers |
| `<leader>fr` | Recent files |
| `<leader>gg` | LazyGit |
| `-` | Oil file browser |
| `<leader>cf` | Format buffer |
| `<leader>ca` | Code action |
| `<leader>cr` | Rename symbol |
| `gd` | Go to definition |
| `gr` | References |
| `K` | Hover docs |
