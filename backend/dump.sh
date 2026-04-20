#!/bin/bash

OUTPUT="dump.txt"
echo "" > "$OUTPUT"

IGNORE_DIRS=(
  "node_modules"
  "dist"
  "build"
  ".git"
  ".next"
  "coverage"
  ".cache"
  "generated"
)

IGNORE_FILES=(
  "package-lock.json"
  "pnpm-lock.yaml"
  "yarn.lock"
  ".env"
)

INCLUDE_EXTENSIONS=(
  "ts"
  "js"
  "json"
  "prisma"
  "env"
  "md"
)

should_ignore_dir() {
  local dir="$1"
  for ignore in "${IGNORE_DIRS[@]}"; do
    if [[ "$dir" == *"/$ignore"* ]] || [[ "$dir" == "$ignore"* ]]; then
      return 0
    fi
  done
  return 1
}

should_ignore_file() {
  local file="$1"
  for ignore in "${IGNORE_FILES[@]}"; do
    if [[ "$(basename "$file")" == "$ignore" ]]; then
      return 0
    fi
  done
  return 1
}

is_valid_file() {
  local file="$1"
  for ext in "${INCLUDE_EXTENSIONS[@]}"; do
    if [[ "$file" == *".$ext" ]]; then
      return 0
    fi
  done
  return 1
}

echo "Generando dump del backend..." >&2

find . -type d | sort | while read dir; do

  if should_ignore_dir "$dir"; then
    continue
  fi

  if [ -f "$dir/.gitkeep" ]; then
    clean_dir="${dir#./}"

    echo "===============================" >> "$OUTPUT"
    echo "$clean_dir/" >> "$OUTPUT"
    echo "-------------------------------" >> "$OUTPUT"
    echo "[empty directory]" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
  fi

done

find . -type f | sort | while read file; do

  if should_ignore_dir "$file"; then
    continue
  fi

  if should_ignore_file "$file"; then
    continue
  fi

  if [[ "$(basename "$file")" == ".gitkeep" ]]; then
    continue
  fi

  if ! is_valid_file "$file"; then
    continue
  fi

  if [ $(wc -c < "$file") -gt 100000 ]; then
    continue
  fi

  clean_path="${file#./}"
  content=$(cat "$file")

  echo "===============================" >> "$OUTPUT"
  echo "$clean_path" >> "$OUTPUT"
  echo "-------------------------------" >> "$OUTPUT"
  echo "$content" >> "$OUTPUT"
  echo "" >> "$OUTPUT"

done

echo "Dump generado en $OUTPUT"