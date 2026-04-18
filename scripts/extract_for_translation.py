#!/usr/bin/env python3
"""Extract text and title per point_number from tvk.json into a flat file for translation.

Usage:
    python extract_for_translation.py [--input path/to/tvk.json] [--output path/to/tvk_for_translation.json]

Output format:
    [
        {"point_number": 1, "text": "...", "title": "..."},
        ...
    ]

Translate the `text` and `title` fields in place (keep `point_number` unchanged),
save it as `tvk_translated.json` (or any name), then run `apply_translation.py`.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

DEFAULT_INPUT = Path(__file__).resolve().parent.parent / "data" / "tvk.json"
DEFAULT_OUTPUT = Path(__file__).resolve().parent.parent / "data" / "tvk_for_translation.json"


def extract(input_path: Path, output_path: Path) -> None:
    with input_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    points = data.get("points", [])
    flat = [
        {
            "point_number": p["point_number"],
            "text": p.get("text", ""),
            "title": p.get("title", ""),
        }
        for p in points
    ]

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(flat, f, ensure_ascii=False, indent=2)

    print(f"Extracted {len(flat)} points -> {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT, help=f"Source JSON (default: {DEFAULT_INPUT})")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help=f"Flat JSON for translation (default: {DEFAULT_OUTPUT})")
    args = parser.parse_args()
    extract(args.input, args.output)


if __name__ == "__main__":
    main()
