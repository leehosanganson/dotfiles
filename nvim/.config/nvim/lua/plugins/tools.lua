return {
  {
    "stevearc/oil.nvim",
    lazy = false,
    dependencies = { "nvim-tree/nvim-web-devicons" },
    opts = { view_options = { show_hidden = true } },
    config = function(_, opts)
      require("oil").setup(opts)
      vim.keymap.set("n", "-", "<cmd>Oil<CR>", { desc = "Open parent directory", silent = true })
      vim.keymap.set("n", "<leader>o", "<cmd>Oil<CR>", { desc = "Oil file browser", silent = true })
    end,
  },

  {
    "christoomey/vim-tmux-navigator",
    keys = {
      { "<C-h>", "<cmd>TmuxNavigateLeft<CR>", desc = "Navigate left" },
      { "<C-j>", "<cmd>TmuxNavigateDown<CR>", desc = "Navigate down" },
      { "<C-k>", "<cmd>TmuxNavigateUp<CR>", desc = "Navigate up" },
      { "<C-l>", "<cmd>TmuxNavigateRight<CR>", desc = "Navigate right" },
      { "<C-\\>", "<cmd>TmuxNavigatePrevious<CR>", desc = "Navigate previous" },
    },
  },

  {
    "stevearc/conform.nvim",
    event = { "BufReadPost", "BufNewFile" },
    keys = {
      { "<leader>cf", function() require("conform").format { async = true } end, desc = "Format buffer" },
    },
    opts = {
      formatters_by_ft = {
        lua = { "stylua" },
        nix = { "nixpkgs_fmt" },
        yaml = { "prettierd" },
        json = { "prettierd" },
        jsonc = { "prettierd" },
        css = { "prettierd" },
        markdown = { "prettierd" },
        go = { "gofmt" },
        typescript = { "prettierd", "eslint_d" },
        typescriptreact = { "prettierd", "eslint_d" },
        javascript = { "prettierd", "eslint_d" },
        javascriptreact = { "prettierd", "eslint_d" },
      },
      format_on_save = {
        lsp_format = "fallback",
        timeout_ms = 500,
      },
    },
  },

  {
    "mfussenegger/nvim-lint",
    event = { "BufReadPre", "BufNewFile" },
    config = function()
      local lint = require "lint"
      lint.linters_by_ft = {
        lua = { "selene" },
        nix = { "statix" },
        go = { "golangcilint" },
        javascript = { "eslint_d" },
        typescript = { "eslint_d" },
        javascriptreact = { "eslint_d" },
        typescriptreact = { "eslint_d" },
      }
      vim.api.nvim_create_autocmd({ "BufWritePost", "InsertLeave" }, {
        group = vim.api.nvim_create_augroup("lint", { clear = true }),
        callback = function()
          if vim.bo.buftype == "" then lint.try_lint() end
        end,
      })
    end,
  },
}
