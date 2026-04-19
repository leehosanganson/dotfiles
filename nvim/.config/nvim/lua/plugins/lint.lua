local M = {}

function M.setup()
  local lint = require "lint"
  lint.linters_by_ft = {
    nix = { "statix" },
    go = { "golangcilint" },
    javascript = { "eslint_d" },
    typescript = { "eslint_d" },
    javascriptreact = { "eslint_d" },
    typescriptreact = { "eslint_d" },
  }
  vim.api.nvim_create_autocmd({ "BufEnter", "BufWritePost", "InsertLeave" }, {
    group = vim.api.nvim_create_augroup("lint", { clear = true }),
    callback = function() lint.try_lint() end,
  })
end

setmetatable(M, {
  __call = function() M.setup() end,
})

return M
