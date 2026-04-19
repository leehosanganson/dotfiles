local M = {}

function M.setup()
  require("catppuccin").setup {
    flavour = "mocha",
    integrations = {
      treesitter = true,
      native_lsp = { enabled = true },
    },
  }
  vim.cmd.colorscheme "catppuccin"
end

-- Default: called when mod is loaded without fn
setmetatable(M, {
  __call = function() M.setup() end,
})

return M
