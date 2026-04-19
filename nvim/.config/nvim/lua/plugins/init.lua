-- Plugin declarations (vim.pack.add) + loading registry

vim.pack.add({
  -- Theme
  { src = "https://github.com/catppuccin/nvim", name = "catppuccin" },

  -- Core utilities
  "https://github.com/nvim-lua/plenary.nvim",
  "https://github.com/nvim-tree/nvim-web-devicons",

  -- Completion
  "https://github.com/saghen/blink.cmp",

  -- Formatting
  "https://github.com/stevearc/conform.nvim",

  -- Linting
  "https://github.com/mfussenegger/nvim-lint",

  -- Treesitter
  { src = "https://github.com/nvim-treesitter/nvim-treesitter", version = "main" },

  -- Tmux navigation
  "https://github.com/christoomey/vim-tmux-navigator",

  -- Git
  "https://github.com/kdheepak/lazygit.nvim",

  -- Fuzzy finder
  "https://github.com/nvim-telescope/telescope.nvim",
  "https://github.com/nvim-telescope/telescope-fzf-native.nvim",

  -- File browser
  "https://github.com/stevearc/oil.nvim",
}, { confirm = false, load = function() end })

-- Loading registry
local pack = require "pack"

pack.setup {
  -- Immediate: colorscheme
  { mod = "catppuccin", packadd = { "catppuccin" } },

  -- BufReadPre: treesitter, linting
  { mod = "treesitter", event = { "BufReadPre", "BufNewFile" }, packadd = { "nvim-treesitter" } },
  { mod = "lint", event = { "BufReadPre", "BufNewFile" }, packadd = { "nvim-lint" } },

  -- InsertEnter: completion
  { mod = "completion", event = { "InsertEnter", "CmdlineEnter" }, packadd = { "blink.cmp" } },

  -- BufWritePre: formatting
  { mod = "conform", event = "BufWritePre", once = false, packadd = { "conform.nvim" } },

  -- Keymap: telescope
  { mod = "telescope", keys = {
    { "<leader>ff", desc = "Find files" },
    { "<leader>fg", desc = "Live grep" },
    { "<leader>fb", desc = "Find buffers" },
    { "<leader>fh", desc = "Help tags" },
    { "<leader>fw", desc = "Grep word under cursor" },
    { "<leader>fd", desc = "Find diagnostics" },
    { "<leader>fr", desc = "Recent files" },
  }, packadd = { "telescope.nvim", "plenary.nvim", "telescope-fzf-native.nvim" } },

  -- Keymap: oil
  { mod = "oil", keys = {
    { "-", desc = "Open parent directory" },
    { "<leader>o", desc = "Oil file browser" },
  }, packadd = { "oil.nvim", "nvim-web-devicons" } },

  -- Keymap: lazygit
  { mod = "lazygit", keys = {
    { "<leader>gg", desc = "LazyGit" },
  }, packadd = { "lazygit.nvim", "plenary.nvim" } },

  -- Keymap: tmux navigator
  { mod = "tmux", keys = {
    { "<C-h>", desc = "Navigate left" },
    { "<C-j>", desc = "Navigate down" },
    { "<C-k>", desc = "Navigate up" },
    { "<C-l>", desc = "Navigate right" },
    { "<C-\\>", desc = "Navigate previous" },
  }, packadd = { "vim-tmux-navigator" } },

  -- Keymap: format
  { mod = "conform", fn = "keymap", keys = {
    { "<leader>cf", desc = "Format buffer" },
  }, packadd = { "conform.nvim" } },
}
