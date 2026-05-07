local map = vim.keymap.set

map("n", "<Esc>", "<cmd>nohlsearch<CR>")
map("n", "<leader>q", "<cmd>q<CR>", { desc = "Quit" })
map("n", "<leader>w", "<cmd>w<CR>", { desc = "Save" })

map("n", "[d", function() vim.diagnostic.jump { count = -1, float = true } end, { desc = "Previous diagnostic" })
map("n", "]d", function() vim.diagnostic.jump { count = 1, float = true } end, { desc = "Next diagnostic" })
map("n", "<leader>e", vim.diagnostic.open_float, { desc = "Open diagnostic float" })

map("n", "<leader>tw", function() vim.wo.wrap = not vim.wo.wrap end, { desc = "Toggle wrap" })

map("n", "<leader>ai", function()
  if type(_G.toggle_ai_ghost_text) ~= "function" then
    vim.notify("AI ghost text toggle is unavailable", vim.log.levels.WARN)
    return
  end

  local enabled = _G.toggle_ai_ghost_text()
  vim.notify("AI ghost text " .. (enabled and "enabled" or "disabled"), vim.log.levels.INFO)
end, { desc = "Toggle AI ghost text" })

map("v", "<Tab>", ">gv", { desc = "Indent" })
map("v", "<S-Tab>", "<gv", { desc = "Unindent" })

map("n", "<leader>/", "gcc", { remap = true, desc = "Toggle comment" })
map("v", "<leader>/", "gc", { remap = true, desc = "Toggle comment" })

map("c", "<Up>", function()
  if vim.fn.pumvisible() == 1 then return "<C-p>" end
  return "<Up>"
end, { expr = true })

map("c", "<Down>", function()
  if vim.fn.pumvisible() == 1 then return "<C-n>" end
  return "<Down>"
end, { expr = true })

map("i", "<C-y>", function()
  local copilot_ok, suggestion = pcall(require, "copilot.suggestion")
  if copilot_ok and suggestion.is_visible() then
    suggestion.accept()
  else
    require("minuet.virtualtext").action.accept()
  end
end, { desc = "Accept blink selection, copilot, or minuet suggestion" })

map("n", "<leader>lv", function()
  local pdf = vim.fn.expand "%:p:r" .. ".pdf"
  vim.fn.jobstart({ "zathura", pdf }, { detach = true })
end, { desc = "Manual Zathura Open" })
