"""Gradio UI for semantic search over Pipeline 1 embeddings.

Loads the corpus + vLLM embedding model once at startup, then serves a
browser UI where you can type a query, pick a top-N, and optionally filter
by party. Results are shown as a sortable table.

Launch:
    scripts/semantic_search.sh                    # defaults
    GRADIO_PORT=7862 scripts/semantic_search.sh   # custom port
"""

from __future__ import annotations

import argparse
import json
import os
from functools import lru_cache
from pathlib import Path

import gradio as gr
import numpy as np

PROJECT_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = PROJECT_DIR / "data"

PARTY_CHOICES = ["all", "aiadmk", "dmk", "tvk_en"]


def load_corpus() -> tuple[np.ndarray, dict, list[dict]]:
    emb = np.load(DATA_DIR / "embeddings.npy")
    with (DATA_DIR / "embeddings_meta.json").open() as f:
        meta = json.load(f)
    with (DATA_DIR / "single_repo_manifesto.json").open() as f:
        corpus = json.load(f)
    points = sorted(corpus["points"], key=lambda p: p["uuid"])
    return emb, meta, points


@lru_cache(maxsize=1)
def _build_llm(model: str, dtype: str, max_model_len: int, gpu_mem_util: float):
    from vllm import LLM

    return LLM(
        model=model,
        runner="pooling",
        dtype=dtype,
        max_model_len=max_model_len,
        gpu_memory_utilization=gpu_mem_util,
        tensor_parallel_size=1,
        trust_remote_code=True,
    )


def embed_query(llm, query: str) -> np.ndarray:
    outputs = llm.embed([query])
    vec = np.asarray(outputs[0].outputs.embedding, dtype=np.float32)
    norm = np.linalg.norm(vec)
    if norm < 1e-12:
        raise RuntimeError("query embedding has ~zero norm")
    return vec / norm


def run_search(
    llm,
    emb: np.ndarray,
    points: list[dict],
    query: str,
    top_n: int,
    party: str,
    snippet_len: int,
):
    query = (query or "").strip()
    if not query:
        return [], "enter a query"

    qvec = embed_query(llm, query)
    sims = emb @ qvec

    if party and party != "all":
        mask = np.array([p["party"] == party for p in points], dtype=bool)
        if not mask.any():
            return [], f"no points for party={party}"
        sims = np.where(mask, sims, -np.inf)

    top_n = int(max(1, min(top_n, emb.shape[0])))
    idx = np.argpartition(-sims, top_n - 1)[:top_n]
    idx = idx[np.argsort(-sims[idx])]

    rows = []
    for rank, i in enumerate(idx.tolist(), start=1):
        p = points[i]
        text = p["text"].replace("\n", " ")
        snippet = text if len(text) <= snippet_len else text[:snippet_len] + "..."
        rows.append(
            [
                rank,
                int(i),
                round(float(sims[i]), 4),
                p["party"],
                p.get("point_number"),
                p.get("section_title") or "",
                snippet,
            ]
        )
    info = f"query='{query}' | top_n={top_n} | party={party} | corpus_n={emb.shape[0]}"
    return rows, info


def build_ui(llm, emb, meta, points) -> gr.Blocks:
    model_name = meta.get("model", "Qwen/Qwen3-Embedding-0.6B")
    header_md = (
        f"# Manifesto semantic search\n"
        f"**model**: `{model_name}`  |  "
        f"**corpus**: {emb.shape[0]} points, dim={emb.shape[1]}  |  "
        f"**parties**: {', '.join(sorted({p['party'] for p in points}))}"
    )

    with gr.Blocks(title="Manifesto semantic search") as demo:
        gr.Markdown(header_md)

        with gr.Row():
            query = gr.Textbox(
                label="Query",
                placeholder="e.g. free bus travel for women",
                lines=2,
                autofocus=True,
                scale=4,
            )
            top_n = gr.Slider(
                minimum=1, maximum=50, step=1, value=5, label="Top N", scale=1
            )

        with gr.Row():
            party = gr.Radio(
                choices=PARTY_CHOICES, value="all", label="Party filter", scale=3
            )
            snippet_len = gr.Slider(
                minimum=80, maximum=600, step=20, value=240, label="Snippet length",
                scale=2,
            )
            search_btn = gr.Button("Search", variant="primary", scale=1)

        info = gr.Markdown()
        results = gr.Dataframe(
            headers=["rank", "uuid", "score", "party", "pt", "section", "text"],
            datatype=["number", "number", "number", "str", "number", "str", "str"],
            wrap=True,
            label="Results",
            interactive=False,
        )

        def _run(q, k, pt, sl):
            rows, msg = run_search(llm, emb, points, q, k, pt, int(sl))
            return rows, msg

        search_btn.click(_run, [query, top_n, party, snippet_len], [results, info])
        query.submit(_run, [query, top_n, party, snippet_len], [results, info])

        gr.Examples(
            examples=[
                ["free bus travel for women", 5, "all"],
                ["pension scheme for senior citizens", 5, "all"],
                ["fishermen welfare and coastal infrastructure", 10, "aiadmk"],
                ["school education reforms", 10, "dmk"],
                ["startup and youth employment", 5, "tvk_en"],
            ],
            inputs=[query, top_n, party],
        )

    return demo


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--host", default=os.environ.get("GRADIO_HOST", "0.0.0.0"))
    p.add_argument(
        "--port", type=int, default=int(os.environ.get("GRADIO_PORT", "7860"))
    )
    p.add_argument("--share", action="store_true", help="create a public share link")
    p.add_argument("--dtype", default="bfloat16")
    p.add_argument("--max-model-len", type=int, default=8192)
    p.add_argument("--gpu-memory-utilization", type=float, default=0.4)
    return p.parse_args()


def main() -> None:
    args = parse_args()

    emb, meta, points = load_corpus()
    model_name = meta.get("model", "Qwen/Qwen3-Embedding-0.6B")

    print(f"[semantic_search_app] loading vLLM model: {model_name}")
    llm = _build_llm(
        model=model_name,
        dtype=args.dtype,
        max_model_len=args.max_model_len,
        gpu_mem_util=args.gpu_memory_utilization,
    )
    print("[semantic_search_app] model ready; launching UI")

    demo = build_ui(llm, emb, meta, points)

    import socket

    def _free_port(start: int, tries: int = 20) -> int:
        for p in range(start, start + tries):
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                try:
                    s.bind((args.host if args.host != "0.0.0.0" else "", p))
                    return p
                except OSError:
                    continue
        raise RuntimeError(f"no free port in {start}..{start + tries - 1}")

    port = _free_port(args.port)
    if port != args.port:
        print(f"[semantic_search_app] port {args.port} busy, using {port}")

    demo.queue().launch(
        server_name=args.host,
        server_port=port,
        share=args.share,
        show_error=True,
    )


if __name__ == "__main__":
    main()
