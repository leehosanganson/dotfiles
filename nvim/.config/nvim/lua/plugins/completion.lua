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

vim.env.LITELLM_API_KEY = get_secret "~/.config/sops-nix/secrets/litellm-api-key"

return {
  {
    "saghen/blink.cmp",
    dependencies = {
      "saghen/blink.lib",
      "rafamadriz/friendly-snippets",
    },
    ---@module 'blink.cmp'
    ---@type blink.cmp.Config
    opts = {
      keymap = {
        preset = "default",
        ["<C-j>"] = { "show", "show_documentation", "hide_documentation", "fallback" },
        ["<C-n>"] = { "select_next", "fallback" },
        ["<C-p>"] = { "select_prev", "fallback" },
      },
      fuzzy = { implementation = "lua" },
      appearance = { nerd_font_variant = "mono" },
      completion = {
        menu = { auto_show = false },
        documentation = { auto_show = false },
      },
      sources = {
        default = { "lsp", "path", "snippets", "buffer" },
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
        keymap = {
          accept = false,
        },
      },
    },
  },

  {
    "milanglacier/minuet-ai.nvim",
    event = "InsertEnter",
    dependencies = { "nvim-lua/plenary.nvim" },
    opts = {
      provider = "openai_compatible",
      provider_options = {
        openai_compatible = {
          end_point = "https://litellm.homelab.leehosanganson.dev/v1/chat/completions",
          api_key = "LITELLM_API_KEY",
          name = "LiteLLM",
          model = "unsloth/qwen-3.6",
          stream = true,
          optional = { max_tokens = 256, stop = { "\n" } },
        },
      },
      virtualtext = {
        auto_trigger_ft = { "*" },
        keymap = {},
      },
    },
  },
}
