return {
  {
    "stevearc/oil.nvim",
    lazy = false,
    opts = {
      default_file_explorer = true,
      view_options = { show_hidden = true },
    },
    keys = {
      { "-", "<cmd>Oil<CR>", desc = "Open Oil" },
      { "<leader>o", "<cmd>Oil<CR>", desc = "Open Oil" },
    },
  },
  {
    "christoomey/vim-tmux-navigator",
    event = "VeryLazy",
  },
  {
    "stevearc/conform.nvim",
    event = "BufWritePre",
    opts = {
      format_on_save = { timeout_ms = 500, lsp_format = "fallback" },
      formatters_by_ft = {
        lua = { "stylua" },
        nix = { "nixpkgs_fmt" },
        yaml = { "prettierd" },
        json = { "prettierd" },
        css = { "prettierd" },
        markdown = { "prettierd" },
        typescript = { "prettierd" },
        javascript = { "prettierd" },
        go = { "gofmt", "golangci-lint" },
        javascriptreact = { "eslint_d" },
        typescriptreact = { "eslint_d" },
      },
    },
  },
  {
    "mfussenegger/nvim-lint",
    event = "VeryLazy",
    config = function()
      local lint = require "lint"
      lint.linters_by_ft = {
        lua = { "selene" },
        nix = { "statix" },
        go = { "golangcilint" },
        javascript = { "eslint_d" },
        typescript = { "eslint_d" },
      }
      vim.api.nvim_create_autocmd({ "BufWritePost", "InsertLeave" }, {
        callback = function()
          if vim.bo.buftype == "" then lint.try_lint() end
        end,
      })
    end,
  },
  { "b0o/SchemaStore.nvim", lazy = true },
}
