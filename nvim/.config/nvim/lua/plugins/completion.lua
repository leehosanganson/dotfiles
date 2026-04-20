return {
  {
    "saghen/blink.cmp",
    build = "cargo build --release",
    event = { "InsertEnter", "CmdlineEnter" },
    dependencies = {
      { "giuxtaposition/blink-cmp-copilot" },
    },
    opts = {
      keymap = {
        preset = "default",
        ["<Tab>"] = { "select_and_accept", "fallback" },
        ["<C-j>"] = { "show", "show_documentation", "hide_documentation", "fallback" },
        ["<C-n>"] = { "select_next", "fallback" },
        ["<C-p>"] = { "select_prev", "fallback" },
      },
      appearance = { nerd_font_variant = "mono" },
      fuzzy = { implementation = "prefer_rust", prebuilt_binaries = { download = false } },
      completion = {
        documentation = { auto_show = true },
        ghost_text = { enabled = true },
        accept = { auto_brackets = { enabled = true } },
      },
      sources = {
        default = { "lsp", "path", "snippets", "buffer", "copilot" },
        providers = {
          copilot = {
            name = "copilot",
            module = "blink-cmp-copilot",
            score_offset = 100,
            async = true,
          },
        },
      },
    },
  },

  {
    "zbirenbaum/copilot.lua",
    event = "InsertEnter",
    opts = { suggestion = { enabled = false }, panel = { enabled = false } },
  },
}
