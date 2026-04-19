-- Minimal loading engine for vim.pack
local M = {}

local loaded = {}
local packadded = {}

local function packadd(name)
  if not packadded[name] then
    packadded[name] = true
    local ok, err = pcall(vim.cmd.packadd, name)
    if not ok then vim.notify("[pack] packadd " .. name .. ": " .. tostring(err), vim.log.levels.ERROR) end
  end
end

local function load_entry(entry)
  if entry.packadd then
    for _, name in ipairs(entry.packadd) do
      packadd(name)
    end
  end

  -- Deduplicate by mod name (shared across entries) or entry reference (unique)
  local key = entry.mod or entry
  if not loaded[key] then
    loaded[key] = true
    if entry.config then
      local ok, err = pcall(entry.config)
      if not ok then vim.notify("[pack] " .. tostring(err), vim.log.levels.ERROR) end
    elseif entry.mod then
      local ok, mod = pcall(require, "plugins." .. entry.mod)
      if not ok then
        vim.notify("[pack] " .. entry.mod .. ": " .. tostring(mod), vim.log.levels.ERROR)
      else
        local fn = type(mod) == "function" and mod or mod.setup
        if type(fn) == "function" then
          local fn_ok, err = pcall(fn)
          if not fn_ok then vim.notify("[pack] " .. entry.mod .. ": " .. tostring(err), vim.log.levels.ERROR) end
        end
      end
    end
  end

  -- Set permanent keymaps from keys with cmd
  if entry.keys then
    for _, k in ipairs(entry.keys) do
      if k.cmd then vim.keymap.set(k.mode or "n", k[1], k.cmd, { desc = k.desc, silent = true }) end
    end
  end
end

function M.setup(registry)
  for i, entry in ipairs(registry) do
    if entry.event then
      local events = type(entry.event) == "table" and entry.event or { entry.event }
      vim.api.nvim_create_autocmd(events, {
        group = vim.api.nvim_create_augroup("pack-" .. i, { clear = true }),
        pattern = entry.pattern,
        once = entry.once ~= false,
        callback = function() load_entry(entry) end,
      })
    elseif entry.keys then
      for _, k in ipairs(entry.keys) do
        local key = k[1]
        local mode = k.mode or "n"
        vim.keymap.set(mode, key, function()
          pcall(vim.keymap.del, mode, key)
          load_entry(entry)
          vim.schedule(function()
            local codes = vim.api.nvim_replace_termcodes(key, true, false, true)
            vim.api.nvim_feedkeys(codes, "mit", false)
          end)
        end, { desc = k.desc, nowait = true })
      end
    elseif entry.defer then
      vim.defer_fn(function() load_entry(entry) end, entry.defer)
    else
      load_entry(entry)
    end
  end
end

return M
