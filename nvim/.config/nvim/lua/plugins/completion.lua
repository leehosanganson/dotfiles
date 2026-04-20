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
        -- Accept copilot inline suggestion when visible, otherwise blink accept
        ["<Tab>"] = {
          function(cmp)
            local ok, suggestion = pcall(require, "copilot.suggestion")
            if ok and suggestion.is_visible() then
              suggestion.accept()
              return true
            end
          end,
          "select_and_accept",
          "fallback",
        },
        ["<C-j>"] = { "show", "show_documentation", "hide_documentation", "fallback" },
        ["<C-n>"] = { "select_next", "fallback" },
        ["<C-p>"] = { "select_prev", "fallback" },
      },
      appearance = { nerd_font_variant = "mono" },
      fuzzy = { implementation = "prefer_rust", prebuilt_binaries = { download = false } },
      completion = {
        documentation = { auto_show = true },
        -- Disable blink ghost text — copilot.lua renders it natively and faster
        ghost_text = { enabled = false },
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
    opts = {
      suggestion = {
        enabled = true,
        auto_trigger = true,
        debounce = 50, -- ms before suggestion appears (lower = faster)
        keymap = {
          accept = false,       -- Tab handled above by blink
          accept_word = "<C-l>", -- accept one word at a time
          next = "<M-]>",
          prev = "<M-[>",
          dismiss = "<C-]>",
        },
      },
      panel = { enabled = false },
    },
  },
}
