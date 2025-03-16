{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs
  ];

  shellHook = ''
    echo "🚀 Nix shell environment for your Electron + Vite + React project is ready!"
    export NODE_ENV=development
  '';
}

