"""Pipeline 2 entry point.

Loads a per-party manifesto JSON, chunks the points into K-sized batches,
fans out async grounded Gemini calls under a concurrency cap, parses the
``<item_sep>``/``<sep>`` response, merges an ``analysis`` field back onto each
point, and writes ``data/pipeline_2/<party>.enriched.json``.
"""

from __future__ import annotations

import argparse
import asyncio
import copy
import datetime as _dt
import json
import sys
from pathlib import Path
from typing import Any, Iterable

from .config import (
    DEFAULT_BATCH_K,
    DEFAULT_CONCURRENCY,
    DEFAULT_MAX_RETRIES,
    DEFAULT_MODEL,
    OUTPUT_DIR,
    PARTY_FILES,
)
from .gemini_client import GeminiCallResult, GeminiClient
from .parser import ParsedItem, parse_response
from .prompts import SYSTEM_PROMPT, build_user_prompt


def _load_party(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        doc = json.load(f)
    if not isinstance(doc, dict) or not isinstance(doc.get("points"), list):
        raise ValueError(f"{path}: expected an object with a 'points' list")
    return doc


def _chunk(seq: list[Any], n: int) -> Iterable[list[Any]]:
    for i in range(0, len(seq), n):
        yield seq[i : i + n]


async def _process_batch(
    client: GeminiClient,
    sem: asyncio.Semaphore,
    batch: list[dict[str, Any]],
    batch_idx: int,
    total_batches: int,
) -> tuple[list[ParsedItem], GeminiCallResult | None, str | None]:
    """Run one batch under the semaphore. Returns (items, raw, error)."""

    async with sem:
        try:
            user_prompt = build_user_prompt(batch)
            result = await client.generate(SYSTEM_PROMPT, user_prompt)
        except Exception as err:  # noqa: BLE001
            print(
                f"[pipeline_2] batch {batch_idx + 1}/{total_batches} FAILED: {err}",
                file=sys.stderr,
            )
            return [], None, str(err)

    items = parse_response(result.text, expected_count=len(batch))
    n_ok = sum(1 for it in items if it.ok)
    print(
        f"[pipeline_2] batch {batch_idx + 1}/{total_batches} done "
        f"({n_ok}/{len(batch)} parsed ok, attempts={result.attempts}, "
        f"tokens={result.tokens.get('total_token_count', '?')})",
        flush=True,
    )
    return items, result, None


def _attach_analysis(
    point: dict[str, Any],
    parsed: ParsedItem | None,
    raw: GeminiCallResult | None,
    batch_error: str | None,
) -> dict[str, Any]:
    """Return a deep-copied point with ``analysis`` merged in."""

    out = copy.deepcopy(point)

    if batch_error is not None or parsed is None:
        out["analysis"] = {
            "error": batch_error or "no parsed item produced",
            "_meta": {
                "model": raw.model if raw else None,
                "tokens": raw.tokens if raw else {},
                "attempts": raw.attempts if raw else 0,
            },
        }
        return out

    analysis: dict[str, Any] = {
        "beneficiary": parsed.beneficiary,
        "plan_existence": parsed.plan_existence,
        "feasibility": parsed.feasibility,
    }
    if raw is not None:
        analysis["_grounding"] = {
            "search_queries": raw.search_queries,
            "citation_urls": raw.citation_urls,
        }
        analysis["_meta"] = {
            "model": raw.model,
            "tokens": raw.tokens,
            "attempts": raw.attempts,
        }
    if parsed.errors:
        analysis["_parse_errors"] = parsed.errors

    out["analysis"] = analysis
    return out


async def process_party(
    party: str,
    in_path: Path,
    out_path: Path,
    *,
    model: str = DEFAULT_MODEL,
    batch_k: int = DEFAULT_BATCH_K,
    concurrency: int = DEFAULT_CONCURRENCY,
    max_retries: int = DEFAULT_MAX_RETRIES,
    limit: int | None = None,
) -> dict[str, Any]:
    """Process a single party file end-to-end. Returns the written document."""

    doc = _load_party(in_path)
    points: list[dict[str, Any]] = list(doc["points"])
    if limit is not None:
        points = points[:limit]

    print(
        f"[pipeline_2] {party}: {len(points)} points -> "
        f"batch_k={batch_k}, concurrency={concurrency}, model={model}",
        flush=True,
    )

    client = GeminiClient(model=model, max_retries=max_retries)
    sem = asyncio.Semaphore(concurrency)

    batches = list(_chunk(points, batch_k))
    total_batches = len(batches)

    tasks = [
        _process_batch(client, sem, batch, idx, total_batches)
        for idx, batch in enumerate(batches)
    ]

    enriched: list[dict[str, Any]] = []
    n_failures = 0
    n_parse_errors = 0
    total_tokens = 0
    started = _dt.datetime.utcnow()

    results = await asyncio.gather(*tasks)
    for batch, (items, raw, batch_error) in zip(batches, results):
        if batch_error is not None:
            n_failures += len(batch)
            for point in batch:
                enriched.append(_attach_analysis(point, None, raw, batch_error))
            continue

        if raw is not None:
            total_tokens += raw.tokens.get("total_token_count", 0) or 0

        for i, point in enumerate(batch):
            parsed = items[i] if i < len(items) else None
            if parsed is None or not parsed.ok:
                n_parse_errors += 1
            enriched.append(_attach_analysis(point, parsed, raw, None))

    finished = _dt.datetime.utcnow()

    out_doc: dict[str, Any] = dict(doc)
    out_doc["points"] = enriched
    out_doc["pipeline_2_meta"] = {
        "party": party,
        "source": str(in_path),
        "model": model,
        "batch_k": batch_k,
        "concurrency": concurrency,
        "max_retries": max_retries,
        "total_points": len(enriched),
        "batches": total_batches,
        "failures": n_failures,
        "parse_errors": n_parse_errors,
        "total_tokens_estimate": total_tokens,
        "started_at": started.isoformat(timespec="seconds") + "Z",
        "finished_at": finished.isoformat(timespec="seconds") + "Z",
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(out_doc, f, ensure_ascii=False, indent=2)

    print(
        f"[pipeline_2] {party}: wrote {out_path} "
        f"(failures={n_failures}, parse_errors={n_parse_errors}, "
        f"tokens~={total_tokens})",
        flush=True,
    )
    return out_doc


def _resolve_parties(party_arg: str) -> dict[str, Path]:
    if party_arg == "all":
        return PARTY_FILES
    if party_arg not in PARTY_FILES:
        raise SystemExit(
            f"Unknown party '{party_arg}'. Choose from: {', '.join(PARTY_FILES)} or 'all'."
        )
    return {party_arg: PARTY_FILES[party_arg]}


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--party",
        default="all",
        help="Party key to process (aiadmk|dmk|tvk_en) or 'all'.",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=OUTPUT_DIR,
        help="Output directory for enriched JSONs.",
    )
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--batch-k", type=int, default=DEFAULT_BATCH_K)
    parser.add_argument("--concurrency", type=int, default=DEFAULT_CONCURRENCY)
    parser.add_argument("--max-retries", type=int, default=DEFAULT_MAX_RETRIES)
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Optional cap on points per party (debug / smoke runs).",
    )
    return parser.parse_args()


async def _amain(args: argparse.Namespace) -> None:
    parties = _resolve_parties(args.party)
    for party, in_path in parties.items():
        out_path = args.out / f"{party}.enriched.json"
        await process_party(
            party=party,
            in_path=in_path,
            out_path=out_path,
            model=args.model,
            batch_k=args.batch_k,
            concurrency=args.concurrency,
            max_retries=args.max_retries,
            limit=args.limit,
        )


def main() -> None:
    args = _parse_args()
    asyncio.run(_amain(args))


if __name__ == "__main__":
    main()
