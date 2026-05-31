return {
  {
    "nvim-treesitter/nvim-treesitter",
    event = { "BufReadPost", "BufNewFile" },
    build = ":TSUpdate",
    main = "nvim-treesitter.configs",
    opts = {
      auto_install = false,
      ensure_installed = { "go", "gomod", "gosum", "typescript", "tsx", "javascript" },
      highlight = { enable = true },
      indent = { enable = true },
    },
  },
  {
    "lukas-reineke/indent-blankline.nvim",
    event = { "BufReadPost", "BufNewFile" },
    main = "ibl",
    opts = { indent = { char = "│" } },
  },
  {
    "folke/lazydev.nvim",
    ft = "lua",
    opts = {},
  },
}
