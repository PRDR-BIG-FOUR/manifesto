import React, { useState, useEffect, useRef } from "react";
import { type ManifestoPoint, PARTY_COLORS_BY_LABEL } from "../manifestoData";

const sans  = '"Inter Tight", sans-serif';
const serif = '"Source Serif 4", serif';
const mono  = '"IBM Plex Mono", monospace';
const dark  = "#121212";
const gray  = "#6b6b6b";
const border = "#d9d7d2";

interface PromiseModalProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  promises: ManifestoPoint[];
  partyLabel: string;
  onClose: () => void;
}

export function PromiseModal({ title, subtitle, promises, partyLabel, onClose }: PromiseModalProps) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const color = PARTY_COLORS_BY_LABEL[partyLabel] || dark;

  useEffect(() => {
    searchRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.toLowerCase().trim();
  const visible = q
    ? promises.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.text && p.text.toLowerCase().includes(q)) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        (p.sectionTitle && p.sectionTitle.toLowerCase().includes(q))
      )
    : promises;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(18,18,18,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "32px 24px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 10,
          width: "100%", maxWidth: 680,
          maxHeight: "80vh",
          display: "flex", flexDirection: "column",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px 0",
          borderBottom: `1px solid ${border}`,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
              <span style={{
                fontFamily: sans, fontSize: 12, fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase" as const, color,
              }}>{partyLabel}</span>
              <span style={{ fontFamily: serif, fontSize: 16, color: dark }}>
                {title}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: mono, fontSize: 11, color: gray }}>
                {visible.length} of {promises.length}
              </span>
              <button onClick={onClose} style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: sans, fontSize: 22, color: gray, lineHeight: 1, padding: 0,
              }}>×</button>
            </div>
          </div>

          {subtitle && (
            <div style={{ fontFamily: sans, fontSize: 13, color: gray, paddingBottom: 12 }}>
                {subtitle}
            </div>
          )}

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            border: `1px solid ${query ? color : border}`,
            borderRadius: 6, padding: "8px 12px",
            background: "#faf9f6", marginBottom: 14,
            transition: "border-color 0.15s",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="5.7" cy="6.2" r="4.2" stroke={query ? color : gray} strokeWidth="1" />
              <line x1="8.85" y1="9.35" x2="12" y2="12.5" stroke={query ? color : gray} strokeWidth="1" />
            </svg>
            <input
              ref={searchRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search promises…"
              style={{
                border: "none", outline: "none", background: "transparent", flex: 1,
                fontFamily: sans, fontSize: 13, color: dark,
              }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{
                background: "none", border: "none", cursor: "pointer",
                color: gray, fontSize: 16, lineHeight: 1, padding: 0,
              }}>×</button>
            )}
          </div>
        </div>

        {/* Promise list */}
        <div style={{ overflowY: "auto", padding: "0 24px 24px" }}>
          {visible.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center" as const, fontFamily: serif, fontSize: 15, color: gray, fontStyle: "italic" }}>
              No promises match "{query}"
            </div>
          ) : (
            visible.map((p, i) => (
              <div key={i} style={{ padding: "14px 0", borderTop: i === 0 ? "none" : `1px solid ${border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <span style={{ fontFamily: mono, fontSize: 11, color: gray }}>#{p.pointNumber}</span>
                  {p.sectionTitle && (
                    <span style={{ fontFamily: mono, fontSize: 11, color: gray }}>§ {p.sectionTitle}</span>
                  )}
                </div>
                <div style={{ fontFamily: serif, fontSize: 15, color: dark, lineHeight: 1.5, fontWeight: 500 }}>
                  {p.title || p.text}
                </div>
                {p.text && p.title && (
                    <div style={{ fontFamily: serif, fontSize: 14, color: gray, lineHeight: 1.4, marginTop: 4 }}>
                        {p.text}
                    </div>
                )}
                {p.tags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 5, marginTop: 8 }}>
                    {p.tags.slice(0, 5).map(tag => (
                      <span key={tag} style={{
                        fontFamily: sans, fontSize: 10, fontWeight: 600,
                        padding: "2px 7px", borderRadius: 12,
                        background: color + "18", border: `1px solid ${color}40`,
                        color: color, letterSpacing: "0.04em",
                      }}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
