---
name: nixos-ops
description: >-
  Operate NixOS hosts safely with nixos-rebuild, nix, and nixos-anywhere. Load this skill when the user asks to reconfigure, upgrade, install, rollback, or troubleshoot a NixOS system. Use it for day-to-day operations, not for initial install or disaster recovery.
---

## Overview

NixOS is declarative and atomic. Always validate changes before activation, keep previous generations available, and roll back if anything breaks. Use flakes and lock files for reproducible operations.

## Safety Rules

- Prefer `nixos-rebuild test` before `nixos-rebuild switch` so you can boot the previous generation if the new one fails.
- Run `nix flake check` (if using flakes) or `nixos-rebuild build` before switching.
- Never garbage-collect old generations (`nix-collect-garbage -d`) until you have confirmed the new configuration works.
- Never run destructive commands like disk formatting or `nixos-install` over an existing system without explicit user confirmation.
- For remote installs, use `nixos-anywhere` and confirm the target host and expected data destruction.

## Common Workflows

### Edit the configuration

1. Locate the relevant file (`configuration.nix`, `flake.nix`, or a host module).
2. Make the smallest change that achieves the goal.
3. Validate: `nix flake check` or `nixos-rebuild build --flake .#<host>`.
4. Test: `nixos-rebuild test --flake .#<host>`.
5. Switch: `nixos-rebuild switch --flake .#<host>`.
6. Verify the service or setting works.

### Roll back

- Reboot and select the previous generation in the bootloader.
- Or run `nixos-rebuild switch --rollback`.

### Garbage collection

Only after confirming the current generation is stable:

```bash
nix-collect-garbage -d
```

### Remote install

Use `nixos-anywhere` for installing NixOS on a remote host from a flake:

```bash
nixos-anywhere --flake .#<host> root@<target>
```

Confirm the target host and that any data destruction is expected.

### Inspect state

```bash
nixos-rebuild list-generations
nix profile history
nixos-option <option.name>
systemctl status <service>
```

## Best Practices

- Keep `hardware-configuration.nix` generated; do not hand-edit it.
- Commit changes before rebuilding so you can revert the config or lock file.
- Pin inputs in `flake.lock` and update deliberately.
- Use `nixos-enter` to chroot into an installed NixOS system for rescue.

## Escalation

Ask the user before:

- Reformatting disks or running `nixos-install`.
- Changing bootloader, kernel, or networking settings that could lock you out.
- Garbage-collecting all generations.
- Any action that could cause downtime.

When in doubt, describe the planned command and its impact, then wait for approval.
