#!/bin/bash

# ------------------------------------------------------------------------------
# Script: rmd.sh
# Purpose: Remove duplicate JavaScript files when a TypeScript file exists
#
# Description:
#   This script scans the 'src' directory and its subdirectories for files with
#   the extensions '.js' and '.ts'. If both a '.js' and a '.ts' file exist with
#   the same base filename (e.g., 'foo.js' and 'foo.ts'), the '.js' file is
#   deleted, leaving only the TypeScript version. If a '.js' file exists without
#   a corresponding '.ts' file, it is kept.
#
# Usage:
#   1. Make the script executable: chmod +x rmd.sh
#   2. Run the script from the project root: ./rmd.sh
#
# Safety:
#   - This script will permanently delete matching '.js' files. Review the output
#     before running, and consider using version control or backups.
# ------------------------------------------------------------------------------

deleted_count=0
js_count=0

# Build an associative array of .ts basenames
declare -A ts_basenames
while IFS= read -r -d '' tsfile; do
    base="${tsfile%.ts}"
    ts_basenames["$base"]=1
done < <(find src -type f -name "*.ts" -print0)

ts_count=${#ts_basenames[@]}

# For each .js file, check if a .ts file with the same base name exists
find src -type f -name "*.js" -print0 | while IFS= read -r -d '' jsfile; do
    base="${jsfile%.js}"
    ((js_count++))
    if [[ -n "${ts_basenames["$base"]}" ]]; then
        echo "Deleting $jsfile (TypeScript version exists)"
        rm -- "$jsfile"
        ((deleted_count++))
    fi
done

# Wait for background jobs to finish (if any)
wait

# Count total files in src
all_files=$(find src -type f | wc -l)

echo "Summary:"
echo "  Deleted JS files: $deleted_count"
echo "  TypeScript files: $ts_count"
echo "  Total files in src: $all_files"