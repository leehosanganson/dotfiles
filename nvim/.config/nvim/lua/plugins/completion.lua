local function get_secret(path)
  local expanded_path = vim.fn.expand(path)
  local f = io.open(expanded_path, "r")
  if f then
    local content = f:read("*all"):gsub("%s+", "") -- Read and trim whitespace
    f:close()
    return content
  end
  return ""
end

return {
  {
    "saghen/blink.cmp",
    build = "cargo build --release",
    event = { "InsertEnter", "CmdlineEnter" },
    dependencies = {
      { "saghen/blink.lib" },
      { "giuxtaposition/blink-cmp-copilot" },
    },
    opts = {
      keymap = {
        preset = "default",
        -- Accept copilot inline suggestion when visible, otherwise blink accept
        ["<Tab>"] = {
          function()
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
      fuzzy = { implementation = "prefer_rust" },
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
          minuet = {
            name = "minuet",
            module = "minuet.blink",
            score_offset = 80,
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
          accept = false, -- Tab handled above by blink
          accept_word = "<C-l>", -- accept one word at a time
          next = "<M-]>",
          prev = "<M-[>",
          dismiss = "<C-]>",
        },
      },
      panel = { enabled = false },
    },
  },

  {
    "milanglacier/minuet-ai.nvim",
    dependencies = { "nvim-lua/plenary.nvim" },
    opts = {
      provider = "openai_compatible",
      provider_options = {
        openai_compatible = {
          end_point = "https://litellm.homelab.leehosanganson.dev/v1/chat/completions",
          api_key = get_secret "~/.config/sops-nix/secrets/litellm-api-key",
          name = "LiteLLM",
          model = "openai/gemma-4",
          stream = true,
          optional = { max_tokens = 256, stop = { "\n" } },
        },
      },
      -- Enable YAML support (which Copilot often lacks or filters)
      enabled_ft = { "yaml", "json" },
    },
  },
}
