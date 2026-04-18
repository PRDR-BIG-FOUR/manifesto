#!/usr/bin/env bash
# Launch the Gradio UI for semantic search over Pipeline 1 embeddings.
#
# Usage:
#   scripts/semantic_search.sh                      # default port 7860
#   PORT=7862 scripts/semantic_search.sh            # custom port
#   CUDA_VISIBLE_DEVICES=2 scripts/semantic_search.sh
#   scripts/semantic_search.sh --share              # public share link
#
# Env overrides:
#   CUDA_VISIBLE_DEVICES  (default: 1)
#   VENV_DIR              (default: <project>/.venv)
#   HOST                  (default: 0.0.0.0)
#   PORT                  (default: 7860)
#   GPU_MEM_UTIL          (default: 0.4)
#   DTYPE                 (default: bfloat16)
#   MAX_MODEL_LEN         (default: 8192)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${PROJECT_DIR}"

VENV_DIR="${VENV_DIR:-${PROJECT_DIR}/.venv}"
if [[ ! -d "${VENV_DIR}" ]]; then
  echo "[semantic_search] venv not found at ${VENV_DIR}" >&2
  echo "  create it first: uv venv --python 3.12 .venv && source .venv/bin/activate && uv pip install -r src/pipeline_1/requirements.txt gradio" >&2
  exit 1
fi
# shellcheck disable=SC1091
source "${VENV_DIR}/bin/activate"

if ! python -c "import gradio" >/dev/null 2>&1; then
  echo "[semantic_search] installing gradio into ${VENV_DIR}"
  if command -v uv >/dev/null 2>&1; then
    uv pip install "gradio>=4.44,<6"
  else
    pip install "gradio>=4.44,<6"
  fi
fi

export CUDA_VISIBLE_DEVICES="${CUDA_VISIBLE_DEVICES:-1}"
export HF_HOME="${HF_HOME:-${HOME}/.cache/huggingface}"
export VLLM_WORKER_MULTIPROC_METHOD="${VLLM_WORKER_MULTIPROC_METHOD:-spawn}"
export TOKENIZERS_PARALLELISM="${TOKENIZERS_PARALLELISM:-false}"

HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-7860}"
DTYPE="${DTYPE:-bfloat16}"
MAX_MODEL_LEN="${MAX_MODEL_LEN:-8192}"
GPU_MEM_UTIL="${GPU_MEM_UTIL:-0.4}"

echo "[semantic_search] host         : ${HOST}"
echo "[semantic_search] port         : ${PORT}"
echo "[semantic_search] GPUs         : ${CUDA_VISIBLE_DEVICES}"
echo "[semantic_search] dtype        : ${DTYPE}"
echo "[semantic_search] max_model_len: ${MAX_MODEL_LEN}"
echo "[semantic_search] gpu_mem_util : ${GPU_MEM_UTIL}"

python "${SCRIPT_DIR}/semantic_search_app.py" \
  --host "${HOST}" \
  --port "${PORT}" \
  --dtype "${DTYPE}" \
  --max-model-len "${MAX_MODEL_LEN}" \
  --gpu-memory-utilization "${GPU_MEM_UTIL}" \
  "$@"
