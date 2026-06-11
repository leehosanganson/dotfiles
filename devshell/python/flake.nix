{
  description = "Python Dev Shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        python = pkgs.python314;
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # --- Build tools (build-essential from Dockerfile) ---
            gcc

            # BSD make on Darwin, GNU make on Linux
            (if pkgs.stdenv.isDarwin then pkgs.bmake else pkgs.make)

            autoconf
            automake
            libtool
            pkg-config

            # --- Package manager (replaces pip in Dockerfile) ---
            uv

            # --- Python dev dependencies from pyproject.toml ---
            # [dependency-groups] test:
            python.pkgs.pytest
            python.pkgs.pytest-cov
            python.pkgs.pytest-asyncio
            python.pkgs.pytest-socket
            python.pkgs.pytest-xdist
            python.pkgs.pytest-mock

            # [dependency-groups] lint:
            python.pkgs.ruff

            # [dependency-groups] typing:
            python.pkgs.mypy
          ];

          shellHook = ''
            echo "=== Python dev environment ==="
            echo "Python:  $(python --version)"
            echo "uv:      $(uv --version | cut -d' ' -f2)"
            echo "Git:     $(git --version)"
            echo ""
          '';
        };
      }
    );
}
