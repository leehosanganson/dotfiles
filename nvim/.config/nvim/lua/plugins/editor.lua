return {
  -- File picker, dashboard, notifications, and more
  {
    "folke/snacks.nvim",
    priority = 1000,
    lazy = false,
    opts = {
      dashboard = { enabled = true },
      notifier = { enabled = true },
      picker = { enabled = true },
      statuscolumn = { enabled = true },
    },
    keys = {
      { "<Leader>ff", function() Snacks.picker.files() end, desc = "Find files" },
      { "<Leader>fg", function() Snacks.picker.grep() end, desc = "Live grep" },
      { "<Leader>fb", function() Snacks.picker.buffers() end, desc = "Find buffers" },
      { "<Leader>fr", function() Snacks.picker.recent() end, desc = "Recent files" },
      { "<Leader>fh", function() Snacks.picker.help() end, desc = "Help pages" },
      { "<Leader>fc", function() Snacks.picker.commands() end, desc = "Commands" },
    },
  },

  -- Tmux/Neovim split navigation
  {
    "christoomey/vim-tmux-navigator",
    cmd = {
      "TmuxNavigateLeft",
      "TmuxNavigateDown",
      "TmuxNavigateUp",
      "TmuxNavigateRight",
      "TmuxNavigatePrevious",
    },
    keys = {
      { "<C-h>", "<cmd><C-U>TmuxNavigateLeft<cr>" },
      { "<C-j>", "<cmd><C-U>TmuxNavigateDown<cr>" },
      { "<C-k>", "<cmd><C-U>TmuxNavigateUp<cr>" },
      { "<C-l>", "<cmd><C-U>TmuxNavigateRight<cr>" },
      { "<C-\\>", "<cmd><C-U>TmuxNavigatePrevious<cr>" },
    },
  },
}
