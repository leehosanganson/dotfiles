-- Customize Mason plugins

local is_nixos = vim.fn.executable("nixos-rebuild") == 1


---@type LazySpec
return {
  -- use mason-lspconfig to configure LSP installations
  {
    "williamboman/mason-lspconfig.nvim",
    -- overrides `require("mason-lspconfig").setup(...)`
    enabled = not is_nixos,
    opts = {
      ensure_installed = {
        "lua_ls",
        --        "pyright",
        --        "tsserver",
        --        "gopls",
        --        "dockerls",
        --        "jsonls",
        --        "bashls",
        -- add more arguments for adding more language servers
      },
      automatic_installation = false,
    },
  },
  -- use mason-null-ls to configure Formatters/Linter installation for null-ls sources
  {
    "jay-babu/mason-null-ls.nvim",
    -- overrides `require("mason-null-ls").setup(...)`
    enabled = not is_nixos,
    opts = {
      ensure_installed = {
        "stylua",
        -- "ruff",
        --        "prettier",
        --        "gofmt",
        --        "golangci_lint",
        --        "black",
        -- add more arguments for adding more null-ls sources
      },
      automatic_installation = false,
    },
  },
  {
    "jay-babu/mason-nvim-dap.nvim",
    -- overrides `require("mason-nvim-dap").setup(...)`
    enabled = not is_nixos,
    opts = {
      ensure_installed = {
        "python",
        "js",
        -- "delve",
        -- add more arguments for adding more debuggers
      },
      automatic_installation = false,
    },
  },
}
