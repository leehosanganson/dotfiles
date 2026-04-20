-- Disable netrw early so Oil.nvim can take over as the file explorer
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

-- Set leader keys before plugins
vim.g.mapleader = " "
vim.g.maplocalleader = ","

-- Options
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.signcolumn = "yes"
vim.opt.wrap = false
vim.opt.scrolloff = 8
vim.opt.autoread = true
vim.opt.termguicolors = true
vim.opt.updatetime = 250
vim.opt.undofile = true
vim.opt.ignorecase = true
vim.opt.smartcase = true
vim.opt.splitbelow = true
vim.opt.splitright = true
vim.opt.clipboard = "unnamedplus"
vim.opt.cursorline = true
vim.opt.expandtab = true
vim.opt.shiftwidth = 2
vim.opt.tabstop = 2
vim.opt.softtabstop = 2
vim.opt.timeoutlen = 300
vim.opt.smartindent = true
vim.opt.smarttab = true

-- Cmdline completion popup options
vim.opt.autocomplete = true
vim.opt.inccommand = "split"
vim.opt.cmdheight = 1
vim.opt.completeopt = { "menu", "menuone", "noselect", "popup" }
vim.opt.pumborder = "rounded"
vim.opt.wildmode = "noselect:lastused,full"
vim.opt.wildoptions = "pum"

vim.api.nvim_create_autocmd({ "FocusGained", "BufEnter" }, {
  group = vim.api.nvim_create_augroup("autoread", { clear = true }),
  callback = function() vim.cmd.checktime() end,
})
