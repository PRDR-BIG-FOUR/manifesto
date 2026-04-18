"""Embed single_repo_manifesto.json texts with vLLM.

Loads the merged corpus, iterates points in ``uuid`` order (row i of the output
matrix corresponds to ``uuid == i``), runs them through a pooling-mode vLLM
engine, L2-normalizes the resulting vectors, and persists:

- ``embeddings.npy`` : float32 matrix of shape ``(N, dim)``
- ``embeddings_meta.json`` : model id, dim, normalized flag, uuid order, timestamp

Default model is ``Qwen/Qwen3-Embedding-0.6B`` which runs as a pooling model in
vLLM >= 0.14.
"""

from __future__ import annotations

import argparse
import datetime as _dt
import json
from pathlib import Path
from typing import Any

import numpy as np

from .config import (
    DEFAULT_BATCH_SIZE,
    DEFAULT_DTYPE,
    DEFAULT_GPU_MEM_UTIL,
    DEFAULT_MAX_MODEL_LEN,
    DEFAULT_MODEL,
    EMBEDDINGS_META_PATH,
    EMBEDDINGS_PATH,
    SINGLE_REPO_PATH,
)


def _load_corpus(path: Path) -> list[dict[str, Any]]:
    with path.open("r", encoding="utf-8") as f:
        doc = json.load(f)
    points = doc.get("points", [])
    points = sorted(points, key=lambda p: p["uuid"])
    for i, p in enumerate(points):
        if p["uuid"] != i:
            raise ValueError(
                f"Non-contiguous uuid ordering: expected {i}, got {p['uuid']}"
            )
    return points


def _l2_normalize(x: np.ndarray) -> np.ndarray:
    norms = np.linalg.norm(x, axis=1, keepdims=True)
    norms = np.clip(norms, a_min=1e-12, a_max=None)
    return (x / norms).astype(np.float32, copy=False)


def _build_llm(
    model: str,
    dtype: str,
    max_model_len: int,
    gpu_memory_utilization: float,
    tensor_parallel_size: int,
):
    from vllm import LLM

    return LLM(
        model=model,
        runner="pooling",
        dtype=dtype,
        max_model_len=max_model_len,
        gpu_memory_utilization=gpu_memory_utilization,
        tensor_parallel_size=tensor_parallel_size,
        trust_remote_code=True,
    )


def embed_corpus(
    input_path: Path,
    out_dir: Path,
    model: str = DEFAULT_MODEL,
    dtype: str = DEFAULT_DTYPE,
    max_model_len: int = DEFAULT_MAX_MODEL_LEN,
    batch_size: int = DEFAULT_BATCH_SIZE,
    gpu_memory_utilization: float = DEFAULT_GPU_MEM_UTIL,
    tensor_parallel_size: int = 1,
) -> tuple[Path, Path]:
    points = _load_corpus(input_path)
    texts = [p["text"] for p in points]
    n = len(texts)
    print(f"[pipeline_1] loaded {n} texts from {input_path}")

    llm = _build_llm(
        model=model,
        dtype=dtype,
        max_model_len=max_model_len,
        gpu_memory_utilization=gpu_memory_utilization,
        tensor_parallel_size=tensor_parallel_size,
    )

    all_vecs: list[np.ndarray] = []
    for start in range(0, n, batch_size):
        batch = texts[start : start + batch_size]
        outputs = llm.embed(batch)
        vecs = np.asarray(
            [o.outputs.embedding for o in outputs],
            dtype=np.float32,
        )
        all_vecs.append(vecs)
        print(
            f"[pipeline_1] embedded {min(start + batch_size, n)}/{n} "
            f"(batch shape={vecs.shape})"
        )

    embeddings = np.concatenate(all_vecs, axis=0)
    if embeddings.shape[0] != n:
        raise RuntimeError(
            f"Embedding count mismatch: got {embeddings.shape[0]}, expected {n}"
        )

    embeddings = _l2_normalize(embeddings)

    out_dir.mkdir(parents=True, exist_ok=True)
    emb_path = out_dir / EMBEDDINGS_PATH.name
    meta_path = out_dir / EMBEDDINGS_META_PATH.name

    np.save(emb_path, embeddings)

    meta = {
        "model": model,
        "dim": int(embeddings.shape[1]),
        "count": int(embeddings.shape[0]),
        "dtype": str(embeddings.dtype),
        "normalized": True,
        "normalization": "l2",
        "source": str(input_path),
        "uuid_order": list(range(n)),
        "created_at": _dt.datetime.utcnow().isoformat(timespec="seconds") + "Z",
        "vllm": {
            "runner": "pooling",
            "dtype": dtype,
            "max_model_len": max_model_len,
            "gpu_memory_utilization": gpu_memory_utilization,
            "tensor_parallel_size": tensor_parallel_size,
            "batch_size": batch_size,
        },
    }
    with meta_path.open("w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)

    print(f"[pipeline_1] wrote {emb_path} shape={embeddings.shape}")
    print(f"[pipeline_1] wrote {meta_path}")
    return emb_path, meta_path


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=SINGLE_REPO_PATH)
    parser.add_argument("--out-dir", type=Path, default=SINGLE_REPO_PATH.parent)
    parser.add_argument("--model", type=str, default=DEFAULT_MODEL)
    parser.add_argument("--dtype", type=str, default=DEFAULT_DTYPE)
    parser.add_argument("--max-model-len", type=int, default=DEFAULT_MAX_MODEL_LEN)
    parser.add_argument("--batch-size", type=int, default=DEFAULT_BATCH_SIZE)
    parser.add_argument(
        "--gpu-memory-utilization", type=float, default=DEFAULT_GPU_MEM_UTIL
    )
    parser.add_argument("--tensor-parallel-size", type=int, default=1)
    return parser.parse_args()


def main() -> None:
    args = _parse_args()
    embed_corpus(
        input_path=args.input,
        out_dir=args.out_dir,
        model=args.model,
        dtype=args.dtype,
        max_model_len=args.max_model_len,
        batch_size=args.batch_size,
        gpu_memory_utilization=args.gpu_memory_utilization,
        tensor_parallel_size=args.tensor_parallel_size,
    )


if __name__ == "__main__":
    main()
