-- AstroUI provides the basis for configuring the AstroNvim User Interface
-- Configuration documentation can be found with `:h astroui`
-- NOTE: We highly recommend setting up the Lua Language Server (`:LspInstall lua_ls`)
--       as this provides autocomplete and documentation while editing

---@type LazySpec
return {
  "AstroNvim/astroui",
  ---@type AstroUIOpts
  opts = {
    -- change colorscheme
    colorscheme = "catppuccin",
    -- AstroUI allows you to easily modify highlight groups easily for any and all colorschemes
    highlights = {
      init = {
        ["@lsp.type.class"] = { fg = "#f4b8e4" }, -- Lavender for classes (Catppuccin palette example)
        ["@lsp.type.variable"] = { fg = "#89b4fa" }, -- Blue for variables
        ["@lsp.type.namespace"] = { fg = "#f38ba8" }, -- Rose for namespaces/modules
        -- Add more: @lsp.type.function, @lsp.type.parameter, etc.
      },
      catppuccin = { -- Catppuccin-specific if needed
        ["@lsp.type.class"] = { fg = "#f4b8e4" },
      },
    },
    -- Icons can be configured throughout the interface
    icons = {
      -- configure the loading of the lsp in the status line
      LSPLoading1 = "⠋",
      LSPLoading2 = "⠙",
      LSPLoading3 = "⠹",
      LSPLoading4 = "⠸",
      LSPLoading5 = "⠼",
      LSPLoading6 = "⠴",
      LSPLoading7 = "⠦",
      LSPLoading8 = "⠧",
      LSPLoading9 = "⠇",
      LSPLoading10 = "⠏",
    },
  },
}
