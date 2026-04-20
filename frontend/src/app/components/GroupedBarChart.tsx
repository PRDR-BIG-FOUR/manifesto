import React from "react";

interface GroupedBarData {
  label: string;
  admk: number;
  dmk: number;
  tvk: number;
}

interface GroupedBarChartProps {
  data: GroupedBarData[];
}

const sans = '"Inter Tight", sans-serif';
const mono = '"IBM Plex Mono", monospace';
const admkColor = "#547c5b";
const dmkColor = "#c94d48";
const tvkColor = "#E5A000";

const parties = [
  { key: "admk" as const, label: "ADMK", color: admkColor },
  { key: "dmk" as const, label: "DMK", color: dmkColor },
  { key: "tvk" as const, label: "TVK", color: tvkColor },
];

export function GroupedBarChart({ data }: GroupedBarChartProps) {
  const maxVal = Math.max(...data.flatMap(d => [d.admk, d.dmk, d.tvk]));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Legend */}
      <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
        {parties.map(p => (
          <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 14, height: 6, borderRadius: 3, background: p.color, display: "inline-block" }} />
            <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b6b6b" }}>{p.label}</span>
          </div>
        ))}
      </div>

      {/* Rows */}
      {data.map((d, i) => (
        <div
          key={d.label}
          style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr",
            alignItems: "center",
            padding: "18px 0",
            borderTopWidth: 1,
            borderTopStyle: "solid" as const,
            borderTopColor: i === 0 ? "#e8e6e1" : "#f0eeea",
          }}
        >
          <div style={{ fontFamily: sans, fontSize: 14, fontWeight: 500, color: "#1a1a1a" }}>
            {d.label}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {parties.map(p => {
              const val = d[p.key];
              const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
              return (
                <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: p.color, minWidth: 40 }}>{p.label}</span>
                  <div style={{ flex: 1, height: 14, backgroundColor: "#f0eeea", borderRadius: 7, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        backgroundColor: p.color,
                        borderRadius: 7,
                        transition: "width 0.4s ease",
                        minWidth: val > 0 ? 8 : 0,
                      }}
                    />
                  </div>
                  <span style={{ fontFamily: mono, fontSize: 13, color: "#1a1a1a", minWidth: 24, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {val}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ borderTop: "1px solid #e8e6e1" }} />
    </div>
  );
}