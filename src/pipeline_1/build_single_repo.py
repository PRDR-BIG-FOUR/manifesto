"""Merge per-party manifesto JSONs into a single corpus with numeric UUIDs.

Reads the per-party JSON files under ``manifesto/data/`` and emits
``single_repo_manifesto.json`` containing:

- ``parties``: list of party keys included
- ``total_points``: number of points with non-empty text
- ``points``: list of point records, each with a deterministic integer ``uuid``
- ``lookup``: ``{str(uuid): {"party": str, "point_number": int}}``

UUIDs are assigned by iterating parties in alphabetical order and points by
their original ``point_number`` ascending, so the mapping is reproducible.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from .config import PARTY_FILES, SINGLE_REPO_PATH


def _load_party_points(path: Path) -> list[dict[str, Any]]:
    with path.open("r", encoding="utf-8") as f:
        doc = json.load(f)
    points = doc.get("points", [])
    if not isinstance(points, list):
        raise ValueError(f"{path}: expected 'points' to be a list")
    return points


def _clean_text(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    stripped = value.strip()
    return stripped or None


def build_single_repo(
    party_files: dict[str, Path] | None = None,
    out_path: Path | None = None,
) -> dict[str, Any]:
    """Build and write the merged manifesto JSON. Returns the written dict."""

    party_files = party_files or PARTY_FILES
    out_path = out_path or SINGLE_REPO_PATH

    merged_points: list[dict[str, Any]] = []
    lookup: dict[str, dict[str, Any]] = {}
    uuid_counter = 0

    for party in sorted(party_files.keys()):
        path = party_files[party]
        if not path.exists():
            raise FileNotFoundError(f"Missing party file: {path}")

        raw_points = _load_party_points(path)
        raw_points = sorted(
            raw_points,
            key=lambda p: (p.get("point_number") is None, p.get("point_number", 0)),
        )

        for p in raw_points:
            text = _clean_text(p.get("text"))
            if text is None:
                continue

            record: dict[str, Any] = {
                "uuid": uuid_counter,
                "party": party,
                "point_number": p.get("point_number"),
                "section_number": p.get("section_number"),
                "section_title": p.get("section_title"),
                "subsection_title": p.get("subsection_title"),
                "title": p.get("title"),
                "text": text,
                "hierarchy_down_to_top": p.get("hierarchy_down_to_top", []),
            }
            merged_points.append(record)
            lookup[str(uuid_counter)] = {
                "party": party,
                "point_number": p.get("point_number"),
            }
            uuid_counter += 1

    doc = {
        "parties": sorted(party_files.keys()),
        "total_points": len(merged_points),
        "points": merged_points,
        "lookup": lookup,
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)

    return doc


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=None,
        help="Directory containing per-party JSONs (defaults to manifesto/data).",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=None,
        help="Output path for single_repo_manifesto.json.",
    )
    return parser.parse_args()


def main() -> None:
    args = _parse_args()

    if args.data_dir is not None:
        party_files = {name: args.data_dir / path.name for name, path in PARTY_FILES.items()}
    else:
        party_files = PARTY_FILES

    out_path = args.out or SINGLE_REPO_PATH

    doc = build_single_repo(party_files=party_files, out_path=out_path)
    print(
        f"Wrote {out_path} with {doc['total_points']} points "
        f"across parties: {', '.join(doc['parties'])}"
    )


if __name__ == "__main__":
    main()
