"""Async wrapper around google-genai for Pipeline 2.

Uses ``client.aio.models.generate_content`` with the Google Search grounding
tool enabled, retries transient errors with exponential backoff + jitter, and
extracts grounding metadata (search queries + citation URLs) along with token
usage onto the returned record.
"""

from __future__ import annotations

import asyncio
import os
import random
from dataclasses import dataclass, field
from typing import Any

from .config import (
    API_KEY_ENV,
    DEFAULT_INITIAL_BACKOFF,
    DEFAULT_MAX_BACKOFF,
    DEFAULT_MAX_RETRIES,
    DEFAULT_MODEL,
)


@dataclass
class GeminiCallResult:
    """Container for a single async Gemini call."""

    text: str
    search_queries: list[str] = field(default_factory=list)
    citation_urls: list[str] = field(default_factory=list)
    tokens: dict[str, int] = field(default_factory=dict)
    attempts: int = 1
    model: str = DEFAULT_MODEL


class GeminiClient:
    """Thin async wrapper. Construct once per process; share across coroutines."""

    def __init__(
        self,
        model: str = DEFAULT_MODEL,
        api_key: str | None = None,
        max_retries: int = DEFAULT_MAX_RETRIES,
        initial_backoff: float = DEFAULT_INITIAL_BACKOFF,
        max_backoff: float = DEFAULT_MAX_BACKOFF,
    ) -> None:
        from google import genai

        api_key = api_key or os.environ.get(API_KEY_ENV)
        if not api_key:
            raise RuntimeError(
                f"Missing API key. Set ${API_KEY_ENV} or pass api_key=..."
            )

        self._genai = genai
        self._client = genai.Client(api_key=api_key)
        self.model = model
        self.max_retries = max_retries
        self.initial_backoff = initial_backoff
        self.max_backoff = max_backoff

    def _build_config(self) -> Any:
        from google.genai import types

        return types.GenerateContentConfig(
            tools=[types.Tool(google_search=types.GoogleSearch())],
            temperature=0.2,
        )

    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
    ) -> GeminiCallResult:
        """Run one grounded generation with retries."""

        from google.genai import types

        config = self._build_config()
        config.system_instruction = system_prompt

        contents = [
            types.Content(role="user", parts=[types.Part(text=user_prompt)]),
        ]

        last_err: Exception | None = None
        for attempt in range(1, self.max_retries + 1):
            try:
                response = await self._client.aio.models.generate_content(
                    model=self.model,
                    contents=contents,
                    config=config,
                )
                return self._extract(response, attempt)
            except Exception as err:  # noqa: BLE001 - normalize all SDK errors
                last_err = err
                if not _is_retryable(err) or attempt >= self.max_retries:
                    break
                delay = min(
                    self.max_backoff,
                    self.initial_backoff * (2 ** (attempt - 1)),
                )
                delay += random.uniform(0, delay * 0.25)
                await asyncio.sleep(delay)

        assert last_err is not None
        raise last_err

    def _extract(self, response: Any, attempts: int) -> GeminiCallResult:
        text = getattr(response, "text", "") or ""

        search_queries: list[str] = []
        citation_urls: list[str] = []
        candidates = getattr(response, "candidates", None) or []
        for cand in candidates:
            gm = getattr(cand, "grounding_metadata", None)
            if gm is None:
                continue
            queries = getattr(gm, "web_search_queries", None) or []
            for q in queries:
                if isinstance(q, str) and q not in search_queries:
                    search_queries.append(q)
            chunks = getattr(gm, "grounding_chunks", None) or []
            for ch in chunks:
                web = getattr(ch, "web", None)
                if web is None:
                    continue
                url = getattr(web, "uri", None) or getattr(web, "url", None)
                if isinstance(url, str) and url not in citation_urls:
                    citation_urls.append(url)

        usage = getattr(response, "usage_metadata", None)
        tokens: dict[str, int] = {}
        if usage is not None:
            for key in (
                "prompt_token_count",
                "candidates_token_count",
                "total_token_count",
                "cached_content_token_count",
            ):
                val = getattr(usage, key, None)
                if isinstance(val, int):
                    tokens[key] = val

        return GeminiCallResult(
            text=text,
            search_queries=search_queries,
            citation_urls=citation_urls,
            tokens=tokens,
            attempts=attempts,
            model=self.model,
        )


_RETRYABLE_STATUS = {408, 425, 429, 500, 502, 503, 504}


def _is_retryable(err: Exception) -> bool:
    """Heuristic retry decision for google-genai errors and network blips."""

    code = getattr(err, "code", None)
    if isinstance(code, int) and code in _RETRYABLE_STATUS:
        return True
    status = getattr(err, "status_code", None)
    if isinstance(status, int) and status in _RETRYABLE_STATUS:
        return True
    msg = str(err).lower()
    return any(
        token in msg
        for token in (
            "429",
            "rate limit",
            "resource_exhausted",
            "deadline",
            "unavailable",
            "internal",
            "timeout",
            "connection reset",
        )
    )
