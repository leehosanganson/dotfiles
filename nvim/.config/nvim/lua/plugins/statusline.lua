return function()
  local function lsp_names()
    local clients = vim.lsp.get_clients { bufnr = 0 }
    local names = vim.tbl_map(function(c) return c.name end, clients)
    return table.concat(names, " ")
  end

  local function formatters()
    if not package.loaded["conform"] then return "" end
    local available = vim.tbl_filter(function(f) return f.available end, require("conform").list_formatters(0))
    local names = vim.tbl_map(function(f) return f.name end, available)
    return table.concat(names, " ")
  end

  local function linters()
    if not package.loaded["lint"] then return "" end
    local ft_linters = require("lint").linters_by_ft[vim.bo.filetype]
    if not ft_linters then return "" end
    return table.concat(ft_linters, " ")
  end

  require("lualine").setup {
    options = {
      theme = "catppuccin-mocha",
      globalstatus = true,
      section_separators = "",
      component_separators = "",
    },
    sections = {
      lualine_a = { "mode" },
      lualine_b = { "branch" },
      lualine_c = {
        { "filename", path = 1 },
        { "diagnostics", sources = { "nvim_diagnostic" } },
      },
      lualine_x = {
        { lsp_names, icon = "󰒋" },
        { formatters, icon = "󰉿" },
        { linters, icon = "󰦕" },
      },
      lualine_y = { "filetype" },
      lualine_z = { "location" },
    },
  }

  vim.api.nvim_create_autocmd("LspAttach", {
    group = vim.api.nvim_create_augroup("lualine-lsp-refresh", { clear = true }),
    callback = function() require("lualine").refresh() end,
  })
end
