local is_nixos = vim.fn.executable("nixos-rebuild") == 1

return {
    "stevearc/conform.nvim",
    opts = function(_, opts)
        opts.formatters_by_ft = opts.formatters_by_ft or {}
        opts.formatters_by_ft = {
            -- Map the filetype to the executable name
            nix = { "statix", "nixpkgs_fmt" },
        }
        if is_nixos then
            opts.formatters = {
                -- Tell conform how to talk to the 'statix' command you installed via NixOS
                statix = {
                    command = "statix",
                    args = { "fix", "--stdin" },
                    stdin = true,
                },
                nixpkgs_fmt = {
                    command = "nixpkgs-fmt",
                },
            }
        end

        opts.format_on_save = {
            lsp_fallback = true,
            timeout_ms = 500,
        }
    end,
}
