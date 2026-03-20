#!/bin/sh

echo "If you are using NixOS, you must use 'nix develop' command first in this directory before running me."
mise install
mise run setup
echo "All setup done. You can run the development server with 'mise run dev'"
