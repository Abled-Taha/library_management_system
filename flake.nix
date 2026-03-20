{
  description = "Development environment for Nix Users";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            mise
            zlib
            openssl
            libffi
            readline
            ncurses
            pkg-config
            # Add system dependencies needed for node-gyp or native modules here
            # e.g., python3, pkg-config, libvips
          ];

          shellHook = ''
            echo "Nix shell loaded: mise is now available. Don't forget to run 'mise install'"
          '';
        };
      });
}