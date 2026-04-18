"""Shared paths and model defaults for Pipeline 1."""

from __future__ import annotations

from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]

DATA_DIR = REPO_ROOT / "data"

PARTY_FILES: dict[str, Path] = {
    "aiadmk": DATA_DIR / "aiadmk.json",
    "dmk": DATA_DIR / "dmk.json",
    "tvk_en": DATA_DIR / "tvk_en.json",
}

SINGLE_REPO_PATH = DATA_DIR / "single_repo_manifesto.json"
EMBEDDINGS_PATH = DATA_DIR / "embeddings.npy"
EMBEDDINGS_META_PATH = DATA_DIR / "embeddings_meta.json"

DEFAULT_MODEL = "Qwen/Qwen3-Embedding-0.6B"
DEFAULT_DTYPE = "bfloat16"
DEFAULT_MAX_MODEL_LEN = 8192
DEFAULT_BATCH_SIZE = 256
DEFAULT_GPU_MEM_UTIL = 0.6
EMBEDDING_DIM = 1024
