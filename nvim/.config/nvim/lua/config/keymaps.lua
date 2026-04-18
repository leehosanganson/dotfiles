local map = vim.keymap.set

-- Resize windows
map("n", "<C-Up>", ":resize +2<CR>", { desc = "Increase window height" })
map("n", "<C-Down>", ":resize -2<CR>", { desc = "Decrease window height" })
map("n", "<C-Left>", ":vertical resize -2<CR>", { desc = "Decrease window width" })
map("n", "<C-Right>", ":vertical resize +2<CR>", { desc = "Increase window width" })

-- Buffer navigation
map("n", "]b", ":bnext<CR>", { desc = "Next buffer" })
map("n", "[b", ":bprev<CR>", { desc = "Previous buffer" })
map("n", "<Leader>bd", ":bdelete<CR>", { desc = "Delete buffer" })

-- Clear search highlight
map("n", "<Esc>", ":nohlsearch<CR>", { desc = "Clear search highlight" })

-- Stay in indent mode
map("v", "<", "<gv", { desc = "Indent left" })
map("v", ">", ">gv", { desc = "Indent right" })

-- Move lines
map("n", "<A-j>", ":m .+1<CR>==", { desc = "Move line down" })
map("n", "<A-k>", ":m .-2<CR>==", { desc = "Move line up" })
map("v", "<A-j>", ":m '>+1<CR>gv=gv", { desc = "Move selection down" })
map("v", "<A-k>", ":m '<-2<CR>gv=gv", { desc = "Move selection up" })

-- Save
map("n", "<C-s>", ":w<CR>", { desc = "Save file" })

-- Quit
map("n", "<Leader>q", ":quit<CR>", { desc = "Quit" })

-- Diagnostics
map("n", "<Leader>e", vim.diagnostic.open_float, { desc = "Open diagnostic float" })
map("n", "[d", vim.diagnostic.goto_prev, { desc = "Previous diagnostic" })
map("n", "]d", vim.diagnostic.goto_next, { desc = "Next diagnostic" })
