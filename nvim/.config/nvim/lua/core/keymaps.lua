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
vim.keymap.set("c", "<Up>", "wildmenumode() ? '<C-E><Up>'   : '<Up>'", { expr = true })
vim.keymap.set("c", "<Down>", "wildmenumode() ? '<C-E><Down>' : '<Down>'", { expr = true })
