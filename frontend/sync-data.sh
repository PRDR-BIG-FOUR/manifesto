#!/bin/bash
# Run this after pipeline_2 produces new enriched JSON files.
# Copies them into src/data/ so the frontend picks them up automatically.
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SRC="$SCRIPT_DIR/../data/pipeline_2"
DEST="$SCRIPT_DIR/src/data"

cp "$SRC/aiadmk.enriched.json" "$DEST/"
cp "$SRC/dmk.enriched.json"    "$DEST/"
cp "$SRC/tvk_en.enriched.json" "$DEST/"
echo "✓ Synced enriched JSONs to frontend/src/data/"
