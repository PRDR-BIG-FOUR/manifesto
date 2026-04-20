"""Shared paths and defaults for Pipeline 2."""

from __future__ import annotations

from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]

DATA_DIR = REPO_ROOT / "data"

PARTY_FILES: dict[str, Path] = {
    "aiadmk": DATA_DIR / "aiadmk.json",
    "dmk": DATA_DIR / "dmk.json",
    "tvk_en": DATA_DIR / "tvk_en_corr.json",
}

OUTPUT_DIR = DATA_DIR / "pipeline_2"

DEFAULT_MODEL = "gemini-3-flash-preview"
DEFAULT_BATCH_K = 4
DEFAULT_CONCURRENCY = 8
DEFAULT_MAX_RETRIES = 4
DEFAULT_INITIAL_BACKOFF = 2.0
DEFAULT_MAX_BACKOFF = 30.0

# Sentinels the model must use in its response. Kept as module-level constants
# so prompts.py and parser.py agree on the protocol.
SECTION_SEP = "<sep>"
ITEM_SEP = "<item_sep>"

# Per-point header sentinel: ``P1``, ``P2`` ... ``PK``.
ITEM_HEADER_PREFIX = "P"

API_KEY_ENV = "GEMINI_API_KEY"
