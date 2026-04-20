import React, { useState } from "react";
import { Wheat, GraduationCap, Briefcase, Landmark, Factory, HardHat, HandCoins, Users, Palette, Scale, TrendingUp, MoreHorizontal } from "lucide-react";
import { sectorData, TOTALS, allPoints } from "../manifestoData";
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip,
  Treemap, Cell,
  ScatterChart, Scatter, XAxis, YAxis, ZAxis,
  LabelList,
} from "recharts";

const sans  = '"Inter Tight", sans-serif';
const serif = '"Source Serif 4", serif';
const mono  = '"IBM Plex Mono", monospace';
const dark  = "#121212";
const gray  = "#6b6b6b";
const border = "#d9d7d2";
const admkColor = "#547c5b";
const dmkColor  = "#c94d48";
const tvkColor  = "#E5A000";

const topicIcons: Record<string, React.ReactNode> = {
  "Governance":             <Landmark size={14} strokeWidth={1.5} />,
  "Social Justice":         <Scale size={14} strokeWidth={1.5} />,
  "Welfare & Cash Transfer":<HandCoins size={14} strokeWidth={1.5} />,
  "Education":              <GraduationCap size={14} strokeWidth={1.5} />,
  "Employment / Jobs":      <Briefcase size={14} strokeWidth={1.5} />,
  "Arts & Culture":         <Palette size={14} strokeWidth={1.5} />,
  "Infrastructure":         <HardHat size={14} strokeWidth={1.5} />,
  "Industry & Investment":  <Factory size={14} strokeWidth={1.5} />,
  "Agriculture":            <Wheat size={14} strokeWidth={1.5} />,
  "Women & Gender":         <Users size={14} strokeWidth={1.5} />,
  "Youth":                  <TrendingUp size={14} strokeWidth={1.5} />,
  "Other":                  <MoreHorizontal size={14} strokeWidth={1.5} />,
};

// ── View modes ────────────────────────────────────────────────────────────

type ViewMode = "treemap" | "heatmap" | "radial" | "bubble";

// ── Data prep ─────────────────────────────────────────────────────────────

// Treemap: each party gets its own tile per theme
function buildTreemapData() {
  return Object.entries(sectorData).map(([name, d]) => ({
    name,
    admk: d.admk, dmk: d.dmk, tvk: d.tvk,
    size: d.admk + d.dmk + d.tvk,
  }));
}

// Heatmap: row = theme, col = party, cell = count
function buildHeatmapData() {
  const maxVal = Math.max(
    ...Object.values(sectorData).flatMap(d => [d.admk, d.dmk, d.tvk])
  );
  return { rows: Object.entries(sectorData), maxVal };
}

// Radial: one radial chart per party showing theme breakdown
function buildRadialData(party: "admk" | "dmk" | "tvk") {
  const total = TOTALS[party];
  return Object.entries(sectorData)
    .filter(([, d]) => d[party] > 0)
    .sort((a, b) => b[1][party] - a[1][party])
    .map(([name, d], i) => ({
      name,
      value: d[party],
      pct: total > 0 ? Math.round((d[party] / total) * 100) : 0,
      fill: `hsl(${(i * 360) / 12}, 55%, 42%)`,
    }));
}

// Bubble: x=ADMK count, y=DMK count, z=TVK count, label=theme
function buildBubbleData() {
  return Object.entries(sectorData).map(([name, d]) => ({
    name,
    admk: d.admk,
    dmk:  d.dmk,
    tvk:  d.tvk,
  }));
}

// Feasibility scatter: x=overall feasibility avg, y=count of promises
function buildFeasibilityScatter() {
  return (["admk", "dmk", "tvk"] as const).map(party => {
    const pts = allPoints.filter(p => p.party === party && p.feasibilityScore !== null);
    const avg = pts.length ? pts.reduce((a, b) => a + (b.feasibilityScore ?? 0), 0) / pts.length : 0;
    return {
      party: party.toUpperCase(),
      feasibility: +avg.toFixed(2),
      promises: TOTALS[party],
      color: party === "admk" ? admkColor : party === "dmk" ? dmkColor : tvkColor,
    };
  });
}

