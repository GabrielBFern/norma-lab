{
  description = "norma-lab dev environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs { inherit system overlays; };

        # Stable Rust with the wasm32 target bundled in
        rustToolchain = pkgs.rust-bin.stable.latest.default.override {
          targets = [ "wasm32-unknown-unknown" ];
        };
      in
      {
        devShells.default = pkgs.mkShell {
          name = "norma-lab";

          buildInputs = [
            # Rust
            rustToolchain
            pkgs.wasm-pack
            pkgs.cargo-watch

            pkgs.concurrently

            pkgs.wrangler

            # Node / JS
            pkgs.nodejs_20
            pkgs.yarn

            # C linker required by Rust on Linux
            pkgs.gcc
            pkgs.pkg-config
          ] ++ pkgs.lib.optionals pkgs.stdenv.isDarwin [
            # macOS extras
            pkgs.libiconv
            pkgs.darwin.apple_sdk.frameworks.SystemConfiguration
          ];

          # Put cargo and wasm-pack on PATH, and silence the
          # "not a tty" warning from cargo-watch in some terminals.
          shellHook = ''
            export PATH="$HOME/.cargo/bin:$PATH"
            echo ""
            echo "  norma-lab devshell ready"
            echo ""
            echo "  First-time setup:"
            echo "    cd packages/rust && wasm-pack build --target web && yarn && cd ../.."
            echo "    yarn"
            echo ""
            echo "  Start dev server:"
            echo "    yarn dev"
            echo ""
          '';
        };
      }
    );
}
