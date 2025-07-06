#!/bin/bash

# ------------------------------------------------------------------------------
# Script: convert_js_ts.sh
# Purpose: Convert all .js files in src to .ts, add @ts-nocheck, and fix imports
# ------------------------------------------------------------------------------

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

done < <(find src -type f -name "*.js")

echo "Conversion complete. $converted files converted, $skipped files skipped, $failed files failed."