// ── Treemap view ──────────────────────────────────────────────────────────

const PARTY_COLORS = { admk: admkColor, dmk: dmkColor, tvk: tvkColor };

interface TreemapContentProps {
  x?: number; y?: number; width?: number; height?: number;
  name?: string; admk?: number; dmk?: number; tvk?: number;
  depth?: number; index?: number;
}

function TreemapContent(props: TreemapContentProps) {
  const { x = 0, y = 0, width = 0, height = 0, name = "", admk = 0, dmk = 0, tvk = 0 } = props;
  const total = admk + dmk + tvk;
  if (width < 10 || height < 10) return null;

  // Split the rect into 3 horizontal bands
  const parties: Array<{ key: "admk" | "dmk" | "tvk"; val: number }> = [
    { key: "admk", val: admk },
    { key: "dmk",  val: dmk  },
    { key: "tvk",  val: tvk  },
  ];
  let cx = x;
  return (
    <g>
      {parties.map(({ key, val }) => {
        const w = total > 0 ? (val / total) * width : 0;
        const rect = <rect key={key} x={cx} y={y} width={w} height={height} fill={PARTY_COLORS[key]} opacity={0.85} />;
        cx += w;
        return rect;
      })}
      <rect x={x} y={y} width={width} height={height} fill="none" stroke="#fff" strokeWidth={2} />
      {height > 28 && width > 50 && (
        <text x={x + 8} y={y + 16} fill="#fff" fontSize={11} fontFamily={sans} fontWeight={700} style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
          {name}
        </text>
      )}
      {height > 44 && width > 50 && (
        <text x={x + 8} y={y + 30} fill="rgba(255,255,255,0.85)" fontSize={10} fontFamily={mono}>
          {total}
        </text>
      )}
    </g>
  );
}

// ── Heatmap view ──────────────────────────────────────────────────────────

function HeatmapView() {
  const { rows, maxVal } = buildHeatmapData();
  const [hovered, setHovered] = useState<{ theme: string; party: string; val: number } | null>(null);

  const cellColor = (val: number, party: "admk" | "dmk" | "tvk") => {
    const intensity = maxVal > 0 ? val / maxVal : 0;
    const base = party === "admk" ? [84, 124, 91] : party === "dmk" ? [201, 77, 72] : [229, 160, 0];
    return `rgba(${base[0]},${base[1]},${base[2]},${0.08 + intensity * 0.92})`;
  };

  return (
    <div style={{ overflowX: "auto" }}>
      {hovered && (
        <div style={{
          marginBottom: 12, padding: "8px 14px", borderRadius: 4,
          background: "#faf8f4", border: `1px solid ${border}`,
          fontFamily: sans, fontSize: 13, color: dark, display: "inline-block",
        }}>
          <strong>{hovered.theme}</strong> · {hovered.party}: <span style={{ fontFamily: mono }}>{hovered.val}</span> promises
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr 1fr", gap: 2 }}>
        {/* Header */}
        <div />
        {(["ADMK", "DMK", "TVK"] as const).map((p, i) => (
          <div key={p} style={{
            padding: "8px 12px", textAlign: "center" as const,
            fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: "1px",
            textTransform: "uppercase" as const,
            color: [admkColor, dmkColor, tvkColor][i],
          }}>{p}</div>
        ))}
        {/* Rows */}
        {rows.map(([theme, d]) => (
          <React.Fragment key={theme}>
            <div style={{
              padding: "10px 0", display: "flex", alignItems: "center", gap: 6,
              fontFamily: sans, fontSize: 12, fontWeight: 500, color: dark,
              borderBottom: `1px solid ${border}`,
            }}>
              <span style={{ color: gray, flexShrink: 0 }}>{topicIcons[theme]}</span>
              {theme}
            </div>
            {(["admk", "dmk", "tvk"] as const).map(party => {
              const val = d[party];
              return (
                <div
                  key={party}
                  onMouseEnter={() => setHovered({ theme, party: party.toUpperCase(), val })}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: cellColor(val, party),
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: mono,
                    fontSize: val > 0 ? 14 : 11,
                    fontWeight: 600,
                    color: val > 0 ? dark : gray,
                    cursor: "default",
                    transition: "opacity 0.15s",
                    border: hovered?.theme === theme && hovered?.party === party.toUpperCase() ? `2px solid ${dark}` : "2px solid transparent",
                    margin: 2,
                    borderBottom: `1px solid ${border}`,
                  }}
                >
                  {val > 0 ? val : "—"}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <p style={{ fontFamily: serif, fontSize: 12, color: gray, fontStyle: "italic", marginTop: 16 }}>
        Cell colour intensity = relative promise count. Counts are scaled from {allPoints.length} enriched points to full manifesto totals.
      </p>
    </div>
  );
}

// ── Radial view ───────────────────────────────────────────────────────────

const RADIAL_TOOLTIP = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; pct: number } }> }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: "#fff", border: `1px solid ${border}`, borderRadius: 4, padding: "8px 12px", fontFamily: sans, fontSize: 12 }}>
      <div style={{ fontWeight: 700, color: dark }}>{d.name}</div>
      <div style={{ color: gray }}>{d.value} promises · {d.pct}%</div>
    </div>
  );
};

