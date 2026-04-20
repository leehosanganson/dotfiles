vim.filetype.add {
  pattern = {
    [".*/.*/templates/.*%.yaml"] = "helm",
    ["helmfile.*%.yaml"] = "helm",
  },
}

vim.lsp.config("lua_ls", {
  cmd = { "lua-language-server" },
  filetypes = { "lua" },
  root_markers = { ".luarc.json", ".git" },
  settings = {
    Lua = {
      runtime = { version = "LuaJIT" },
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
  before_init = function(_, config)
    local k8s_schema = {
      ["https://raw.githubusercontent.com/yannh/kubernetes-json-schema/master/v1.32.0-standalone-strict/all.json"] = {
        "*.k8s.yaml",
        "k8s/**/*.yaml",
        "kubernetes/**/*.yaml",
        "manifests/**/*.{yml,yaml}",
        "deploy/**/*.{yml,yaml}",
      },
    }

    local ok, schemastore = pcall(require, "schemastore")
    local yaml_schemas = ok and schemastore.yaml.schemas() or {}

    -- Merge the Kubernetes schema entry into the schemas table
    for url, globs in pairs(k8s_schema) do
      yaml_schemas[url] = globs
    end

    config.settings = {
      yaml = {
        kubernetes = true,
        schemaStore = { enable = false, url = "" },
        schemas = yaml_schemas,
        validate = true,
        completion = true,
        hover = true,
        format = { enable = false },
      },
    }
  end,
})

vim.lsp.config("helm_ls", {
  cmd = { "helm_ls", "serve" },
  filetypes = { "helm" },
  root_markers = { "Chart.yaml" },
})

vim.lsp.config("gopls", {
  cmd = { "gopls" },
  filetypes = { "go", "gomod", "gowork", "gotmpl" },
  root_markers = { "go.work", "go.mod", ".git" },
  settings = {
    gopls = {
      analyses = {
        unusedparams = true,
        shadow = true,
      },
      staticcheck = true,
      gofumpt = false,
      hints = {
        assignVariableTypes = true,
        compositeLiteralFields = true,
        functionTypeParameters = true,
        parameterNames = true,
        rangeVariableTypes = true,
      },
    },
  },
})

vim.lsp.config("ts_ls", {
  cmd = { "typescript-language-server", "--stdio" },
  filetypes = { "typescript", "typescriptreact", "javascript", "javascriptreact" },
  root_markers = { "tsconfig.json", "jsconfig.json", "package.json", ".git" },
  init_options = { hostInfo = "neovim" },
  settings = {
    typescript = {
      inlayHints = {
        includeInlayParameterNameHints = "all",
        includeInlayVariableTypeHints = true,
        includeInlayFunctionLikeReturnTypeHints = true,
      },
      format = { enable = false },
    },
    javascript = {
      inlayHints = {
        includeInlayParameterNameHints = "all",
        includeInlayVariableTypeHints = true,
        includeInlayFunctionLikeReturnTypeHints = true,
      },
      format = { enable = false },
    },
  },
})

vim.lsp.config("jsonls", {
  cmd = { "vscode-json-language-server", "--stdio" },
  filetypes = { "json", "jsonc" },
  root_markers = { ".git" },
  before_init = function(_, config)
    config.settings = {
      json = {
        schemas = require("schemastore").json.schemas(),
        validate = { enable = true },
      },
    }
  end,
})

vim.lsp.enable { "lua_ls", "nixd", "yamlls", "helm_ls", "jsonls", "gopls", "ts_ls" }

vim.api.nvim_create_autocmd("LspAttach", {
  callback = function(args)
    local map = vim.keymap.set
    local opts = { buffer = args.buf }
    local function with_desc(desc) return vim.tbl_extend("force", opts, { desc = desc }) end

    map("n", "gd", vim.lsp.buf.definition, with_desc "Go to definition")
    map("n", "gD", vim.lsp.buf.declaration, with_desc "Go to declaration")
    map("n", "gr", vim.lsp.buf.references, with_desc "References")
    map("n", "gi", vim.lsp.buf.implementation, with_desc "Go to implementation")
    map("n", "K", vim.lsp.buf.hover, with_desc "Hover docs")
    map("n", "<leader>ca", vim.lsp.buf.code_action, with_desc "Code action")
    map("v", "<leader>ca", vim.lsp.buf.code_action, with_desc "Code action")
    map("n", "<leader>cr", vim.lsp.buf.rename, with_desc "Rename symbol")
    map("n", "<leader>cd", vim.lsp.buf.type_definition, with_desc "Type definition")
  end,
})

vim.diagnostic.config {
  virtual_text = true,
  underline = true,
  signs = true,
  severity_sort = true,
  float = { border = "rounded" },
}
