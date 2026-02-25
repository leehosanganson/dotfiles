#!/usr/bin/env bash
side="$1"

bar="▁▂▃▄▅▆▇█"
dict="s/;//g;"

# creating "dictionary" to replace char with bar
i=0
while [ $i -lt ${#bar} ]; do
    dict="${dict}s/$i/${bar:$i:1}/g;"
    i=$((i=i+1))
done

config_file="$HOME/.config/waybar/cava-config"

cava -p "$config_file" | while read -r line; do
    if ["$side" = "right"]; then
        echo $line | sed $dict
    else
        echo $line | sed $dict
    fi
done
