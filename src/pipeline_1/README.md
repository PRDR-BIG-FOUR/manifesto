# Pipeline 1 — Manifesto embedding

Builds a single corpus out of every party's manifesto JSON in
`manifesto/data/`, assigns each point a numeric `uuid`, and embeds the
`text` field with vLLM using `Qwen/Qwen3-Embedding-0.6B`.

## What it produces

- `data/single_repo_manifesto.json` — merged corpus with `points` + `lookup`
  dict `{uuid: {party, point_number}}`.
- `data/embeddings.npy` — L2-normalized `float32` matrix of shape
  `(N, 1024)`. Row `i` corresponds to `uuid == i`.
- `data/embeddings_meta.json` — model id, dim, uuid order, vLLM args used.

## Run it locally

```bash
pip install -r src/pipeline_1/requirements.txt

python -m src.pipeline_1.build_single_repo
python -m src.pipeline_1.embed_vllm
```

## Run on an H200

```bash
bash scripts/run_pipeline_1_h200.sh
```

## Model choice

`Qwen/Qwen3-Embedding-0.6B` is the smallest member of the Qwen3 embedding
family, runs as a pooling model in vLLM (>= 0.14), supports 8K context,
and is at the top of the MTEB leaderboard in its size class. The pipeline
embeds raw document text (no query instruction prefix) since this is a
corpus-only pass; retrieval / similarity search is future work.

## Notes / out of scope

- No vector DB ingestion yet (FAISS / Qdrant / Chroma are a later pipeline).
- No cross-party similarity search yet.
- No reranker pass — the plan is to add Qwen3-Reranker in a later pipeline.
