<#
.SYNOPSIS
    Setup GlazeWM, Zebar, Claude Desktop, Claude Code, Obsidian and Neovim on
    Windows, then symlink the GlazeWM, Zebar & bash configs from this dotfiles repo.

.DESCRIPTION
    - Self-elevates with admin rights if needed.
    - Installs all six apps via winget (fallback: Chocolatey), skipping any
      already installed. Exits 1 if no installer is available or an install fails.
    - Symlinks only GlazeWM, Zebar & bash configs (Claude apps are install-only).
        $env:USERPROFILE\.glzr\glazewm     ->  <repo>\glazewm
        $env:USERPROFILE\.glzr\zebar       ->  <repo>\zebar
        $env:USERPROFILE\.bashrc           ->  <repo>\bash\.bashrc
        $env:USERPROFILE\.bash_profile     ->  <repo>\bash\.bash_profile

.EXAMPLE
    .\setup-windows.ps1
    .\setup-windows.ps1 -Dotfiles C:\Users\me\dotfiles
#>
[CmdletBinding()]
param(
    [string]$Dotfiles,
    [switch]$SkipSelfElevate
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Resolve repo root: explicit -Dotfiles > $env:DOTFILES > $PSScriptRoot.
$RepoRoot = if ($Dotfiles) { $Dotfiles } elseif ($env:DOTFILES) { $env:DOTFILES } else { $PSScriptRoot }
$RepoRoot = [System.IO.Path]::GetFullPath($RepoRoot)
if (-not (Test-Path -LiteralPath $RepoRoot -PathType Container)) {
    Write-Host "[ERROR] Dotfiles repo not found at '$RepoRoot'. Use -Dotfiles or set `$env:DOTFILES." -ForegroundColor Red
    exit 1
}
Write-Host "Using dotfiles repo: $RepoRoot" -ForegroundColor Cyan

# --- Elevation guard ---------------------------------------------------------
function Test-IsElevated {
    $p = New-Object Security.Principal.WindowsPrincipal(
        [Security.Principal.WindowsIdentity]::GetCurrent())
    return $p.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not $SkipSelfElevate -and -not (Test-IsElevated)) {
    Write-Host "Not elevated. Re-launching with admin rights..." -ForegroundColor Yellow
    $child = @('-SkipSelfElevate')
    if ($Dotfiles) { $child += '-Dotfiles', ('"{0}"' -f $Dotfiles) }
    try {
        $proc = Start-Process -FilePath 'powershell.exe' -ArgumentList (
            @('-ExecutionPolicy', 'Bypass', '-NoProfile',
              '-File', ('"{0}"' -f $PSCommandPath)) + $child
        ) -Verb RunAs -PassThru -Wait
        exit $(if ($null -ne $proc) { $proc.ExitCode } else { 1 })
    } catch {
        Write-Host "[ERROR] Failed to self-elevate: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "        Run the script as administrator instead." -ForegroundColor Yellow
        exit 1
    }
} elseif (-not (Test-IsElevated)) {
    Write-Host "[ERROR] This script must run as administrator." -ForegroundColor Red
    exit 1
}
Write-Host "Running with administrator privileges." -ForegroundColor Green

# --- Helpers ----------------------------------------------------------------
function Test-Command { param([string]$Name) [bool](Get-Command $Name -ErrorAction SilentlyContinue) }

# Install one app via the choco/winget commands, skipping if already installed.
function Invoke-Install {
    param([string]$Name, [string]$Find, [string]$Match, [string[]]$InstallCmd)
    $hit = Invoke-Expression $Find 2>$null
    if ($LASTEXITCODE -eq 0 -and ($hit | Select-String -Quiet $Match)) {
        Write-Host "  $Name already installed. Skipping." -ForegroundColor Green
        return
    }
    Write-Host "  Installing $Name..." -ForegroundColor Yellow
    & $InstallCmd[0] @($InstallCmd[1..($InstallCmd.Count - 1)])
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] $Name failed to install (exit $LASTEXITCODE)." -ForegroundColor Red
        exit 1
    }
    Write-Host "  $Name installed." -ForegroundColor Green
}

