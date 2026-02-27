#!/usr/bin/env bash

WS=3

# Switch to WS3 on monitor 3 (DP-3)
hyprctl dispatch workspace "$WS"

sleep 0.5

# TOP: Pear Desktop (replace with actual command)
hyprctl dispatch exec "[workspace $WS silent] pear-desktop"

# MIDDLE: btop in ghostty
hyprctl dispatch exec "[workspace $WS silent] ghostty -e btop"

# MIDDLE: Chrome
hyprctl dispatch exec "[workspace $WS silent] google-chrome-stable --user-data-dir='$HOME/.config/google-chrome/Profile 5'"

# BOTTOM: Discord
hyprctl dispatch exec "[workspace $WS silent] discord"

