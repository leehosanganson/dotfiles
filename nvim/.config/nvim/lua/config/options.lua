local opt = vim.opt

-- Line numbers
opt.number = true
opt.relativenumber = true

-- Tabs / indentation
opt.expandtab = true
opt.shiftwidth = 2
opt.tabstop = 2
opt.smartindent = true

-- Search
opt.ignorecase = true
opt.smartcase = true

-- UI
opt.signcolumn = "yes"
opt.cursorline = true
opt.termguicolors = true
opt.wrap = false
opt.scrolloff = 8

-- Files
opt.autoread = true
opt.undofile = true
opt.swapfile = false

-- Splits
opt.splitright = true
opt.splitbelow = true

-- Misc
opt.spell = false
opt.clipboard = "unnamedplus"
