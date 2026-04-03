#!/usr/bin/env bash
set -euo pipefail

# Set up SSH key for GitHub
if [ -n "$DEV_SSH_KEY" ]; then
    mkdir -p ~/.ssh
    chmod 700 ~/.ssh
    echo "$DEV_SSH_KEY" | base64 -d > ~/.ssh/id_ed25519
    chmod 600 ~/.ssh/id_ed25519
    ssh-keyscan github.com >> ~/.ssh/known_hosts 2>/dev/null
fi

# Set up decryption key for SOPS
if [ -n "$SOPS_AGE_KEY" ]; then
    mkdir -p ~/.config/sops/age
    echo "$SOPS_AGE_KEY" > ~/.config/sops/age/keys.txt
    chmod 600 ~/.config/sops/age/keys.txt
fi

# Install nix & Run home-manager
if ! command -v nix &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install linux --no-confirm
    if [ -e /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh ]; then
    . /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
    fi
    if [ -e /nix/var/nix/profiles/default/etc/profile.d/nix.sh ]; then
        . /nix/var/nix/profiles/default/etc/profile.d/nix.sh
    fi
fi

nix run home-manager/master -- switch -b backup --flake 'github:leehosanganson/nix-config#vscode@devcontainer'
