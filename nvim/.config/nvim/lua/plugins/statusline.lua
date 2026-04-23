return {
  {
    "nvim-lualine/lualine.nvim",
    lazy = false,
    config = function()
      local function lsp_names()
        local clients = vim.lsp.get_clients { bufnr = 0 }
        local names = vim.tbl_map(function(c) return c.name end, clients)
        return table.concat(names, ", ")
      end

      local function formatters()
        if not package.loaded["conform"] then return "" end
        local available = vim.tbl_filter(function(f) return f.available end, require("conform").list_formatters(0))
        local names = vim.tbl_map(function(f) return f.name end, available)
        return table.concat(names, ", ")
      end

      local function linters()
        if not package.loaded["lint"] then return "" end
        local ft_linters = require("lint").linters_by_ft[vim.bo.filetype]
        if not ft_linters then return "" end
        local installed = vim.tbl_filter(function(name) return vim.fn.executable(name) == 1 end, ft_linters)
        return table.concat(installed, ", ")
      end

      require("lualine").setup {
        options = {
          theme = "catppuccin-mocha",
          globalstatus = true,
          section_separators = { left = "", right = "" },
          component_separators = { left = "", right = "" },
        },
        sections = {
          lualine_a = { "mode" },
          lualine_b = { "branch" },
          lualine_c = {
            { "filename", path = 1 },
            { "diagnostics", sources = { "nvim_diagnostic" } },
          },
          lualine_x = {
            { lsp_names, icon = "󰒋" }, ---@type any
            { formatters, icon = "󰉿" }, ---@type any
            { linters, icon = "󰦕" }, ---@type any
          },
          lualine_y = { "filetype" },
          lualine_z = { "location" },
        },
      }

      vim.api.nvim_create_autocmd({ "LspAttach", "LspDetach" }, {
        group = vim.api.nvim_create_augroup("lualine-lsp-refresh", { clear = true }),
        callback = function() require("lualine").refresh() end,
      })
    end,
  },
}
