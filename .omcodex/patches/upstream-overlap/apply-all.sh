#!/usr/bin/env bash
set -euo pipefail

# Run this inside upstream repository root.
for patch in ./*.patch; do
  [ -f "$patch" ] || continue
  git apply "$patch"
done
echo "Applied all patches."
