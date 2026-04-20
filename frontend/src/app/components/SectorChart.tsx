import React from "react";
import { sectorData, TOTALS } from "../manifestoData";

const admkColor = "#547c5b";
const dmkColor  = "#c94d48";
const tvkColor  = "#E5A000";

const sectorEntries = Object.entries(sectorData);
const maxVal = Math.max(
  ...sectorEntries.flatMap(([, d]) => [d.admk, d.dmk, d.tvk]),
  1,
);
const barScale = 143 / maxVal;

function SectorColumn({ color, label, total, dataKey }: {
  color: string; label: string; total: number; dataKey: "admk" | "dmk" | "tvk";
}) {
  return (
    <div>
      <div style={{
        fontFamily: '"Inter Tight", Söhne, system-ui, sans-serif',
        fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.12em",
        textTransform: "uppercase" as const, color,
        paddingBottom: 6, borderBottomWidth: 2, borderBottomStyle: "solid", borderBottomColor: color,
        marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline",
      }}>
        <span>{label}</span>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: "10px", color: "rgb(107,107,107)", fontWeight: 400 }}>
          n = {total}
        </span>
      </div>
      <svg width="100%" height={sectorEntries.length * 18} viewBox={`0 0 260 ${sectorEntries.length * 18}`} preserveAspectRatio="none" style={{ display: "block" }}>
        {sectorEntries.map(([name, d], i) => {
          const val = d[dataKey];
          const barW = Math.max(val * barScale, val > 0 ? 1.1 : 0.5);
          return (
            <g key={name} transform={`translate(0,${i * 18})`}>
              <text x="0" y="13" style={{ fontSize: "10.5px", fontFamily: '"Inter Tight", Söhne, system-ui, sans-serif', fill: "rgb(26,26,26)" }}>{name}</text>
              <rect x={109.2} y={2} width={barW} height={11} fill={color} opacity={0.9} />
              <text x={109.2 + barW + 3} y={13} style={{ fontSize: "10px", fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fill: "rgb(26,26,26)", fontVariantNumeric: "tabular-nums" }}>{val}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function SectorChart() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
      <SectorColumn color={admkColor} label="ADMK" total={TOTALS.admk} dataKey="admk" />
      <SectorColumn color={dmkColor}  label="DMK"  total={TOTALS.dmk}  dataKey="dmk"  />
      <SectorColumn color={tvkColor}  label="TVK"  total={TOTALS.tvk}  dataKey="tvk"  />
    </div>
  );
}
