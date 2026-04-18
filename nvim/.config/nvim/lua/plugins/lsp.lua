-- Native neovim 0.12 LSP configuration (no mason, no lspconfig)
-- Servers are expected to be installed externally (e.g. via nix)

local servers = {
  "lua_ls",
  "nixd",
  "yamlls",
  "helm_ls",
  "jsonls",
  "gopls",
  "vtsls",
}

-- Configure each server
vim.lsp.config("lua_ls", {
  settings = {
    Lua = {
      runtime = { version = "LuaJIT" },
      workspace = {
        checkThirdParty = false,
        library = { vim.env.VIMRUNTIME },
      },
    },
  },
})

-- Enable servers
vim.lsp.enable(servers)

-- LSP keymaps on attach
vim.api.nvim_create_autocmd("LspAttach", {
  group = vim.api.nvim_create_augroup("lsp-keymaps", { clear = true }),
  callback = function(ev)
    local map = function(keys, func, desc, mode)
      mode = mode or "n"
      vim.keymap.set(mode, keys, func, { buffer = ev.buf, desc = "LSP: " .. desc })
    end

    map("gd", vim.lsp.buf.definition, "Go to definition")
    map("gD", vim.lsp.buf.declaration, "Go to declaration")
    map("gr", vim.lsp.buf.references, "References")
    map("gi", vim.lsp.buf.implementation, "Go to implementation")
    map("K", vim.lsp.buf.hover, "Hover documentation")
    map("<leader>ca", vim.lsp.buf.code_action, "Code action", { "n", "v" })
    map("<leader>cr", vim.lsp.buf.rename, "Rename symbol")
    map("<leader>cd", vim.lsp.buf.type_definition, "Type definition")
  end,
})

-- Diagnostics
vim.diagnostic.config {
  virtual_text = true,
  underline = true,
  signs = true,
}

-- Return empty spec since LSP is configured natively
return {}
