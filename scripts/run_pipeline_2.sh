#!/usr/bin/env bash
# Pipeline 2 launcher: enrich each per-party manifesto JSON with Gemini Flash
# (Google Search grounded, async fan-out).
#
# Required env:
#   GEMINI_API_KEY   API key for the Gemini Developer API (google-genai).
#
# Optional env / flags (with defaults):
#   PARTY=all        aiadmk | dmk | tvk_en | all
#   MODEL=gemini-3-flash-preview
#   BATCH_K=4        points per Gemini request
#   CONCURRENCY=8    in-flight requests cap
#   MAX_RETRIES=4    transient-error retries
#   LIMIT=30         cap points per party (smoke runs); set LIMIT= (empty) for full run
#   OUT=data/pipeline_2
#   VENV_DIR=.venv

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${PROJECT_DIR}"

if [[ -z "${GEMINI_API_KEY:-}" ]]; then
  echo "[pipeline_2] ERROR: GEMINI_API_KEY is not set." >&2
  exit 1
fi

VENV_DIR="${VENV_DIR:-.venv}"
if [[ -f "${VENV_DIR}/bin/activate" ]]; then
  # shellcheck disable=SC1090,SC1091
  source "${VENV_DIR}/bin/activate"
fi

PARTY="${PARTY:-all}"
MODEL="${MODEL:-gemini-3-flash-preview}"
BATCH_K="${BATCH_K:-4}"
CONCURRENCY="${CONCURRENCY:-8}"
MAX_RETRIES="${MAX_RETRIES:-4}"
OUT="${OUT:-data/pipeline_2}"
LIMIT="${LIMIT-30}"

echo "[pipeline_2] project dir : ${PROJECT_DIR}"
echo "[pipeline_2] party       : ${PARTY}"
echo "[pipeline_2] model       : ${MODEL}"
echo "[pipeline_2] batch_k     : ${BATCH_K}"
echo "[pipeline_2] concurrency : ${CONCURRENCY}"
echo "[pipeline_2] max_retries : ${MAX_RETRIES}"
echo "[pipeline_2] out dir     : ${OUT}"
[[ -n "${LIMIT:-}" ]] && echo "[pipeline_2] limit       : ${LIMIT}"

ARGS=(
  --party "${PARTY}"
  --model "${MODEL}"
  --batch-k "${BATCH_K}"
  --concurrency "${CONCURRENCY}"
  --max-retries "${MAX_RETRIES}"
  --out "${OUT}"
)
if [[ -n "${LIMIT:-}" ]]; then
  ARGS+=(--limit "${LIMIT}")
fi
ARGS+=("$@")

python -m src.pipeline_2.process "${ARGS[@]}"

echo "[pipeline_2] done."
