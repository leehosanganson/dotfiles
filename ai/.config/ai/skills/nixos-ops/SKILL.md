---
name: nixos-ops
description: >-
  Reconfigure, upgrade, install, roll back, or troubleshoot NixOS hosts using Nix
  and NixOS tools, including explicitly requested `nixos-anywhere` installs. Do
  not use for Kubernetes or Flux/GitOps operations, `nixos-install`, or disaster
  recovery.
---

## Operating rules

- Validate before activation: use `nix flake check` for flakes or `nixos-rebuild build` otherwise.
- Prefer `nixos-rebuild test` before switching so the previous generation remains available if the change fails.
- Keep prior generations until the new configuration is verified. Never run `nix-collect-garbage -d` before confirming stability.
- Do not format disks or run `nixos-install` over an existing system without explicit user confirmation.
- For remote installation, confirm the target host and expected data destruction before using `nixos-anywhere`.

## Edit and activate configuration

1. Locate the relevant `configuration.nix`, `flake.nix`, or host module.
2. Make the smallest change that meets the request.
3. Validate with `nix flake check` or `nixos-rebuild build --flake .#<host>`.
4. Test with `nixos-rebuild test --flake .#<host>`.
5. If the test succeeds and the user authorized activation, switch with `nixos-rebuild switch --flake .#<host>`.
6. Verify the affected service or setting.

## Inspect state

```bash
nixos-rebuild list-generations
nix profile history
nixos-option <option.name>
systemctl status <service>
```

## Roll back

Use `nixos-rebuild switch --rollback`, or reboot and select the previous generation in the bootloader. Confirm with the user before initiating a rollback that may disrupt active services.

## Remote install

For an explicitly requested remote install:

```bash
nixos-anywhere --flake .#<host> root@<target>
```

Confirm the host and expected data destruction first.

## Ask before

- Reformatting disks or running `nixos-install`.
- Changing bootloader, kernel, or networking settings that could lock out the host.
- Garbage-collecting generations.
- Taking any action that could cause downtime.

Keep `hardware-configuration.nix` generated rather than hand-editing it. Pin flake inputs in `flake.lock` and update them deliberately. Use `nixos-enter` to chroot into an installed system for rescue.
