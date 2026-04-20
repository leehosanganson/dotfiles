vim.api.nvim_create_autocmd("CmdlineChanged", {
  group = vim.api.nvim_create_augroup("cmdline_pum", { clear = true }),
  pattern = { ":", "/", "?" },
  callback = function() vim.fn.wildtrigger() end,
})
