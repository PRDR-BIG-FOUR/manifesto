"""Semantic search over Pipeline 1 embeddings.

Given a natural-language query, embeds it with the same model used for the
corpus (``Qwen/Qwen3-Embedding-0.6B``) and prints the top-N most similar
manifesto points by cosine similarity.

Example:
    python scripts/semantic_search.py --query "free bus travel for women" --top-n 5
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np

PROJECT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = PROJECT_DIR / "data"


def load_corpus() -> tuple[np.ndarray, dict, list[dict]]:
    emb = np.load(DATA_DIR / "embeddings.npy")
    with (DATA_DIR / "embeddings_meta.json").open() as f:
        meta = json.load(f)
    with (DATA_DIR / "single_repo_manifesto.json").open() as f:
        corpus = json.load(f)
    points = sorted(corpus["points"], key=lambda p: p["uuid"])
    return emb, meta, points


def embed_query(
    query: str,
    model: str,
    dtype: str,
    max_model_len: int,
    gpu_memory_utilization: float,
) -> np.ndarray:
    from vllm import LLM

    llm = LLM(
        model=model,
        runner="pooling",
        dtype=dtype,
        max_model_len=max_model_len,
        gpu_memory_utilization=gpu_memory_utilization,
        tensor_parallel_size=1,
        trust_remote_code=True,
    )
    outputs = llm.embed([query])
    vec = np.asarray(outputs[0].outputs.embedding, dtype=np.float32)
    norm = np.linalg.norm(vec)
    if norm < 1e-12:
        raise RuntimeError("query embedding has ~zero norm")
    return vec / norm


def search(
    query_vec: np.ndarray,
    emb: np.ndarray,
    points: list[dict],
    top_n: int,
    party: str | None = None,
) -> list[tuple[int, float, dict]]:
    sims = emb @ query_vec

    if party is not None:
        mask = np.array([p["party"] == party for p in points], dtype=bool)
        sims = np.where(mask, sims, -np.inf)

    top_n = min(top_n, emb.shape[0])
    idx = np.argpartition(-sims, top_n - 1)[:top_n]
    idx = idx[np.argsort(-sims[idx])]
    return [(int(i), float(sims[i]), points[i]) for i in idx]


def print_results(
    query: str,
    results: list[tuple[int, float, dict]],
    snippet_len: int,
    json_out: bool,
) -> None:
    if json_out:
        payload = {
            "query": query,
            "results": [
                {
                    "uuid": uid,
                    "score": score,
                    "party": p["party"],
                    "point_number": p.get("point_number"),
                    "section_title": p.get("section_title"),
                    "subsection_title": p.get("subsection_title"),
                    "title": p.get("title"),
                    "text": p["text"],
                }
                for uid, score, p in results
            ],
        }
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return

    print(f"\n[query] {query}")
    print(f"[top-{len(results)}]")
    for rank, (uid, score, p) in enumerate(results, start=1):
        text = p["text"].replace("\n", " ")
        snippet = text[:snippet_len] + ("..." if len(text) > snippet_len else "")
        section = p.get("section_title") or ""
        print(
            f"  {rank:>2}. uuid={uid:<4} sim={score:+.4f} "
            f"party={p['party']:<6} pt={p.get('point_number')} "
            f"[{section}]"
        )
        print(f"      {snippet}")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--query", "-q", type=str, required=True, help="search query")
    p.add_argument("--top-n", "-n", type=int, default=5, help="number of results")
    p.add_argument(
        "--party",
        type=str,
        default=None,
        choices=[None, "aiadmk", "dmk", "tvk_en"],
        help="optional party filter",
    )
    p.add_argument("--snippet-len", type=int, default=200)
    p.add_argument("--json", action="store_true", help="emit JSON instead of text")
    p.add_argument("--dtype", type=str, default="bfloat16")
    p.add_argument("--max-model-len", type=int, default=8192)
    p.add_argument("--gpu-memory-utilization", type=float, default=0.4)
    return p.parse_args()


def main() -> None:
    args = parse_args()

    emb, meta, points = load_corpus()
    model = meta.get("model", "Qwen/Qwen3-Embedding-0.6B")

    if not args.json:
        print(f"[semantic_search] model={model} corpus_n={emb.shape[0]} dim={emb.shape[1]}", file=sys.stderr)

    qvec = embed_query(
        query=args.query,
        model=model,
        dtype=args.dtype,
        max_model_len=args.max_model_len,
        gpu_memory_utilization=args.gpu_memory_utilization,
    )
    results = search(qvec, emb, points, top_n=args.top_n, party=args.party)
    print_results(args.query, results, snippet_len=args.snippet_len, json_out=args.json)


if __name__ == "__main__":
    main()
