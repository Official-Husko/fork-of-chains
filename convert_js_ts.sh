#!/bin/bash

# ------------------------------------------------------------------------------
# Script: convert_js_ts.sh
# Purpose: Convert all .js files in a selected folder to .ts, add @ts-nocheck, and fix imports
# ------------------------------------------------------------------------------

read -rp "Enter the relative path to the folder to convert (e.g. src/scripts/classes): " target_dir

if [[ -z "$target_dir" || ! -d "$target_dir" ]]; then
    echo "Invalid or empty folder. Exiting."
    exit 1
fi

converted=0
skipped=0
failed=0

while read -r jsfile; do
    tsfile="${jsfile%.js}.ts"
    if [[ -e "$tsfile" ]]; then
        echo "Skipping $jsfile (target $tsfile already exists)"
        ((skipped++))
        continue
    fi

    # Add new lines and // @ts-nocheck at the top, then fix imports, then write to .ts
    if {
        echo -e "// @ts-nocheck\n"
        cat "$jsfile"
    } | sed -E "s|^[[:space:]]*import[[:space:]]*\{[[:space:]]*\}[[:space:]]*from[[:space:]]*(['\"])([^'\"]+)\1[[:space:]]*;?[[:space:]]*$|import \1\2\1;|g" > "$tsfile"; then
        echo "Converted $jsfile -> $tsfile"
        rm "$jsfile"
        ((converted++))
    else
        echo "Failed to convert $jsfile"
        ((failed++))
    fi

done < <(find "$target_dir" -type f -name "*.js")

echo "Conversion complete. $converted files converted, $skipped files skipped, $failed files failed."