local is_nixos = vim.fn.executable "nixos-rebuild" == 1
if not is_nixos then return {} end

return {
  "stevearc/conform.nvim",
  opts = function(_, opts)
    opts.formatters_by_ft = opts.formatters_by_ft or {}

    opts.formatters_by_ft = {
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
    }

    opts.formatters = {
      stylua = {
        command = "stylua",
        stdin = true,
      },
      statix = {
        command = "statix",
        args = { "fix", "--stdin" },
        stdin = true,
      },
      nixpkgs_fmt = {
        command = "nixpkgs-fmt",
      },
      prettierd = {
        command = "prettierd",
        args = { "$FILENAME" },
        stdin = true,
        ignore_exitcode = true,
      },
      eslint_d = {
        command = "eslint_d",
        args = { "--stdin", "--stdin-filename", "$FILENAME" },
        stdin = true,
        ignore_exitcode = true,
      },
    }

    opts.format_on_save = {
      lsp_fallback = true,
      timeout_ms = 500,
    }
  end,
}
