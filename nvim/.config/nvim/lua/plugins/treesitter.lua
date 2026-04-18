return {
  {
    "nvim-treesitter/nvim-treesitter",
    build = ":TSUpdate",
    event = { "BufReadPost", "BufNewFile" },
    opts = {
      highlight = { enable = true },
      indent = { enable = true },
      auto_install = true,
      ensure_installed = {
        "lua",
        "vim",
        "vimdoc",
        "go",
        "nix",
        "yaml",
        "json",
        "typescript",
        "javascript",
        "markdown",
        "markdown_inline",
      },
    },
    config = function(_, opts)
      require("nvim-treesitter.configs").setup(opts)
    end,
  },
}
