"""Verify Pipeline 1 outputs and demonstrate lookup by uuid.

Loads:
  - data/embeddings.npy              (N, dim) float32, L2-normalized
  - data/embeddings_meta.json        model / dim / uuid_order / vllm args
  - data/single_repo_manifesto.json  points[] with uuid, party, text, ...

Checks:
  1. Count / dim / dtype match meta
  2. UUID order in meta matches points order in the corpus (row i <-> uuid i)
  3. Vectors are L2-normalized
  4. Self nearest-neighbor: argmax(E @ E[i]) == i for every i
  5. Prints a couple of example lookups + top-k nearest neighbors

Run:
    source .venv/bin/activate
    python scripts/verify_pipeline_1.py
    python scripts/verify_pipeline_1.py --uuid 42 --top-k 5
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np

PROJECT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = PROJECT_DIR / "data"


def load_outputs() -> tuple[np.ndarray, dict, dict]:
    emb = np.load(DATA_DIR / "embeddings.npy")
    with (DATA_DIR / "embeddings_meta.json").open() as f:
        meta = json.load(f)
    with (DATA_DIR / "single_repo_manifesto.json").open() as f:
        corpus = json.load(f)
    return emb, meta, corpus


def verify(emb: np.ndarray, meta: dict, corpus: dict) -> None:
    points = sorted(corpus["points"], key=lambda p: p["uuid"])
    n = len(points)

    assert emb.shape == (n, meta["dim"]), (
        f"embeddings shape {emb.shape} != (n={n}, dim={meta['dim']})"
    )
    assert emb.dtype == np.float32, f"expected float32, got {emb.dtype}"
    assert meta["count"] == n, f"meta count {meta['count']} != corpus n {n}"
    assert meta["uuid_order"] == list(range(n)), "uuid_order is not 0..n-1"

    for i, p in enumerate(points):
        assert p["uuid"] == i, f"point at index {i} has uuid {p['uuid']}"

    norms = np.linalg.norm(emb, axis=1)
    assert np.allclose(norms, 1.0, atol=1e-4), (
        f"vectors not L2-normalized (min={norms.min():.4f}, max={norms.max():.4f})"
    )

    sims = emb @ emb.T
    self_argmax = np.argmax(sims, axis=1)
    mismatches = np.where(self_argmax != np.arange(n))[0]
    assert mismatches.size == 0, (
        f"{mismatches.size} rows do not self-match as top-1 neighbor"
    )

    print("[verify] OK")
    print(f"  n points        : {n}")
    print(f"  dim             : {meta['dim']}")
    print(f"  dtype           : {emb.dtype}")
    print(f"  norm range      : [{norms.min():.6f}, {norms.max():.6f}]")
    print(f"  parties         : {corpus['parties']}")
    print(f"  model           : {meta['model']}")


def show_example(
    emb: np.ndarray,
    corpus: dict,
    uuid: int,
    top_k: int = 5,
) -> None:
    points = sorted(corpus["points"], key=lambda p: p["uuid"])
    n = len(points)
    if not (0 <= uuid < n):
        raise SystemExit(f"uuid {uuid} out of range [0, {n - 1}]")

    point = points[uuid]
    vec = emb[uuid]

    print()
    print(f"[lookup] uuid={uuid}")
    print(f"  party          : {point['party']}")
    print(f"  point_number   : {point.get('point_number')}")
    print(f"  section_title  : {point.get('section_title')}")
    text = point["text"].replace("\n", " ")
    print(f"  text[:160]     : {text[:160]}{'...' if len(text) > 160 else ''}")
    print(f"  embedding shape: {vec.shape}, dtype={vec.dtype}")
    print(f"  embedding[:8]  : {np.round(vec[:8], 4).tolist()}")

    sims = emb @ vec
    order = np.argsort(-sims)
    neighbors = [j for j in order.tolist() if j != uuid][:top_k]
    print(f"  top-{top_k} neighbors (cosine):")
    for j in neighbors:
        nb = points[j]
        nb_text = nb["text"].replace("\n", " ")
        print(
            f"    uuid={j:>4}  sim={sims[j]:+.4f}  "
            f"party={nb['party']:<6}  pt={nb.get('point_number')}  "
            f"{nb_text[:100]}{'...' if len(nb_text) > 100 else ''}"
        )


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--uuid", type=int, default=0, help="uuid to inspect (default: 0)")
    p.add_argument(
        "--extra-uuids",
        type=int,
        nargs="*",
        default=[100, 500],
        help="additional uuids to demo after --uuid",
    )
    p.add_argument("--top-k", type=int, default=5, help="top-k neighbors to show")
    p.add_argument(
        "--skip-checks", action="store_true", help="skip verification, only show lookup"
    )
    return p.parse_args()


def main() -> None:
    args = parse_args()
    emb, meta, corpus = load_outputs()

    if not args.skip_checks:
        verify(emb, meta, corpus)

    n = len(corpus["points"])
    show_example(emb, corpus, uuid=args.uuid, top_k=args.top_k)
    for uid in args.extra_uuids:
        if 0 <= uid < n and uid != args.uuid:
            show_example(emb, corpus, uuid=uid, top_k=args.top_k)


if __name__ == "__main__":
    main()
