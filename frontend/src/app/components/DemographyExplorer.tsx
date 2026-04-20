import React, { useMemo, useState } from "react";
import { allPoints, TOTALS, sampleSizes, type ManifestoPoint } from "../manifestoData";

const sans  = '"Inter Tight", sans-serif';
const serif = '"Source Serif 4", serif';
const mono  = '"IBM Plex Mono", monospace';
const dark  = "#121212";
const gray  = "#6b6b6b";
const border = "#d9d7d2";
const brown = "#a16749";
const admkColor = "#547c5b";
const dmkColor  = "#c94d48";
const tvkColor  = "#E5A000";

type PartyKey = "admk" | "dmk" | "tvk";
type FilterKey =
  | "women" | "youth" | "elderly"
  | "sc_st" | "obc_mbc"
  | "rural" | "urban"
  | "agri" | "welfare" | "education";

const FILTERS: { key: FilterKey; label: string; match: (p: ManifestoPoint) => boolean }[] = [
  { key: "women",     label: "Women",      match: p => p.gender.includes("women") },
  { key: "youth",     label: "Youth",      match: p => p.ageGroup.includes("youth") || p.primaryTheme === "youth" },
  { key: "elderly",   label: "Elderly",    match: p => p.ageGroup.includes("elderly") },
  { key: "sc_st",     label: "SC / ST",    match: p => p.communityCategory.some(c => c === "SC" || c === "ST") },
  { key: "obc_mbc",   label: "OBC / MBC",  match: p => p.communityCategory.some(c => c === "OBC" || c === "MBC") },
  { key: "rural",     label: "Rural",      match: p => p.urbanRural === "rural" },
  { key: "urban",     label: "Urban",      match: p => p.urbanRural === "urban" },
  { key: "agri",      label: "Agriculture",match: p => p.sector.some(s => /agri/i.test(s)) || p.primaryTheme === "agriculture" },
  { key: "welfare",   label: "Welfare",    match: p => p.primaryTheme === "welfare" },
  { key: "education", label: "Education",  match: p => p.primaryTheme === "education" },
];

const PARTIES: { key: PartyKey; label: string; color: string }[] = [
  { key: "admk", label: "ADMK", color: admkColor },
  { key: "dmk",  label: "DMK",  color: dmkColor  },
  { key: "tvk",  label: "TVK",  color: tvkColor  },
];

function scaleCount(sample: number, party: PartyKey): number {
  const ss = sampleSizes[party];
  if (ss === 0) return 0;
  return Math.round((sample / ss) * TOTALS[party]);
}

