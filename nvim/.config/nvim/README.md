# Neovim Config

A minimal Neovim 0.12 setup for NixOS, using native `vim.pack.add` (no external plugin manager) with lazy-loading via `vim.schedule` and `VimEnter` autocmds.

## Requirements

- Neovim >= 0.12
- Language servers installed externally (e.g. via nix): `lua_ls`, `nixd`, `yamlls`, `helm_ls`, `jsonls`
- [ripgrep](https://github.com/BurntSushi/ripgrep) for Telescope live grep
- [lazygit](https://github.com/jesseduffield/lazygit) for the git UI

---

## Leader Keys

| Key       | Role         |
|-----------|--------------|
| `<Space>` | Leader       |
| `,`       | Local leader |

---

## General

| Key         | Mode | Description            |
|-------------|------|------------------------|
| `<Esc>`     | n    | Clear search highlight |
| `<leader>q` | n    | Quit                   |
| `<leader>w` | n    | Save                   |
| `[d`        | n    | Previous diagnostic    |
| `]d`        | n    | Next diagnostic        |
| `<leader>e` | n    | Show diagnostic float  |
| `<leader>tw` | n    | Toggle line wrap       |
| `<Tab>`   | v    | Indent selection and re-select   |
| `<S-Tab>` | v    | Unindent selection and re-select |

---

## LSP

> **Note:** These keymaps are buffer-local and only active when an LSP server is attached to the current buffer.

| Key          | Mode | Description          |
|--------------|------|----------------------|
| `gd`         | n    | Go to definition     |
| `gD`         | n    | Go to declaration    |
| `gr`         | n    | References           |
| `gi`         | n    | Go to implementation |
| `K`          | n    | Hover documentation  |
| `<leader>ca` | n, v | Code action          |
| `<leader>cr` | n    | Rename symbol        |
| `<leader>cd` | n    | Type definition      |

---

## Telescope

> **Note:** Telescope is lazy-loaded — the plugin initialises on first use of any of these keymaps.

| Key          | Mode | Description            |
|--------------|------|------------------------|
| `<leader>ff` | n    | Find files             |
| `<leader>fg` | n    | Live grep              |
| `<leader>fb` | n    | Find buffers           |
| `<leader>fh` | n    | Help tags              |
| `<leader>fw` | n    | Grep word under cursor |
| `<leader>fd` | n    | Find diagnostics       |
| `<leader>fr` | n    | Recent files           |

---

## Oil (File Browser)

> **Note:** Oil is lazy-loaded on first use.

| Key         | Mode | Description           |
|-------------|------|-----------------------|
| `-`         | n    | Open parent directory |
| `<leader>o` | n    | Oil file browser      |

---

## Git

> **Note:** LazyGit is lazy-loaded on first use.

| Key          | Mode | Description  |
|--------------|------|--------------|
| `<leader>gg` | n    | Open LazyGit |

---

## Tmux Navigation

> **Note:** vim-tmux-navigator is lazy-loaded on first use.

| Key     | Mode | Description               |
|---------|------|---------------------------|
| `<C-h>` | n    | Navigate left             |
| `<C-j>` | n    | Navigate down             |
| `<C-k>` | n    | Navigate up               |
| `<C-l>` | n    | Navigate right            |
| `<C-\>` | n    | Navigate to previous pane |

---

## Code

> **Note:** conform.nvim is lazy-loaded on first use.

| Key          | Mode | Description   |
|--------------|------|---------------|
| `<leader>cf` | n    | Format buffer |

---

## Copilot

> **Note:** Copilot is loaded immediately on startup and requires Node.js on PATH. Run `:Copilot setup` to authenticate. `<C-y>` accepts a suggestion only when the blink.cmp completion menu is **closed** — when the menu is open, `<C-y>` confirms the blink selection instead.

| Key     | Mode | Description              |
|---------|------|--------------------------|
| `<C-y>` | i    | Accept Copilot suggestion |

---

## Completion (blink.cmp)

Active in **insert** and **cmdline** mode. Uses the `"default"` preset.

| Key         | Mode | Description               |
|-------------|------|---------------------------|
| `<Tab>`     | i    | Select next item          |
| `<S-Tab>`   | i    | Select previous item      |
| `<CR>`      | i    | Confirm selection         |
| `<C-Space>` | i    | Trigger completion menu   |
| `<C-e>`     | i    | Cancel / close menu       |
| `<C-n>`     | i    | Navigate to next item     |
| `<C-p>`     | i    | Navigate to previous item |

---

## Plugins

| Plugin                                                                               | Purpose                                               |
|--------------------------------------------------------------------------------------|-------------------------------------------------------|
| [catppuccin/nvim](https://github.com/catppuccin/nvim)                                | Colorscheme (mocha)                                   |
| [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter)                | Syntax highlighting and code parsing                  |
| [blink.cmp](https://github.com/saghen/blink.cmp)                                     | Fast, async completion engine                         |
| [conform.nvim](https://github.com/stevearc/conform.nvim)                             | Code formatting with support for multiple formatters  |
| [nvim-lint](https://github.com/mfussenegger/nvim-lint)                               | Asynchronous linting                                  |
| [telescope.nvim](https://github.com/nvim-telescope/telescope.nvim)                   | Fuzzy finder for files, grep, buffers, and more       |
| [telescope-fzf-native.nvim](https://github.com/nvim-telescope/telescope-fzf-native.nvim) | Native FZF sorter for Telescope                   |
| [oil.nvim](https://github.com/stevearc/oil.nvim)                                     | File browser in a buffer                              |
| [lazygit.nvim](https://github.com/kdheepak/lazygit.nvim)                             | LazyGit terminal UI integration                       |
| [vim-tmux-navigator](https://github.com/christoomey/vim-tmux-navigator)              | Seamless pane navigation between Neovim and tmux      |
| [lualine.nvim](https://github.com/nvim-lualine/lualine.nvim)                         | Fast and configurable statusline                      |
| [plenary.nvim](https://github.com/nvim-lua/plenary.nvim)                             | Lua utility library (required by Telescope, LazyGit)  |
| [nvim-web-devicons](https://github.com/nvim-tree/nvim-web-devicons)                  | File type icons (used by Oil, lualine)                |
| [copilot.vim](https://github.com/github/copilot.vim) | GitHub Copilot AI suggestions |
| [indent-blankline.nvim](https://github.com/lukas-reineke/indent-blankline.nvim) | Indentation guide lines |
