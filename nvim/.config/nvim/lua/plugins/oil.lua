local M = {}

function M.setup()
  require("oil").setup {
    default_file_explorer = true,
    view_options = {
      show_hidden = true,
    },
  }

  vim.keymap.set("n", "-", "<cmd>Oil<CR>", { desc = "Open parent directory" })
  vim.keymap.set("n", "<leader>o", "<cmd>Oil<CR>", { desc = "Oil file browser" })
end

setmetatable(M, {
  __call = function() M.setup() end,
})

return M
