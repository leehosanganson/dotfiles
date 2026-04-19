-- Declarative plugin loading engine for vim.pack
-- Manages :packadd so that vim.pack.add can use load = no-op to skip runtimepath.

local M = {}

local loaded = {}
local packadded = {}

local function packadd(name)
  if not packadded[name] then
    packadded[name] = true
    vim.cmd.packadd(name)
  end
end

local function load_entry(entry)
  local load_key = entry.fn and (entry.mod .. "." .. entry.fn) or entry.mod
  if loaded[load_key] then return end
  loaded[load_key] = true

  if entry.packadd then
    for _, name in ipairs(entry.packadd) do
      packadd(name)
    end
  end

  local ok, mod = pcall(require, "plugins." .. entry.mod)
  if not ok then
    vim.notify("[pack] " .. entry.mod .. ": " .. tostring(mod), vim.log.levels.ERROR)
    return
  end

  if entry.fn then
    if type(mod[entry.fn]) == "function" then
      local fn_ok, err = pcall(mod[entry.fn])
      if not fn_ok then vim.notify("[pack] " .. entry.mod .. "." .. entry.fn .. "(): " .. tostring(err), vim.log.levels.ERROR) end
    else
      vim.notify("[pack] " .. entry.mod .. " has no function " .. entry.fn, vim.log.levels.ERROR)
    end
  elseif type(mod.setup) == "function" then
    local fn_ok, err = pcall(mod.setup)
    if not fn_ok then vim.notify("[pack] " .. entry.mod .. ".setup(): " .. tostring(err), vim.log.levels.ERROR) end
  end
end

function M.setup(registry)
  for _, entry in ipairs(registry) do
    if entry.event then
      local events = type(entry.event) == "table" and entry.event or { entry.event }
      local group_name = "pack-" .. entry.mod .. (entry.fn and ("-" .. entry.fn) or "")
      local group = vim.api.nvim_create_augroup(group_name, { clear = true })
      vim.api.nvim_create_autocmd(events, {
        group = group,
        pattern = entry.pattern,
        once = entry.once ~= false,
        callback = function() load_entry(entry) end,
      })
    elseif entry.keys then
      for _, k in ipairs(entry.keys) do
        local key = k[1]
        local desc = k.desc or ("Load " .. entry.mod)
        local mode = k.mode or "n"
        vim.keymap.set(mode, key, function()
          pcall(vim.keymap.del, mode, key)
          load_entry(entry)
          vim.schedule(function()
            local keys = vim.api.nvim_replace_termcodes(key, true, false, true)
            vim.api.nvim_feedkeys(keys, "mit", false)
          end)
        end, { desc = desc, nowait = true })
      end
    elseif entry.defer then
      vim.defer_fn(function() load_entry(entry) end, entry.defer)
    else
      load_entry(entry)
    end
  end
end

return M
