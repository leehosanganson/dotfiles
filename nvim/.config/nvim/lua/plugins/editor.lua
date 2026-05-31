return {
  {
    "nvim-treesitter/nvim-treesitter",
    branch = "main",
    event = { "BufReadPost", "BufNewFile" },
    build = ":TSUpdate",
    main = "nvim-treesitter",
    opts = {
      highlight = { enable = true },
      indent = { enable = true },
      folds = { enable = true },
    },
    init = function()
      vim.api.nvim_create_autocmd("FileType", {
        callback = function() pcall(vim.treesitter.start) end,
      })
    end,
  },
  {
    "lukas-reineke/indent-blankline.nvim",
    event = { "BufReadPost", "BufNewFile" },
    main = "ibl",
    opts = { indent = { char = "│", tab_char = "|" } },
  },
  {
    "folke/lazydev.nvim",
    ft = "lua",
    opts = {},
  },
}
