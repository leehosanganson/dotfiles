-- Native neovim 0.12 LSP configuration (no mason, no lspconfig)
-- Servers are expected to be installed externally (e.g. via nix)

vim.lsp.config("lua_ls", {
  cmd = { "lua-language-server" },
  filetypes = { "lua" },
  root_markers = { ".luarc.json", ".luarc.jsonc", ".git" },
  settings = {
    Lua = {
      runtime = { version = "LuaJIT" },
      workspace = {
        checkThirdParty = false,
        library = {
          vim.env.VIMRUNTIME or "",
          (vim.fn.stdpath("config") --[[@as string]]) .. "/lua",
          (vim.fn.stdpath("data") --[[@as string]]) .. "/site/pack/core/opt",
        },
      },
    },
  },
})

vim.lsp.config("nixd", {
  cmd = { "nixd" },
  filetypes = { "nix" },
  root_markers = { "flake.nix", ".git" },
})

vim.lsp.config("yamlls", {
  cmd = { "yaml-language-server", "--stdio" },
  filetypes = { "yaml" },
  root_markers = { ".git" },
})

vim.filetype.add({
  pattern = {
    [".*/templates/.*%.ya?ml"] = "helm",
    [".*/helmfile.*%.ya?ml"] = "helm",
  },
})

vim.lsp.config("helm_ls", {
  cmd = { "helm_ls", "serve" },
  filetypes = { "helm" },
  root_markers = { "Chart.yaml" },
})

vim.lsp.config("jsonls", {
  cmd = { "vscode-json-language-server", "--stdio" },
  filetypes = { "json", "jsonc" },
  root_markers = { ".git" },
})

-- Enable only installed servers
vim.lsp.enable({ "lua_ls", "nixd", "yamlls", "helm_ls", "jsonls" })

-- LSP keymaps on attach
vim.api.nvim_create_autocmd("LspAttach", {
  group = vim.api.nvim_create_augroup("lsp-keymaps", { clear = true }),
  callback = function(ev)
    ---@param keys string
    ---@param func function
    ---@param desc string
    ---@param mode string|string[]|nil
    local map = function(keys, func, desc, mode)
      mode = mode or "n"
      vim.keymap.set(mode, keys, func, { buffer = ev.buf, desc = "LSP: " .. desc })
    end

    map("gd", function() vim.lsp.buf.definition() end, "Go to definition")
    map("gD", function() vim.lsp.buf.declaration() end, "Go to declaration")
    map("gr", function() vim.lsp.buf.references() end, "References")
    map("gi", function() vim.lsp.buf.implementation() end, "Go to implementation")
    map("K", function() vim.lsp.buf.hover() end, "Hover documentation")
    map("<leader>ca", function() vim.lsp.buf.code_action() end, "Code action", { "n", "v" })
    map("<leader>cr", function() vim.lsp.buf.rename() end, "Rename symbol")
    map("<leader>cd", function() vim.lsp.buf.type_definition() end, "Type definition")
  end,
})

-- Diagnostics
vim.diagnostic.config {
  virtual_text = true,
  underline = true,
  signs = true,
}
