-- Plugin declarations + loading registry

vim.pack.add({
  { src = "https://github.com/catppuccin/nvim", name = "catppuccin" },
  "https://github.com/nvim-lua/plenary.nvim",
  "https://github.com/nvim-tree/nvim-web-devicons",
  "https://github.com/saghen/blink.cmp",
  "https://github.com/stevearc/conform.nvim",
  "https://github.com/mfussenegger/nvim-lint",
  { src = "https://github.com/nvim-treesitter/nvim-treesitter", version = "main" },
  "https://github.com/christoomey/vim-tmux-navigator",
  "https://github.com/kdheepak/lazygit.nvim",
  "https://github.com/nvim-telescope/telescope.nvim",
  "https://github.com/nvim-telescope/telescope-fzf-native.nvim",
  "https://github.com/stevearc/oil.nvim",
  "https://github.com/nvim-lualine/lualine.nvim",
}, { confirm = false, load = function() end })

require("pack").setup {
  -- Immediate: colorscheme
  {
    packadd = { "catppuccin" },
    config = function()
      require("catppuccin").setup {
        flavour = "mocha",
        integrations = { treesitter = true, native_lsp = { enabled = true } },
      }
      vim.cmd.colorscheme "catppuccin"
    end,
  },

  -- Immediate: statusline
  { packadd = { "lualine.nvim", "nvim-web-devicons" }, mod = "statusline" },

  -- Event: treesitter, linting, completion, formatting
  { mod = "treesitter", event = { "BufReadPre", "BufNewFile" }, packadd = { "nvim-treesitter" } },
  { mod = "lint", event = { "BufReadPre", "BufNewFile" }, packadd = { "nvim-lint" } },
  { mod = "conform", event = { "BufReadPost", "BufNewFile" }, packadd = { "conform.nvim" } },
  {
    packadd = { "blink.cmp" },
    event = { "InsertEnter", "CmdlineEnter" },
    config = function()
      require("blink.cmp").setup {
        keymap = { preset = "default" },
        appearance = { nerd_font_variant = "mono" },
        completion = { documentation = { auto_show = true } },
        sources = { default = { "lsp", "path", "snippets", "buffer" } },
      }
    end,
  },

  -- Keymap: telescope
  {
    packadd = { "telescope.nvim", "plenary.nvim", "telescope-fzf-native.nvim" },
    config = function()
      local telescope = require "telescope"
      telescope.setup { defaults = { file_ignore_patterns = { "node_modules", ".git/" } } }
      pcall(telescope.load_extension, "fzf")
    end,
    keys = {
      { "<leader>ff", cmd = "<cmd>Telescope find_files<CR>", desc = "Find files" },
      { "<leader>fg", cmd = "<cmd>Telescope live_grep<CR>", desc = "Live grep" },
      { "<leader>fb", cmd = "<cmd>Telescope buffers<CR>", desc = "Find buffers" },
      { "<leader>fh", cmd = "<cmd>Telescope help_tags<CR>", desc = "Help tags" },
      { "<leader>fw", cmd = "<cmd>Telescope grep_string<CR>", desc = "Grep word under cursor" },
      { "<leader>fd", cmd = "<cmd>Telescope diagnostics<CR>", desc = "Find diagnostics" },
      { "<leader>fr", cmd = "<cmd>Telescope oldfiles<CR>", desc = "Recent files" },
    },
  },

  -- Keymap: oil
  {
    packadd = { "oil.nvim", "nvim-web-devicons" },
    config = function() require("oil").setup { default_file_explorer = true, view_options = { show_hidden = true } } end,
    keys = {
      { "-", cmd = "<cmd>Oil<CR>", desc = "Open parent directory" },
      { "<leader>o", cmd = "<cmd>Oil<CR>", desc = "Oil file browser" },
    },
  },

  -- Keymap: lazygit
  {
    packadd = { "lazygit.nvim", "plenary.nvim" },
    keys = {
      { "<leader>gg", cmd = "<cmd>LazyGit<CR>", desc = "LazyGit" },
    },
  },

  -- Keymap: tmux navigator
  {
    packadd = { "vim-tmux-navigator" },
    keys = {
      { "<C-h>", cmd = "<cmd>TmuxNavigateLeft<CR>", desc = "Navigate left" },
      { "<C-j>", cmd = "<cmd>TmuxNavigateDown<CR>", desc = "Navigate down" },
      { "<C-k>", cmd = "<cmd>TmuxNavigateUp<CR>", desc = "Navigate up" },
      { "<C-l>", cmd = "<cmd>TmuxNavigateRight<CR>", desc = "Navigate right" },
      { "<C-\\>", cmd = "<cmd>TmuxNavigatePrevious<CR>", desc = "Navigate previous" },
    },
  },

  -- Keymap: manual format
  {
    mod = "conform",
    packadd = { "conform.nvim" },
    keys = {
      { "<leader>cf", cmd = function() require("conform").format { async = true } end, desc = "Format buffer" },
    },
  },
}
