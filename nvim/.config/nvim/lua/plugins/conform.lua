return function()
  require("conform").setup {
    formatters_by_ft = {
      lua = { "stylua" },
      nix = { "statix", "nixpkgs_fmt" },
      yaml = { "prettierd" },
      yml = { "prettierd" },
      json = { "prettierd" },
      jsonc = { "prettierd" },
      css = { "prettierd" },
      markdown = { "prettierd" },
      go = { "gofmt", "golangci-lint" },
      typescript = { "prettierd", "eslint_d" },
      typescriptreact = { "prettierd", "eslint_d" },
      javascript = { "prettierd", "eslint_d" },
      javascriptreact = { "prettierd", "eslint_d" },
    },
    format_on_save = {
      lsp_fallback = true,
      timeout_ms = 500,
    },
  }
end
