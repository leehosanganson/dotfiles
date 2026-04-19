local M = {}

function M.setup()
  vim.keymap.set("n", "<leader>gg", "<cmd>LazyGit<CR>", { desc = "LazyGit" })
end

setmetatable(M, {
  __call = function() M.setup() end,
})

return M
