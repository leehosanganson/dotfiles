return function()
  local lint = require "lint"
  lint.linters_by_ft = {
    lua = { "selene" },
    nix = { "statix" },
    go = { "golangcilint" },
    javascript = { "eslint_d" },
    typescript = { "eslint_d" },
    javascriptreact = { "eslint_d" },
    typescriptreact = { "eslint_d" },
  }
  vim.api.nvim_create_autocmd({ "BufWritePost", "InsertLeave" }, {
    group = vim.api.nvim_create_augroup("lint", { clear = true }),
    callback = function()
      if vim.bo.buftype == "" then lint.try_lint() end
    end,
  })
end
