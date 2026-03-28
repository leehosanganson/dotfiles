local is_nixos = vim.fn.executable("nixos-rebuild") == 1
if not is_nixos then return {} end

return {
    "stevearc/conform.nvim",
    opts = function(_, opts)
        opts.formatters_by_ft = opts.formatters_by_ft or {}

        -- nix
        opts.formatters_by_ft = {
            -- Map the filetype to the executable name
            nix = { "statix", "nixpkgs_fmt" },
            yaml = { "prettierd" },
            yml = { "prettierd" },
            json = { "prettierd" },
            jsonc = { "prettierd" },
        }

        opts.formatters       = {
            -- Tell conform how to talk to the 'statix' command you installed via NixOS
            statix = {
                command = "statix",
                args = { "fix", "--stdin" },
                stdin = true,
            },
            nixpkgs_fmt = {
                command = "nixpkgs-fmt",
            },
            prettierd = {
                command = "prettierd",
                args = { "$FILENAME" },
                stdin = true,
            },
        }

        opts.format_on_save   = {
            lsp_fallback = true,
            timeout_ms = 500,
        }
    end,
}
