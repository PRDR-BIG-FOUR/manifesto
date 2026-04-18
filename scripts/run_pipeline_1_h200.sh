#!/usr/bin/env bash
# Pipeline 1 launcher for a single-H200 box.
# - 141 GB HBM is massive overkill for a 0.6B embedding model, so we keep
#   gpu_memory_utilization low and stick to tensor_parallel_size=1.
# - bf16 + max_model_len=8192 matches the Qwen3-Embedding-0.6B recipe.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${PROJECT_DIR}"

export CUDA_VISIBLE_DEVICES="${CUDA_VISIBLE_DEVICES:-0}"
export HF_HOME="${HF_HOME:-${HOME}/.cache/huggingface}"
export VLLM_WORKER_MULTIPROC_METHOD="${VLLM_WORKER_MULTIPROC_METHOD:-spawn}"
export TOKENIZERS_PARALLELISM="${TOKENIZERS_PARALLELISM:-false}"

MODEL="${MODEL:-Qwen/Qwen3-Embedding-0.6B}"
DTYPE="${DTYPE:-bfloat16}"
MAX_MODEL_LEN="${MAX_MODEL_LEN:-8192}"
BATCH_SIZE="${BATCH_SIZE:-256}"
GPU_MEM_UTIL="${GPU_MEM_UTIL:-0.6}"
TP_SIZE="${TP_SIZE:-1}"

echo "[pipeline_1] project dir : ${PROJECT_DIR}"
echo "[pipeline_1] model       : ${MODEL}"
echo "[pipeline_1] dtype       : ${DTYPE}"
echo "[pipeline_1] max_len     : ${MAX_MODEL_LEN}"
echo "[pipeline_1] batch_size  : ${BATCH_SIZE}"
echo "[pipeline_1] gpu_mem_util: ${GPU_MEM_UTIL}"
echo "[pipeline_1] tp_size     : ${TP_SIZE}"
echo "[pipeline_1] GPUs        : ${CUDA_VISIBLE_DEVICES}"

echo "[pipeline_1] building single_repo_manifesto.json"
python -m src.pipeline_1.build_single_repo \
  --data-dir data \
  --out data/single_repo_manifesto.json

echo "[pipeline_1] running vLLM embedding pass"
python -m src.pipeline_1.embed_vllm \
  --input data/single_repo_manifesto.json \
  --out-dir data \
  --model "${MODEL}" \
  --dtype "${DTYPE}" \
  --max-model-len "${MAX_MODEL_LEN}" \
  --batch-size "${BATCH_SIZE}" \
  --gpu-memory-utilization "${GPU_MEM_UTIL}" \
  --tensor-parallel-size "${TP_SIZE}"

echo "[pipeline_1] done."
