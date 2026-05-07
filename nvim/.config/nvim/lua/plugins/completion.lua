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

vim.g.ai_ghost_text_enabled = true

local function sync_copilot_auto_trigger(enabled)
  local copilot_loaded = package.loaded["copilot.suggestion"] ~= nil
  if not copilot_loaded then return false end

  local config_ok, copilot_config = pcall(require, "copilot.config")
  local current_auto_trigger = config_ok and copilot_config and copilot_config.suggestion and copilot_config.suggestion.auto_trigger

  if current_auto_trigger == enabled then return true end

  local suggestion_ok, suggestion = pcall(require, "copilot.suggestion")
  if suggestion_ok and suggestion and suggestion.toggle_auto_trigger then pcall(suggestion.toggle_auto_trigger) end

  return true
end

---@return boolean enabled
function _G.toggle_ai_ghost_text()
  local next_state = not vim.g.ai_ghost_text_enabled
  vim.g.ai_ghost_text_enabled = next_state

  sync_copilot_auto_trigger(next_state)

  if vim.fn.exists(":Minuet") == 2 then
    local minuet_cmd = next_state and "Minuet virtualtext enable" or "Minuet virtualtext disable"
    pcall(vim.cmd, minuet_cmd)
  end

  return next_state
end

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
    event = { "InsertEnter", "BufReadPost", "BufNewFile" },
    opts = function()
      return {
        suggestion = {
          enabled = true,
          auto_trigger = vim.g.ai_ghost_text_enabled,
          keymap = {
            accept = false,
          },
        },
      }
    end,
    config = function(_, opts)
      require("copilot").setup(opts)
      sync_copilot_auto_trigger(vim.g.ai_ghost_text_enabled)
    end,
  },

  {
    "milanglacier/minuet-ai.nvim",
    cmd = { "Minuet" },
    event = { "InsertEnter", "BufReadPost", "BufNewFile" },
    dependencies = { "nvim-lua/plenary.nvim" },
    opts = {
      provider = "openai_compatible",
      n_completions = 1,
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
        auto_trigger_ft = vim.g.ai_ghost_text_enabled and { "*" } or {},
      },
    },
  },
}
