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
  settings = {
    yaml = {
      schemaStore = { enable = false, url = "" },
      schemas = {
        ["https://json.schemastore.org/github-workflow.json"] = ".github/workflows/*.{yml,yaml}",
        ["https://raw.githubusercontent.com/yannh/kubernetes-json-schema/master/v1.30.3-standalone-strict/all.json"] = {
          "*.k8s.yaml",
          "k8s/**/*.yaml",
          "kubernetes/**/*.yaml",
        },
        ["https://json.schemastore.org/kustomization.json"] = { "kustomization.yaml", "kustomization.yml" },
        ["https://json.schemastore.org/ansible-playbook.json"] = "playbooks/**/*.{yml,yaml}",
        ["https://json.schemastore.org/ansible-role-2.9.json"] = "roles/**/*.{yml,yaml}",
        ["https://json.schemastore.org/docker-compose.json"] = { "docker-compose*.{yml,yaml}", "compose*.{yml,yaml}" },
        ["https://json.schemastore.org/helmfile.json"] = "helmfile*.{yml,yaml}",
        ["https://raw.githubusercontent.com/argoproj/argo-cd/master/assets/openapi.json"] = "**/{application,appproject}*.yaml",
        ["https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/schemas/v3.0/schema.json"] = "**/openapi*.{yml,yaml}",
        ["https://json.schemastore.org/chart.json"] = "Chart.yaml",
      },
      validate = true,
      completion = true,
      hover = true,
    },
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
  before_init = function(_, config)
    config.settings = {
      json = {
        schemas = require("schemastore").json.schemas(),
        validate = { enable = true },
      },
    }
  end,
})

vim.lsp.enable { "lua_ls", "nixd", "yamlls", "helm_ls", "jsonls" }

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
