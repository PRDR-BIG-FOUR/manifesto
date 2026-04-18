#!/usr/bin/env python3
"""Apply translated text/title back into tvk.json and save as tvk_en.json.

Reads the original `tvk.json` and a translated flat file (same shape as produced by
`extract_for_translation.py`), matches entries by `point_number`, and overwrites the
`text` and `title` fields. It also updates the `point` entry in
`hierarchy_down_to_top` so it stays consistent with the translated `title`.

Usage:
    python apply_translation.py \
        [--input path/to/tvk.json] \
        [--translated path/to/tvk_translated.json] \
        [--output path/to/tvk_en.json]
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent / "data"
DEFAULT_INPUT = BASE_DIR / "tvk.json"
DEFAULT_TRANSLATED = BASE_DIR / "tvk_translated.json"
DEFAULT_OUTPUT = BASE_DIR / "tvk_en.json"


def apply(input_path: Path, translated_path: Path, output_path: Path) -> None:
    with input_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    with translated_path.open("r", encoding="utf-8") as f:
        translated = json.load(f)

    translations = {entry["point_number"]: entry for entry in translated}

    updated = 0
    missing: list[int] = []
    for point in data.get("points", []):
        pn = point.get("point_number")
        t = translations.get(pn)
        if not t:
            missing.append(pn)
            continue

        if "text" in t:
            point["text"] = t["text"]
        if "title" in t:
            point["title"] = t["title"]
            for item in point.get("hierarchy_down_to_top", []):
                if item.get("level") == "point":
                    item["label"] = t["title"]
        updated += 1

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"Updated {updated} points -> {output_path}")
    if missing:
        print(f"Warning: no translation found for point_numbers: {missing}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT, help=f"Source JSON (default: {DEFAULT_INPUT})")
    parser.add_argument("--translated", type=Path, default=DEFAULT_TRANSLATED, help=f"Translated flat JSON (default: {DEFAULT_TRANSLATED})")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help=f"Output JSON (default: {DEFAULT_OUTPUT})")
    args = parser.parse_args()
    apply(args.input, args.translated, args.output)


if __name__ == "__main__":
    main()