export function DemographyExplorer() {
  const [active, setActive] = useState<Set<FilterKey>>(new Set());
  const [mode, setMode] = useState<"reach" | "share">("reach");
  const [drill, setDrill] = useState<{ filter: FilterKey; party: PartyKey } | null>(null);

  const toggle = (k: FilterKey) =>
    setActive(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });

  // AND-logic combine of active filters — applied on top of per-row filter.
  const combinedMatch = (p: ManifestoPoint): boolean =>
    [...active].every(k => {
      const f = FILTERS.find(x => x.key === k);
      return f ? f.match(p) : true;
    });

  // For each row (filter), intersect with active filters (AND). If that row is
  // itself active, it's redundant but harmless (its own match will be true).
  const rows = useMemo(() => {
    return FILTERS.map(row => {
      const counts: Record<PartyKey, { raw: number; scaled: number; pts: ManifestoPoint[] }> = {
        admk: { raw: 0, scaled: 0, pts: [] },
        dmk:  { raw: 0, scaled: 0, pts: [] },
        tvk:  { raw: 0, scaled: 0, pts: [] },
      };
      for (const p of allPoints) {
        if (!row.match(p)) continue;
        if (!combinedMatch(p)) continue;
        counts[p.party].raw++;
        counts[p.party].pts.push(p);
      }
      for (const party of ["admk","dmk","tvk"] as const) {
        counts[party].scaled = scaleCount(counts[party].raw, party);
      }
      return { filter: row, counts };
    });
  }, [active]);

  // Scale for the bars: either absolute max (Reach) or 100 (Share %)
  const maxVal = useMemo(() => {
    if (mode === "share") return 100;
    return Math.max(
      1,
      ...rows.flatMap(r => (["admk","dmk","tvk"] as const).map(k => r.counts[k].scaled))
    );
  }, [rows, mode]);

  const totalPromises = useMemo(() => ({
    admk: TOTALS.admk,
    dmk:  TOTALS.dmk,
    tvk:  TOTALS.tvk,
  }), []);

  const cellValue = (party: PartyKey, scaled: number): { display: string; pct: number } => {
    if (mode === "share") {
      const pct = totalPromises[party] > 0 ? (scaled / totalPromises[party]) * 100 : 0;
      return { display: `${pct.toFixed(1)}%`, pct };
    }
    const pct = maxVal > 0 ? (scaled / maxVal) * 100 : 0;
    return { display: String(scaled), pct };
  };

  const drillRow = drill ? rows.find(r => r.filter.key === drill.filter) : null;
  const drillPts = drillRow ? drillRow.counts[drill!.party].pts : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Controls row: toggle + chips */}
      <div style={{
        display: "flex", flexWrap: "wrap" as const, alignItems: "center",
        gap: 12, padding: "16px 0", borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`,
      }}>
        {/* Reach/Share toggle */}
        <div style={{
          display: "inline-flex", alignItems: "center",
          border: `1px solid ${border}`, borderRadius: 4, padding: 2, background: "#faf9f6",
        }}>
          {(["reach", "share"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding: "5px 12px", borderRadius: 3, cursor: "pointer",
              background: mode === m ? dark : "transparent",
              color: mode === m ? "#fff" : dark,
              border: "none",
              fontFamily: sans, fontSize: 11, fontWeight: 600,
              letterSpacing: "0.8px", textTransform: "uppercase" as const,
            }}>{m === "reach" ? "Reach" : "Share"}</button>
          ))}
        </div>

        <span style={{ fontFamily: serif, fontSize: 13, color: gray, fontStyle: "italic", marginRight: 4 }}>
          {mode === "reach"
            ? "Absolute promise counts per party."
            : "% of each party's manifesto targeting this group."}
        </span>

        <div style={{ flex: 1 }} />

        <span style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" as const, color: gray, marginRight: 2 }}>
          Filter
        </span>
        {FILTERS.map(f => {
          const on = active.has(f.key);
          return (
            <button key={f.key} onClick={() => toggle(f.key)} style={{
              padding: "5px 12px", borderRadius: 16, cursor: "pointer",
              background: on ? brown : "transparent",
              color: on ? "#fff" : dark,
              border: `1px solid ${on ? brown : border}`,
              fontFamily: sans, fontSize: 12, fontWeight: 500,
              transition: "all 0.15s",
            }}>{f.label}</button>
          );
        })}
        {active.size > 0 && (
          <button onClick={() => setActive(new Set())} style={{
            padding: "5px 10px", borderRadius: 16, cursor: "pointer",
            background: "transparent", color: gray,
            border: `1px dashed ${border}`,
            fontFamily: sans, fontSize: 11,
          }}>Clear ×</button>
        )}
      </div>

      {/* Active-filter summary */}
      {active.size > 0 && (
        <div style={{ fontFamily: serif, fontSize: 14, color: "#2e2e2e", lineHeight: 1.5 }}>
          Showing promises that target{" "}
          <strong style={{ color: brown }}>
            {[...active].map(k => FILTERS.find(f => f.key === k)?.label).join(" + ")}
          </strong>
          {" "}(AND logic).
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: 24 }}>
        {PARTIES.map(p => (
          <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 14, height: 6, borderRadius: 3, background: p.color }} />
            <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: gray }}>{p.label}</span>
          </div>
        ))}
        <span style={{ marginLeft: "auto", fontFamily: serif, fontSize: 12, color: gray, fontStyle: "italic" }}>
          Click any bar to see the underlying promises ↓
        </span>
      </div>

      {/* Rows */}
      <div>
        {rows.map((r, i) => {
          const rowTotal = r.counts.admk.scaled + r.counts.dmk.scaled + r.counts.tvk.scaled;
          const rowIsActive = active.has(r.filter.key);
          return (
            <div key={r.filter.key} style={{
              display: "grid", gridTemplateColumns: "160px 1fr 60px",
              alignItems: "center", padding: "16px 0",
              borderTop: i === 0 ? `1px solid #e8e6e1` : `1px solid #f0eeea`,
              background: rowIsActive ? "#faf8f4" : "transparent",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => toggle(r.filter.key)} style={{
                  background: "none", border: "none", padding: 0, cursor: "pointer",
                  fontFamily: sans, fontSize: 14, fontWeight: rowIsActive ? 700 : 500,
                  color: rowIsActive ? brown : dark, textAlign: "left" as const,
                }}>{r.filter.label}</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {PARTIES.map(p => {
                  const scaled = r.counts[p.key].scaled;
                  const raw = r.counts[p.key].raw;
                  const { display, pct } = cellValue(p.key, scaled);
                  const isDrilled = drill?.filter === r.filter.key && drill?.party === p.key;
                  return (
                    <button key={p.key}
                      onClick={() => raw > 0 && setDrill(isDrilled ? null : { filter: r.filter.key, party: p.key })}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        background: "none", border: "none", padding: 0,
                        cursor: raw > 0 ? "pointer" : "default",
                        opacity: raw === 0 ? 0.45 : 1,
                        textAlign: "left" as const,
                      }}>
                      <span style={{ fontFamily: sans, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: p.color, minWidth: 38 }}>{p.label}</span>
                      <div style={{
                        flex: 1, height: 14, background: "#f0eeea", borderRadius: 7,
                        overflow: "hidden", position: "relative" as const,
                        outline: isDrilled ? `2px solid ${dark}` : "none",
                      }}>
                        <div style={{
                          width: `${Math.min(100, pct)}%`, height: "100%",
                          background: p.color, borderRadius: 7,
                          transition: "width 0.35s ease",
                          minWidth: scaled > 0 ? 6 : 0,
                        }} />
                      </div>
                      <span style={{
                        fontFamily: mono, fontSize: 12, color: dark,
                        minWidth: 52, textAlign: "right" as const, fontVariantNumeric: "tabular-nums" as const,
                      }}>{display}</span>
                    </button>
                  );
                })}
              </div>
              <div style={{
                fontFamily: mono, fontSize: 11, color: gray,
                textAlign: "right" as const,
              }}>
                {mode === "reach" ? rowTotal || "—" : ""}
              </div>
            </div>
          );
        })}
      </div>

      {/* Drill-down panel */}
      {drill && drillRow && (
        <div style={{
          border: `1px solid ${border}`, borderRadius: 6, padding: "18px 20px",
          background: "#fcfbf7",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                width: 10, height: 10, borderRadius: 2,
                background: PARTIES.find(p => p.key === drill.party)!.color,
              }} />
              <span style={{
                fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase" as const, color: PARTIES.find(p => p.key === drill.party)!.color,
              }}>{PARTIES.find(p => p.key === drill.party)!.label}</span>
              <span style={{ fontFamily: serif, fontSize: 15, color: dark }}>
                promises targeting <strong>{drillRow.filter.label}</strong>
                {active.size > 0 && <span style={{ color: gray }}> (+ {[...active].filter(k => k !== drillRow.filter.key).map(k => FILTERS.find(f => f.key === k)?.label).join(", ") || "no other filters"})</span>}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: mono, fontSize: 11, color: gray }}>
                {drillPts.length} of {sampleSizes[drill.party]} enriched · scaled ≈ {drillRow.counts[drill.party].scaled}
              </span>
              <button onClick={() => setDrill(null)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: sans, fontSize: 18, color: gray, lineHeight: 1, padding: 0,
              }}>×</button>
            </div>
          </div>

          {drillPts.length === 0 ? (
            <div style={{ fontFamily: serif, fontSize: 14, color: gray, fontStyle: "italic", padding: "12px 0" }}>
              No enriched sample promises match this filter combination for {PARTIES.find(p => p.key === drill.party)!.label}.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {drillPts.map((p, i) => (
                <div key={i} style={{
                  padding: "12px 0",
                  borderTop: i === 0 ? "none" : `1px solid ${border}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: mono, fontSize: 11, color: gray }}>#{p.pointNumber}</span>
                    {p.sectionTitle && (
                      <span style={{ fontFamily: mono, fontSize: 11, color: gray }}>§ {p.sectionTitle}</span>
                    )}
                  </div>
                  <div style={{ fontFamily: serif, fontSize: 15, color: dark, lineHeight: 1.45, fontWeight: 500 }}>
                    {p.title || p.text.slice(0, 140) + (p.text.length > 140 ? "…" : "")}
                  </div>
                  {p.tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginTop: 8 }}>
                      {p.tags.slice(0, 5).map(tag => (
                        <span key={tag} style={{
                          fontFamily: sans, fontSize: 10, fontWeight: 600,
                          padding: "2px 7px", borderRadius: 12,
                          background: PARTIES.find(pp => pp.key === drill.party)!.color + "18",
                          border: `1px solid ${PARTIES.find(pp => pp.key === drill.party)!.color}40`,
                          color: PARTIES.find(pp => pp.key === drill.party)!.color,
                          letterSpacing: "0.04em",
                        }}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
