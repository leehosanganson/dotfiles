vim.api.nvim_create_autocmd("CmdlineChanged", {
  pattern = { ":", "/", "?" },
  callback = function() vim.fn.wildtrigger() end,
})

vim.api.nvim_create_autocmd("BufEnter", {
  pattern = "*",
  command = "checktime",
})
