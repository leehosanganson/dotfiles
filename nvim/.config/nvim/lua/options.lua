vim.g.mapleader = " "
vim.g.maplocalleader = ","
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

local opt = vim.opt

opt.number = true
opt.relativenumber = true
opt.signcolumn = "yes"
opt.wrap = false
opt.scrolloff = 8
opt.termguicolors = true
opt.updatetime = 250
opt.undofile = true
opt.ignorecase = true
opt.smartcase = true
opt.clipboard = "unnamedplus"
opt.cursorline = true
opt.expandtab = true
opt.shiftwidth = 2
opt.tabstop = 2
opt.timeoutlen = 300
opt.smartindent = true
opt.inccommand = "split"
opt.pumborder = "rounded"
opt.wildmode = "noselect:lastused,full"
opt.wildoptions = "pum"
opt.list = true
opt.listchars = { tab = "» ", trail = "·", nbsp = "␣" }
