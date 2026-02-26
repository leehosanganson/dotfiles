#! /usr/bin/env bash

bar="▁▂▃▄▅▆▇█"
dict="s/;//g;"

i=0
while [ $i -lt ${#bar} ]
do
    dict="${dict}s/$i/${bar:$i:1}/g;"
    i=$((i=i+1))
done

CONFIG_FILE=$HOME/.config/waybar/cava-config

cava -p "$CONFIG_FILE" | while read -r line; do
    echo $line | sed $dict
done
