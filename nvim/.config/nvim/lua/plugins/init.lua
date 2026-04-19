-- Plugin declarations + loading registry

---@diagnostic disable-next-line: undefined-field
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
  { src = "https://github.com/zbirenbaum/copilot.lua", name = "copilot.lua" },
  { src = "https://github.com/giuxtaposition/blink-cmp-copilot", name = "blink-cmp-copilot" },
  "https://github.com/lukas-reineke/indent-blankline.nvim",
  "https://github.com/lewis6991/gitsigns.nvim",
  "https://github.com/windwp/nvim-autopairs",
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

  -- Immediate: copilot.lua
  {
    packadd = { "copilot.lua" },
    config = function()
      require("copilot").setup {
        suggestion = { enabled = false },
        panel = { enabled = false },
      }
    end,
  },

  -- Immediate: oil
  {
    packadd = { "oil.nvim", "nvim-web-devicons" },
    config = function()
      require("oil").setup { default_file_explorer = true, view_options = { show_hidden = true } }
      vim.keymap.set("n", "-", "<cmd>Oil<CR>", { desc = "Open parent directory", silent = true })
      vim.keymap.set("n", "<leader>o", "<cmd>Oil<CR>", { desc = "Oil file browser", silent = true })
    end,
  },

  -- Event: treesitter, linting, completion, formatting, indent guides
  { mod = "treesitter", event = { "BufReadPre", "BufNewFile" }, packadd = { "nvim-treesitter" } },
  { mod = "lint", event = { "BufReadPre", "BufNewFile" }, packadd = { "nvim-lint" } },
  { mod = "conform", event = { "BufReadPost", "BufNewFile" }, packadd = { "conform.nvim" } },
  {
    packadd = { "indent-blankline.nvim" },
    event = { "BufReadPre", "BufNewFile" },
    config = function()
      require("ibl").setup {
        indent = { char = "│" },
        scope = { enabled = true },
      }
    end,
  },
  -- Event: autopairs
  {
    packadd = { "nvim-autopairs" },
    event = { "InsertEnter" },
    config = function() require("nvim-autopairs").setup { check_ts = true } end,
  },
  -- Event: gitsigns
  {
    packadd = { "gitsigns.nvim" },
    event = { "BufReadPre", "BufNewFile" },
    config = function()
      require("gitsigns").setup {
        signs = {
          add = { text = "▎" },
          change = { text = "▎" },
          delete = { text = "" },
          topdelete = { text = "" },
          changedelete = { text = "▎" },
          untracked = { text = "▎" },
        },
        on_attach = function(bufnr)
          local gs = require "gitsigns"
          local map = function(keys, func, desc)
            vim.keymap.set("n", keys, func, { buffer = bufnr, desc = "Git: " .. desc })
          end
          map("]c", function() gs.nav_hunk "next" end, "Next hunk")
          map("[c", function() gs.nav_hunk "prev" end, "Prev hunk")
          map("<leader>gp", function() gs.preview_hunk() end, "Preview hunk")
          map("<leader>gs", function() gs.stage_hunk() end, "Stage hunk")
          map("<leader>gr", function() gs.reset_hunk() end, "Reset hunk")
          map("<leader>gb", function() gs.blame_line() end, "Blame line")
        end,
      }
    end,
  },
  {
    packadd = { "blink.cmp", "blink-cmp-copilot" },
    event = { "InsertEnter", "CmdlineEnter" },
    config = function()
      require("blink.cmp").setup {
        keymap = {
          preset = "default",
          ["<Tab>"] = { "accept", "fallback" },
        },
        appearance = { nerd_font_variant = "mono" },
        completion = {
          documentation = { auto_show = true },
          ghost_text = { enabled = true },
          accept = { auto_brackets = { enabled = true } },
        },
        sources = {
          default = { "lsp", "path", "snippets", "buffer", "copilot" },
          providers = {
            copilot = {
              name = "copilot",
              module = "blink-cmp-copilot",
              score_offset = 100,
              async = true,
            },
          },
        },
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