function RadialView() {
  const parties = [
    { key: "admk" as const, label: "ADMK", color: admkColor },
    { key: "dmk"  as const, label: "DMK",  color: dmkColor  },
    { key: "tvk"  as const, label: "TVK",  color: tvkColor  },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
      {parties.map(({ key, label, color }) => {
        const data = buildRadialData(key);
        return (
          <div key={key}>
            <div style={{ textAlign: "center" as const, marginBottom: 8 }}>
              <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" as const, color }}>{label}</span>
              <span style={{ fontFamily: mono, fontSize: 11, color: gray, marginLeft: 8 }}>{TOTALS[key]} promises</span>
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="20%" outerRadius="90%" data={data} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={4} label={false} />
                  <Tooltip content={<RADIAL_TOOLTIP />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            {/* Top 4 legend */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {data.slice(0, 4).map(d => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: d.fill, flexShrink: 0 }} />
                  <span style={{ fontFamily: sans, fontSize: 11, color: dark, flex: 1 }}>{d.name}</span>
                  <span style={{ fontFamily: mono, fontSize: 11, color: gray }}>{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Bubble / scatter view ─────────────────────────────────────────────────

const BUBBLE_TOOLTIP = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; admk: number; dmk: number; tvk: number } }> }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: "#fff", border: `1px solid ${border}`, borderRadius: 4, padding: "8px 12px", fontFamily: sans, fontSize: 12 }}>
      <div style={{ fontWeight: 700, color: dark, marginBottom: 4 }}>{d.name}</div>
      <div style={{ color: admkColor }}>ADMK: {d.admk}</div>
      <div style={{ color: dmkColor }}>DMK: {d.dmk}</div>
      <div style={{ color: tvkColor }}>TVK: {d.tvk}</div>
    </div>
  );
};

function BubbleView() {
  const bubbleData = buildBubbleData();

  // Three scatter series: each party on (admk, dmk) plane, bubble size = tvk
  return (
    <div>
      <p style={{ fontFamily: serif, fontSize: 14, color: gray, fontStyle: "italic", margin: "0 0 16px" }}>
        X-axis = ADMK promises · Y-axis = DMK promises · Bubble size = TVK promises per theme.
        Each bubble is a policy theme.
      </p>
      <div style={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: 10 }}>
            <XAxis
              type="number" dataKey="admk" name="ADMK" label={{ value: "ADMK promises", position: "insideBottom", offset: -10, fontFamily: sans, fontSize: 11, fill: gray }}
              tick={{ fontFamily: mono, fontSize: 10, fill: gray }} axisLine={false} tickLine={false}
            />
            <YAxis
              type="number" dataKey="dmk" name="DMK" label={{ value: "DMK promises", angle: -90, position: "insideLeft", offset: 10, fontFamily: sans, fontSize: 11, fill: gray }}
              tick={{ fontFamily: mono, fontSize: 10, fill: gray }} axisLine={false} tickLine={false}
            />
            <ZAxis type="number" dataKey="tvk" range={[40, 800]} name="TVK" />
            <Tooltip content={<BUBBLE_TOOLTIP />} cursor={{ stroke: border }} />
            <Scatter data={bubbleData} fillOpacity={0.65}>
              {bubbleData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.admk > entry.dmk ? admkColor : entry.dmk > entry.admk ? dmkColor : tvkColor}
                />
              ))}
              <LabelList
                dataKey="name"
                position="top"
                offset={8}
                style={{ fontFamily: sans, fontSize: 10, fontWeight: 600, fill: dark, pointerEvents: "none" }}
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Bubble legend */}
      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, marginTop: 8 }}>
        {bubbleData.map(d => (
          <span key={d.name} style={{
            fontFamily: sans, fontSize: 11, color: gray,
            padding: "2px 8px", borderRadius: 12, background: "#f5f3ee",
          }}>
            {d.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Stacked bar card (original, kept for Sectors view) ────────────────────

function SectorCard({ label, data, isLeft }: {
  label: string;
  data: { admk: number; dmk: number; tvk: number };
  isLeft: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const total = data.admk + data.dmk + data.tvk;
  const maxVal = Math.max(data.admk, data.dmk, data.tvk, 1);
  const parties = [
    { name: "ADMK", val: data.admk, color: admkColor },
    { name: "DMK",  val: data.dmk,  color: dmkColor  },
    { name: "TVK",  val: data.tvk,  color: tvkColor  },
  ];

  return (
    <div
      style={{
        padding: "18px 20px 14px",
        borderTop: `1px solid ${border}`,
        borderRight: isLeft ? `1px solid ${border}` : "none",
        transition: "background 0.15s",
        background: hovered ? "#faf8f4" : "transparent",
      }}
      onMouseEnter={() => setHovered(label)}
      onMouseLeave={() => setHovered(null)}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: dark, display: "flex" }}>{topicIcons[label]}</span>
          <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" as const, color: dark }}>
            {label}
          </span>
        </div>
        <span style={{ fontFamily: mono, fontSize: 11, color: gray }}>{total} total</span>
      </div>

      {/* Stacked proportion bar */}
      <div style={{ height: 8, borderRadius: 4, overflow: "hidden", display: "flex", marginBottom: 12 }}>
        {parties.map(p => (
          <div key={p.name} style={{
            width: `${total > 0 ? (p.val / total) * 100 : 0}%`,
            background: p.color,
            minWidth: p.val > 0 ? 2 : 0,
          }} />
        ))}
      </div>

      {/* Party rows */}
      {parties.map(p => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontFamily: sans, fontSize: 10, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase" as const, color: p.color, minWidth: 40 }}>{p.name}</span>
          <div style={{ flex: 1, height: 6, background: "#f2efe8", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${(p.val / maxVal) * 100}%`, height: "100%", background: p.color, borderRadius: 3, minWidth: p.val > 0 ? 2 : 0 }} />
          </div>
          <span style={{ fontFamily: mono, fontSize: 11, color: dark, minWidth: 28, textAlign: "right" as const }}>{p.val}</span>
          <span style={{ fontFamily: sans, fontSize: 10, color: gray, minWidth: 32 }}>{total > 0 ? Math.round((p.val / total) * 100) : 0}%</span>
        </div>
      ))}
    </div>
  );
}

// ── Main CompareGrid ──────────────────────────────────────────────────────

const VIEW_MODES: { key: ViewMode; label: string; desc: string }[] = [
  { key: "heatmap",  label: "Heat Map",   desc: "Intensity grid — which party dominates each theme" },
  { key: "treemap",  label: "Treemap",    desc: "Area = promise count, colour split by party" },
  { key: "radial",   label: "Radial",     desc: "Per-party theme breakdown as radial bars" },
  { key: "bubble",   label: "Bubble",     desc: "ADMK vs DMK count, bubble size = TVK" },
];

export function CompareGrid() {
  const [viewMode, setViewMode] = useState<ViewMode>("heatmap");
  const entries = Object.entries(sectorData);
  const treemapData = buildTreemapData();

  return (
    <div style={{ paddingBottom: 48 }}>
      {/* Header */}
      <div style={{ paddingTop: 48, paddingBottom: 24 }}>
        <h2 style={{ fontFamily: serif, fontSize: 34, fontWeight: 400, color: dark, margin: 0, lineHeight: 1.2 }}>
          Compare promises by sector
        </h2>
        <p style={{ fontFamily: serif, fontSize: 16, lineHeight: "30px", color: "#2e2e2e", marginTop: 4, marginBottom: 0 }}>
          How ADMK, DMK and TVK distribute their {(TOTALS.admk + TOTALS.dmk + TOTALS.tvk).toLocaleString()} promises across policy themes.
          Switch views to explore different angles.
        </p>
      </div>

      {/* View mode switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" as const }}>
        {VIEW_MODES.map(v => (
          <button key={v.key} onClick={() => setViewMode(v.key)} style={{
            fontFamily: sans, fontSize: 12, fontWeight: 500, padding: "8px 16px",
            borderRadius: 4, cursor: "pointer",
            background: viewMode === v.key ? dark : "transparent",
            color: viewMode === v.key ? "#fff" : dark,
            borderWidth: 1, borderStyle: "solid",
            borderColor: viewMode === v.key ? dark : border,
          }}>
            {v.label}
          </button>
        ))}
        <span style={{ alignSelf: "center", fontFamily: serif, fontSize: 13, color: gray, fontStyle: "italic", marginLeft: 8 }}>
          {VIEW_MODES.find(v => v.key === viewMode)?.desc}
        </span>
      </div>

      {/* Treemap */}
      {viewMode === "treemap" && (
        <div>
          <div style={{ height: 480 }}>
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treemapData}
                dataKey="size"
                aspectRatio={4 / 3}
                content={<TreemapContent />}
              >
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={{ background: "#fff", border: `1px solid ${border}`, borderRadius: 4, padding: "8px 12px", fontFamily: sans, fontSize: 12 }}>
                      <div style={{ fontWeight: 700, color: dark, marginBottom: 4 }}>{d.name}</div>
                      <div style={{ color: admkColor }}>ADMK: {d.admk}</div>
                      <div style={{ color: dmkColor }}>DMK: {d.dmk}</div>
                      <div style={{ color: tvkColor }}>TVK: {d.tvk}</div>
                    </div>
                  );
                }} />
              </Treemap>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
            {[["ADMK", admkColor], ["DMK", dmkColor], ["TVK", tvkColor]].map(([lbl, col]) => (
              <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 2, background: col }} />
                <span style={{ fontFamily: sans, fontSize: 12, color: gray }}>{lbl} share</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Heatmap */}
      {viewMode === "heatmap" && <HeatmapView />}

      {/* Radial */}
      {viewMode === "radial" && <RadialView />}

      {/* Bubble */}
      {viewMode === "bubble" && <BubbleView />}

      {/* Always-visible sector grid below charts */}
      {viewMode === "heatmap" && (
        <div style={{ marginTop: 40, borderTop: `1px solid ${border}` }}>
          <h3 style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase" as const, color: gray, margin: "24px 0 0" }}>
            Detailed breakdown
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", width: "100%", marginTop: 16 }}>
            {entries.map(([label, data], index) => (
              <SectorCard key={label} label={label} data={data} isLeft={index % 2 === 0} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
