return {
  {
    "lewis6991/gitsigns.nvim",
    event = { "BufReadPre", "BufNewFile" },
    opts = {
      signs = {
        add = { text = "▎" },
        change = { text = "▎" },
        delete = { text = "" },
        topdelete = { text = "" },
        changedelete = { text = "▎" },
        untracked = { text = "▎" },
      },
      on_attach = function(bufnr)
        local gs = require "gitsigns"
        local map = function(keys, func, desc)
          vim.keymap.set("n", keys, func, { buffer = bufnr, desc = "Git: " .. desc })
        end
        map("]c", function() gs.nav_hunk "next" end, "Next hunk")
        map("[c", function() gs.nav_hunk "prev" end, "Prev hunk")
        map("<leader>gp", function() gs.preview_hunk() end, "Preview hunk")
        map("<leader>gs", function() gs.stage_hunk() end, "Stage hunk")
        map("<leader>gr", function() gs.reset_hunk() end, "Reset hunk")
        map("<leader>gb", function() gs.blame_line() end, "Blame line")
      end,
    },
  },

  {
    "kdheepak/lazygit.nvim",
    dependencies = { "nvim-lua/plenary.nvim" },
    cmd = "LazyGit",
    keys = {
      { "<leader>gg", "<cmd>LazyGit<CR>", desc = "LazyGit" },
    },
  },
}
