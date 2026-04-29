return {
  {
    "nvim-telescope/telescope.nvim",
    dependencies = {
      "nvim-lua/plenary.nvim",
      { "nvim-telescope/telescope-fzf-native.nvim", build = "make" },
    },
    cmd = "Telescope",
    keys = {
      { "<leader>ff", desc = "Find files" },
      { "<leader>fg", "<cmd>Telescope live_grep<CR>", desc = "Live grep" },
      { "<leader>fb", "<cmd>Telescope buffers<CR>", desc = "Find buffers" },
      { "<leader>fh", "<cmd>Telescope help_tags<CR>", desc = "Help tags" },
      { "<leader>fw", desc = "Grep word under cursor" },
      { "<leader>fd", "<cmd>Telescope diagnostics<CR>", desc = "Find diagnostics" },
      { "<leader>fr", "<cmd>Telescope oldfiles<CR>", desc = "Recent files" },
    },
    opts = {
      defaults = { file_ignore_patterns = { "node_modules", ".git/" } },
      pickers = {
        find_files = {
          find_command = { "rg", "--files", "--hidden", "--follow", "--no-ignore-vcs" },
        },
      },
    },
    config = function(_, opts)
      local function get_project_root()
        local dir = vim.fn.expand "%:p:h"
        if dir == "" then return vim.fn.getcwd() end
        local markers = { ".git", "package.json", "Cargo.toml", "pyproject.toml", "go.mod", ".hg" }
        while true do
          for _, marker in ipairs(markers) do
            if vim.uv.fs_stat(dir .. "/" .. marker) then return dir end
          end
          local parent = vim.fn.fnamemodify(dir, ":h")
          if parent == dir then break end
          dir = parent
        end
        return vim.fn.getcwd()
      end

      local telescope = require "telescope"
      telescope.setup(opts)
      pcall(telescope.load_extension, "fzf")

      vim.keymap.set(
        "n",
        "<leader>ff",
        function() require("telescope.builtin").find_files { cwd = get_project_root() } end,
        { desc = "Find files" }
      )
      vim.keymap.set(
        "n",
        "<leader>fw",
        function() require("telescope.builtin").grep_string { cwd = get_project_root() } end,
        { desc = "Grep word under cursor" }
      )
    end,
  },
}
