return {
  {
    "ThePrimeagen/harpoon",
    branch = "harpoon2",
    dependencies = { "nvim-lua/plenary.nvim" },
    keys = {
      { "<leader>a", function() require("harpoon"):list():add() end, desc = "Harpoon File" },
      {
        "<C-e>",
        function()
          local harpoon = require "harpoon"
          harpoon.ui:toggle_quick_menu(harpoon:list())
        end,
        desc = "Harpoon Menu",
      },
      { "<C-h>", function() require("harpoon"):list():select(1) end, desc = "Harpoon to File 1" },
      { "<C-j>", function() require("harpoon"):list():select(2) end, desc = "Harpoon to File 2" },
      { "<C-k>", function() require("harpoon"):list():select(3) end, desc = "Harpoon to File 3" },
      { "<C-l>", function() require("harpoon"):list():select(4) end, desc = "Harpoon to File 4" },
    },
    config = function() require("harpoon"):setup() end,
  },
}
