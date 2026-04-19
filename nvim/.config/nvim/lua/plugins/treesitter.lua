local M = {}

function M.setup()
  require("nvim-treesitter.configs").setup {
    highlight = { enable = true },
    indent = { enable = true },
    auto_install = true,
    ensure_installed = {
      "lua",
      "vim",
      "vimdoc",
      "go",
      "nix",
      "json",
      "yaml",
      "typescript",
      "javascript",
      "tsx",
      "html",
      "css",
      "markdown",
      "markdown_inline",
      "bash",
    },
  }
end

setmetatable(M, {
  __call = function() M.setup() end,
})

return M
