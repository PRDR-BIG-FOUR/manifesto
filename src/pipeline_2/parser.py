"""Parse the ``<item_sep>``/``<sep>``-delimited Gemini response.

The expected layout per response (for K points) is::

    P1
    {beneficiary json}
    <sep>
    {plan_existence json}
    <sep>
    {feasibility json}
    <item_sep>
    P2
    ...

This module is forgiving: it strips markdown code fences if the model adds
them, falls back to extracting the first balanced ``{...}`` object when a
section isn't valid JSON on its own, and returns one ``ParsedItem`` per
expected point even when the model under- or over-produces.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from typing import Any

from .config import ITEM_HEADER_PREFIX, ITEM_SEP, SECTION_SEP


SECTION_KEYS: tuple[str, str, str] = (
    "beneficiary",
    "plan_existence",
    "feasibility",
)


@dataclass
class ParsedItem:
    index: int
    beneficiary: dict[str, Any] | None = None
    plan_existence: dict[str, Any] | None = None
    feasibility: dict[str, Any] | None = None
    errors: list[str] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return (
            self.beneficiary is not None
            and self.plan_existence is not None
            and self.feasibility is not None
            and not self.errors
        )

    def as_analysis(self) -> dict[str, Any]:
        return {
            "beneficiary": self.beneficiary,
            "plan_existence": self.plan_existence,
            "feasibility": self.feasibility,
        }


_FENCE_RE = re.compile(r"^\s*```(?:json)?\s*|\s*```\s*$", re.MULTILINE)
_HEADER_RE = re.compile(
    rf"^\s*{re.escape(ITEM_HEADER_PREFIX)}(\d+)\s*$",
    re.MULTILINE,
)


def _strip_fences(s: str) -> str:
    return _FENCE_RE.sub("", s).strip()


def _balanced_object(s: str) -> str | None:
    """Return the first balanced ``{...}`` substring, ignoring braces in strings."""

    start = s.find("{")
    if start == -1:
        return None
    depth = 0
    in_str = False
    esc = False
    for i in range(start, len(s)):
        ch = s[i]
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == '"':
                in_str = False
            continue
        if ch == '"':
            in_str = True
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return s[start : i + 1]
    return None


def _load_json(chunk: str) -> tuple[dict[str, Any] | None, str | None]:
    """Tolerant JSON load. Returns ``(obj, error)``; obj is None on failure."""

    cleaned = _strip_fences(chunk).strip()
    if not cleaned:
        return None, "empty section"
    try:
        obj = json.loads(cleaned)
        return (obj if isinstance(obj, dict) else None), (
            None if isinstance(obj, dict) else "section is not a JSON object"
        )
    except json.JSONDecodeError as err:
        candidate = _balanced_object(cleaned)
        if candidate is None:
            return None, f"no balanced object found ({err.msg})"
        try:
            obj = json.loads(candidate)
            return (obj if isinstance(obj, dict) else None), (
                None if isinstance(obj, dict) else "fallback object is not a dict"
            )
        except json.JSONDecodeError as err2:
            return None, f"json parse failed: {err2.msg}"


def _split_items(text: str) -> list[str]:
    """Split the raw response into per-item chunks using ``<item_sep>``."""

    parts = [p.strip() for p in text.split(ITEM_SEP)]
    return [p for p in parts if p]


def _strip_header(chunk: str, expected_idx: int | None) -> str:
    """Drop a leading ``Pn`` header line if present.

    If ``expected_idx`` is given and the header doesn't match, we still strip
    the header (the model occasionally renumbers) but the caller is responsible
    for index alignment.
    """

    match = _HEADER_RE.match(chunk)
    if match:
        return chunk[match.end() :].lstrip("\n")
    return chunk


def parse_response(text: str, expected_count: int) -> list[ParsedItem]:
    """Parse a full Gemini response covering ``expected_count`` points.

    Always returns a list of length ``expected_count``. Items the model failed
    to produce are returned with ``errors`` populated and section fields None.
    """

    items: list[ParsedItem] = []
    chunks = _split_items(text)

    for i in range(expected_count):
        idx = i + 1
        if i >= len(chunks):
            items.append(
                ParsedItem(index=idx, errors=[f"missing item {idx} in response"])
            )
            continue

        chunk = _strip_header(chunks[i], idx)
        sections = chunk.split(SECTION_SEP)
        if len(sections) < 3:
            items.append(
                ParsedItem(
                    index=idx,
                    errors=[
                        f"expected 3 <sep>-separated sections, got {len(sections)}"
                    ],
                )
            )
            continue

        # If the model emitted >3 sections, ignore the trailing extras.
        beneficiary, b_err = _load_json(sections[0])
        existence, e_err = _load_json(sections[1])
        feasibility, f_err = _load_json(sections[2])

        errors: list[str] = []
        if b_err:
            errors.append(f"beneficiary: {b_err}")
        if e_err:
            errors.append(f"plan_existence: {e_err}")
        if f_err:
            errors.append(f"feasibility: {f_err}")

        items.append(
            ParsedItem(
                index=idx,
                beneficiary=beneficiary,
                plan_existence=existence,
                feasibility=feasibility,
                errors=errors,
            )
        )

    return items
