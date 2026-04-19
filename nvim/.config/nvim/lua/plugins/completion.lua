local M = {}

function M.setup()
  require("blink.cmp").setup {
    keymap = { preset = "default" },
    appearance = {
      nerd_font_variant = "mono",
    },
    completion = { documentation = { auto_show = true } },
    sources = {
      default = { "lsp", "path", "snippets", "buffer" },
    },
  }
end

setmetatable(M, {
  __call = function() M.setup() end,
})

return M
