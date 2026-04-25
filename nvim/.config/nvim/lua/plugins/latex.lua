local function file_exists(path)
  return vim.uv.fs_stat(path) ~= nil
end

local function is_latex_project()
  local cwd = vim.uv.cwd()
  if not cwd then return false end

  local tex_files = vim.fn.glob(vim.fs.joinpath(cwd, "*.tex"), false, true)
  if #tex_files == 0 then return false end

  return file_exists(vim.fs.joinpath(cwd, "flake.nix"))
    or file_exists(vim.fs.joinpath(cwd, ".envrc"))
    or file_exists(vim.fs.joinpath(cwd, ".latexmkrc"))
    or file_exists(vim.fs.joinpath(cwd, "latexmkrc"))
end

return {
  {
    "lervag/vimtex",
    ft = { "tex", "plaintex", "bib" },
    cond = is_latex_project,
    init = function()
      vim.g.tex_flavor = "latex"
      vim.g.tex_conceal = "abdmg"
      vim.g.vimtex_compiler_method = "latexmk"
      vim.g.vimtex_compiler_latexmk = {
        continuous = 1,
        options = {
          "-pdf",
          "-interaction=nonstopmode",
          "-synctex=1",
          "-file-line-error",
        },
      }
      vim.g.vimtex_view_method = "zathura"
      vim.g.vimtex_quickfix_mode = 0

      vim.api.nvim_create_autocmd("FileType", {
        pattern = { "tex", "plaintex", "bib" },
        callback = function()
          vim.opt_local.conceallevel = 2
          vim.opt_local.concealcursor = "nc"
        end,
      })
    end,
  },
}