# Create a directory symlink at $Link -> $Target, backing up any existing path.
function New-Link {
    param([string]$Link, [string]$Target)
    if (Test-Path -LiteralPath $Link) {
        $item   = Get-Item -LiteralPath $Link -Force
        $target = if ($item.LinkType -eq 'SymbolicLink' -and $null -ne $item.Target) {
            $raw = if ($item.Target -is [IO.FileSystemInfo]) { $item.Target.FullName } else { [string]$item.Target }
            if ([string]::IsNullOrWhiteSpace($raw)) { $null } else { [IO.Path]::GetFullPath($raw).TrimEnd('\') }
        } else { $null }
        if ($target -and $target -ieq ([IO.Path]::GetFullPath($Target).TrimEnd('\'))) {
            Write-Host "  $Link already points at the repo config. Skipping." -ForegroundColor Green
            return
        }
    }
    try {
        New-Item -ItemType SymbolicLink -Path $Link -Target $Target -ErrorAction Stop | Out-Null
        Write-Host "  Created symlink '$Link'." -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] Failed to create symlink '$Link': $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "        Requires Developer Mode or an elevated shell." -ForegroundColor Yellow
        exit 1
    }
}

# --- 1. Install apps --------------------------------------------------------
Write-Host "`n==> Installing apps" -ForegroundColor Magenta

$apps = @(
    @{ Name = 'GlazeWM';        Winget = 'glzr-io.GlazeWM';        Choco = 'glazewm'       },
    @{ Name = 'Zebar';          Winget = 'glzr-io.Zebar';          Choco = 'zebar'         },
    @{ Name = 'Claude Desktop'; Winget = 'Anthropic.Claude';       Choco = 'claude' },
    @{ Name = 'Claude Code';    Winget = 'Anthropic.ClaudeCode';   Choco = 'claude-code'    },
    @{ Name = 'Obsidian';       Winget = 'Obsidian.Obsidian';      Choco = 'obsidian'       },
    @{ Name = 'Neovim';         Winget = 'Neovim.Neovim';          Choco = 'neovim'         }
)

if (Test-Command 'choco') {
    Write-Host "Using Chocolatey." -ForegroundColor Yellow
    foreach ($a in $apps) {
        Invoke-Install -Name $a.Name -Find "choco list --local-only $($a.Choco)" `
            -Match $a.Choco -InstallCmd @('choco', 'install', $a.Choco, '-y', '--no-progress')
    }
} elseif (Test-Command 'winget') {
    Write-Host "Using winget" -ForegroundColor Green
    foreach ($a in $apps) {
        Invoke-Install -Name $a.Name -Find "winget list --id $($a.Winget) --accept-source-agreements" `
            -Match $a.Winget -InstallCmd @('winget', 'install', '--id', $a.Winget,
            '--accept-source-agreements', '--accept-package-agreements', '--silent')
    }
} else {
    Write-Host "[ERROR] Neither winget nor Chocolatey is available." -ForegroundColor Red
    Write-Host "        Install winget (App Installer) or Chocolatey and re-run." -ForegroundColor Yellow
    exit 1
}

# --- 2. Symlink GlazeWM & Zebar configs -------------------------------------
Write-Host "`n==> Symlinking configs" -ForegroundColor Magenta

$glzrRoot   = Join-Path $env:USERPROFILE '.glzr'
$glazewmCfg = Join-Path $RepoRoot 'glazewm'
$zebarCfg   = Join-Path $RepoRoot 'zebar'

if (-not (Test-Path -LiteralPath $glzrRoot)) {
    Write-Host "Creating parent directory: $glzrRoot" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $glzrRoot -Force | Out-Null
}

foreach ($cfg in @(
    @{ Link = Join-Path $glzrRoot 'glazewm'; Repo = $glazewmCfg },
    @{ Link = Join-Path $glzrRoot 'zebar';    Repo = $zebarCfg   }
)) {
    if (-not (Test-Path -LiteralPath $cfg.Repo)) {
        Write-Host "[ERROR] Repo config dir not found: '$($cfg.Repo)'." -ForegroundColor Red
        exit 1
    }
    New-Link -Link $cfg.Link -Target $cfg.Repo
}

# --- 2b. Symlink bash configs (live directly in $env:USERPROFILE) -----------
$bashrcCfg      = Join-Path $RepoRoot 'bash\.bashrc'
$bashProfileCfg = Join-Path $RepoRoot 'bash\.bash_profile'

foreach ($cfg in @(
    @{ Link = Join-Path $env:USERPROFILE '.bashrc';       Repo = $bashrcCfg },
    @{ Link = Join-Path $env:USERPROFILE '.bash_profile'; Repo = $bashProfileCfg }
)) {
    if (-not (Test-Path -LiteralPath $cfg.Repo)) {
        Write-Host "[ERROR] Repo config file not found: '$($cfg.Repo)'." -ForegroundColor Red
        exit 1
    }
    New-Link -Link $cfg.Link -Target $cfg.Repo
}

# --- 3. Done ----------------------------------------------------------------
Write-Host "`nDone! Apps installed and GlazeWM/Zebar/bash configs symlinked." -ForegroundColor Green
Write-Host "Restart the apps (or the machine) to pick up the new config." -ForegroundColor Yellow
