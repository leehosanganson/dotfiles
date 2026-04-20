# Neovim Config

A minimal Neovim 0.12 setup for NixOS, using [lazy.nvim](https://github.com/folke/lazy.nvim) as the plugin manager with lazy-loading enabled by default.

## Structure

```
nvim/
├── init.lua                  # Entry point: bootstraps lazy.nvim, loads core & config.lsp
└── lua/
    ├── core/
    │   ├── init.lua          # Requires options, keymaps, autocmds
    │   ├── options.lua       # vim.g.* globals and vim.opt.* settings
    │   ├── keymaps.lua       # General vim.keymap.set calls
    │   └── autocmds.lua      # CmdlineChanged autocmd
    ├── config/
    │   ├── lsp.lua           # Native LSP setup (filetype, servers, keymaps, diagnostics)
    │   └── statusline.lua    # Lualine configuration
    └── plugins/
        ├── colorscheme.lua   # catppuccin
        ├── statusline.lua    # lualine spec
        ├── editor.lua        # treesitter, indent-blankline
        ├── completion.lua    # blink.cmp, copilot.lua
        ├── telescope.lua     # telescope + fzf-native
        ├── git.lua           # gitsigns, lazygit
        ├── tools.lua         # oil, vim-tmux-navigator, conform, nvim-lint
```

## Requirements

- Neovim >= 0.12
- Language servers installed externally (e.g. via nix): `lua_ls`, `nixd`, `yamlls`, `helm_ls`, `jsonls`
- [ripgrep](https://github.com/BurntSushi/ripgrep) for Telescope live grep
- [lazygit](https://github.com/jesseduffield/lazygit) for the git UI

---

## Leader Keys

| Key       | Role         |
| --------- | ------------ |
| `<Space>` | Leader       |
| `,`       | Local leader |

---

## General

| Key          | Mode | Description                      |
| ------------ | ---- | -------------------------------- |
| `<Esc>`      | n    | Clear search highlight           |
| `<leader>q`  | n    | Quit                             |
| `<leader>w`  | n    | Save                             |
| `[d`         | n    | Previous diagnostic              |
| `]d`         | n    | Next diagnostic                  |
| `<leader>e`  | n    | Show diagnostic float            |
| `<leader>tw` | n    | Toggle line wrap                 |
| `<Tab>`      | v    | Indent selection and re-select   |
| `<S-Tab>`    | v    | Unindent selection and re-select |
| `<leader>/`  | n    | Toggle comment                   |
| `<leader>/`  | v    | Toggle comment                   |

> **Note:** In command-line mode, `<Up>` / `<Down>` are remapped to navigate the popup menu (via `<C-p>` / `<C-n>`) when the menu is visible; otherwise they behave normally.

---

## LSP

> **Note:** These keymaps are buffer-local and only active when an LSP server is attached to the current buffer.

| Key          | Mode | Description          |
| ------------ | ---- | -------------------- |
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
| ------------ | ---- | ---------------------- |
| `<leader>ff` | n    | Find files             |
| `<leader>fg` | n    | Live grep              |
| `<leader>fb` | n    | Find buffers           |
| `<leader>fh` | n    | Help tags              |
| `<leader>fw` | n    | Grep word under cursor |
| `<leader>fd` | n    | Find diagnostics       |
| `<leader>fr` | n    | Recent files           |

---

## Oil (File Browser)

> **Note:** Oil loads at startup (`lazy = false`).

| Key         | Mode | Description           |
| ----------- | ---- | --------------------- |
| `-`         | n    | Open parent directory |
| `<leader>o` | n    | Oil file browser      |

---

## Git

> **Note:** LazyGit is lazy-loaded on first use.

| Key          | Mode | Description  |
| ------------ | ---- | ------------ |
| `<leader>gg` | n    | Open LazyGit |

---

## Git Signs

> **Note:** gitsigns is loaded on first buffer read. Signs appear in the sign column for added (▎), changed (▎), and deleted (󰍵/󰐊) lines.

| Key          | Mode | Description  |
| ------------ | ---- | ------------ |
| `]c`         | n    | Next hunk    |
| `[c`         | n    | Prev hunk    |
| `<leader>gp` | n    | Preview hunk |
| `<leader>gs` | n    | Stage hunk   |
| `<leader>gr` | n    | Reset hunk   |
| `<leader>gb` | n    | Blame line   |

---

## Tmux Navigation

> **Note:** vim-tmux-navigator is lazy-loaded on first use.

| Key     | Mode | Description               |
| ------- | ---- | ------------------------- |
| `<C-h>` | n    | Navigate left             |
| `<C-j>` | n    | Navigate down             |
| `<C-k>` | n    | Navigate up               |
| `<C-l>` | n    | Navigate right            |
| `<C-\>` | n    | Navigate to previous pane |

---

## Code

> **Note:** `conform.nvim` runs automatically on save via `BufWritePre`. No manual keymap is provided.

---

## Copilot

> **Note:** `copilot.lua` loads on `InsertEnter` and requires Node.js on PATH. Run `:Copilot auth` to authenticate. The panel is disabled — Copilot provides both inline suggestions (rendered natively) and completion items inside the **blink.cmp** menu.

### Inline Suggestions

> **Note:** These keymaps only fire when a Copilot inline suggestion is currently visible. `<Tab>` accepts the full inline suggestion via blink.cmp (see Completion section).

| Key     | Mode | Description                          |
| ------- | ---- | ------------------------------------ |
| `<C-l>` | i    | Accept one word of inline suggestion |
| `<M-]>` | i    | Next inline suggestion               |
| `<M-[>` | i    | Previous inline suggestion           |
| `<C-]>` | i    | Dismiss inline suggestion            |

---

## Completion (blink.cmp)

> **Note:** Ghost text (inline preview) is **disabled** in blink.cmp — Copilot renders inline suggestions natively. Press `<Tab>` to accept a Copilot inline suggestion (if visible) or the current completion item.

Active in **insert** and **cmdline** mode. Uses the `"default"` preset.

| Key       | Mode | Description                                                                |
| --------- | ---- | -------------------------------------------------------------------------- |
| `<Tab>`   | i    | Accept Copilot inline suggestion (if visible), else accept completion item |
| `<S-Tab>` | i    | Select previous item                                                       |
| `<CR>`    | i    | Confirm selection                                                          |
| `<C-j>`   | i    | Trigger completion menu                                                    |
| `<C-e>`   | i    | Cancel / close menu                                                        |
| `<C-n>`   | i    | Navigate to next item                                                      |
| `<C-p>`   | i    | Navigate to previous item                                                  |

---

## Plugins

| Plugin                                                                                   | Purpose                                              |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [catppuccin/nvim](https://github.com/catppuccin/nvim)                                    | Colorscheme (mocha)                                  |
| [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter)                    | Syntax highlighting and code parsing                 |
| [blink.cmp](https://github.com/saghen/blink.cmp)                                         | Fast, async completion engine                        |
| [conform.nvim](https://github.com/stevearc/conform.nvim)                                 | Code formatting with support for multiple formatters |
| [nvim-lint](https://github.com/mfussenegger/nvim-lint)                                   | Asynchronous linting                                 |
| [telescope.nvim](https://github.com/nvim-telescope/telescope.nvim)                       | Fuzzy finder for files, grep, buffers, and more      |
| [telescope-fzf-native.nvim](https://github.com/nvim-telescope/telescope-fzf-native.nvim) | Native FZF sorter for Telescope                      |
| [oil.nvim](https://github.com/stevearc/oil.nvim)                                         | File browser in a buffer                             |
| [lazygit.nvim](https://github.com/kdheepak/lazygit.nvim)                                 | LazyGit terminal UI integration                      |
| [vim-tmux-navigator](https://github.com/christoomey/vim-tmux-navigator)                  | Seamless pane navigation between Neovim and tmux     |
| [lualine.nvim](https://github.com/nvim-lualine/lualine.nvim)                             | Fast and configurable statusline                     |
| [plenary.nvim](https://github.com/nvim-lua/plenary.nvim)                                 | Lua utility library (required by Telescope, LazyGit) |
| [nvim-web-devicons](https://github.com/nvim-tree/nvim-web-devicons)                      | File type icons (used by Oil, lualine)               |
| [copilot.lua](https://github.com/zbirenbaum/copilot.lua)                                 | GitHub Copilot client (headless, blink-managed)      |
| [blink-cmp-copilot](https://github.com/giuxtaposition/blink-cmp-copilot)                 | Copilot source for blink.cmp                         |
| [indent-blankline.nvim](https://github.com/lukas-reineke/indent-blankline.nvim)          | Indentation guide lines                              |
| [gitsigns.nvim](https://github.com/lewis6991/gitsigns.nvim)                              | Git change indicators in the sign column             |
