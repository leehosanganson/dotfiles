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

vim.api.nvim_create_autocmd({ "FocusGained", "BufEnter" }, {
  group = vim.api.nvim_create_augroup("autoread", { clear = true }),
  callback = function() vim.cmd.checktime() end,
})

-- Keymaps
vim.keymap.set("n", "<Esc>", "<cmd>nohlsearch<CR>", { desc = "Clear search highlight" })
vim.keymap.set("n", "<leader>q", "<cmd>q<CR>", { desc = "Quit" })
vim.keymap.set("n", "<leader>w", "<cmd>w<CR>", { desc = "Save" })
vim.keymap.set("n", "[d", function() vim.diagnostic.jump { count = -1 } end, { desc = "Previous diagnostic" })
vim.keymap.set("n", "]d", function() vim.diagnostic.jump { count = 1 } end, { desc = "Next diagnostic" })
vim.keymap.set("n", "<leader>e", vim.diagnostic.open_float, { desc = "Show diagnostic" })
vim.keymap.set("n", "<leader>tw", function() vim.opt.wrap = not vim.opt.wrap:get() end, { desc = "Toggle wrap" })
vim.keymap.set("v", "<Tab>", ">gv", { desc = "Indent selection" })
vim.keymap.set("v", "<S-Tab>", "<gv", { desc = "Unindent selection" })
vim.keymap.set("n", "<leader>/", "gcc", { remap = true, desc = "Toggle Comment" })
vim.keymap.set("v", "<leader>/", "gc", { remap = true, desc = "Toggle Comment" })

-- Cmdline completion popup navigation
vim.opt.autocomplete = true
vim.opt.inccommand = "split"
vim.opt.cmdheight = 1
vim.opt.completeopt = { "menu", "menuone", "noselect", "popup" }
vim.opt.pumborder = "rounded"
vim.opt.wildmode = "noselect:lastused,full"
vim.opt.wildoptions = "pum"
vim.keymap.set("c", "<Up>", "wildmenumode() ? '<C-E><Up>'   : '<Up>'", { expr = true })
vim.keymap.set("c", "<Down>", "wildmenumode() ? '<C-E><Down>' : '<Down>'", { expr = true })
vim.api.nvim_create_autocmd("CmdlineChanged", {
  group = vim.api.nvim_create_augroup("cmdline_pum", { clear = true }),
  pattern = { ":", "/", "?" },
  callback = function() vim.fn.wildtrigger() end,
})
