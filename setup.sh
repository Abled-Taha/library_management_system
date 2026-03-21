#!/bin/sh

get_linux_distro() {
    # Check if the standard /etc/os-release file exists and source it
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        # The 'ID' variable contains a single-word identifier (e.g., ubuntu, fedora, centos)
        echo "$ID"
    else
        # Fallback for older or non-standard systems (e.g., using lsb_release if available)
        if command -v lsb_release &> /dev/null; then
            lsb_release -si | tr '[:upper:]' '[:lower:]'
        else
            echo "unknown"
        fi
    fi
}

DISTRO=$(get_linux_distro)

case "$DISTRO" in
    nixos)
        echo "Running on NixOS"
        # Add Ubuntu-specific commands here
        nix develop
        ;;
esac

# Function to check if a command is available
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check is mise is available
if command_exists mise; then
  echo "mise is available. Proceeding..."
  mise install
  mise run setup
  echo "All setup done. You can run the development server with 'mise run dev'"
  # Your script logic here
else
  echo "Error: mise not found." >&2
  exit 1
fi
