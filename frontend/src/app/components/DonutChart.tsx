import React, { useState } from "react";

interface DonutChartProps {
  title: string;
  total: number;
  admk: number;
  dmk: number;
  tvk: number;
  noBorderLeft?: boolean;
  noBorderRight?: boolean;
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const startRad = (startAngle - 90) * Math.PI / 180;
  const endRad = (endAngle - 90) * Math.PI / 180;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

export function DonutChart({ title, total, admk, dmk, tvk, noBorderLeft, noBorderRight }: DonutChartProps) {
  const [hovered, setHovered] = useState<"admk" | "dmk" | "tvk" | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 82;
  const strokeW = 28;

  const admkAngle = (admk / total) * 360;
  const dmkAngle = (dmk / total) * 360;
  const tvkAngle = (tvk / total) * 360;

  const segments: { key: "admk" | "dmk" | "tvk"; label: string; value: number; color: string; start: number; end: number }[] = [
    { key: "admk", label: "ADMK", value: admk, color: "#547c5b", start: 0, end: admkAngle },
    { key: "dmk", label: "DMK", value: dmk, color: "#c94d48", start: admkAngle, end: admkAngle + dmkAngle },
    { key: "tvk", label: "TVK", value: tvk, color: "#E5A000", start: admkAngle + dmkAngle, end: admkAngle + dmkAngle + tvkAngle },
  ];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const hoveredSegment = hovered ? segments.find(s => s.key === hovered) : null;

  return (
    <div style={{
      background: "#fff", padding: "16px", flex: 1
    }}>
      <p style={{ fontFamily: '"Inter Tight", sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: "1.56px", textTransform: "uppercase", color: "#6b6b6b", marginBottom: 8 }}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "relative", width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} onMouseMove={handleMouseMove}>
            {segments.map(seg => (
              <path
                key={seg.key}
                d={describeArc(cx, cy, r, seg.start, Math.min(seg.end, seg.start + 359.99))}
                fill="none"
                stroke={seg.color}
                strokeWidth={hovered === seg.key ? strokeW + 4 : strokeW}
                strokeLinecap="butt"
                style={{ cursor: "pointer", transition: "stroke-width 0.2s" }}
                onMouseEnter={() => setHovered(seg.key)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <span style={{ fontFamily: '"Source Serif 4", serif', fontWeight: 500, fontSize: 40, color: "#a16749", lineHeight: 1 }}>{total}</span>
            <span style={{ fontFamily: '"Inter Tight", sans-serif', fontSize: 12, color: "#6b6b6b", marginTop: 4 }}>across {segments.filter(s => s.value > 0).length} parties</span>
          </div>
          {hovered && hoveredSegment && (
            <div style={{
              position: "absolute",
              left: mousePos.x + 12,
              top: mousePos.y - 36,
              background: "#fff",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: hoveredSegment.color,
              borderRadius: 6,
              padding: "6px 12px",
              pointerEvents: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              whiteSpace: "nowrap",
              zIndex: 10,
            }}>
              <span style={{ fontFamily: '"Inter Tight", sans-serif', fontWeight: 600, fontSize: 12, color: hoveredSegment.color }}>{hoveredSegment.label}</span>
              <span style={{ fontFamily: '"Source Serif 4", serif', fontWeight: 600, fontSize: 14, color: "#0a0a0a", marginLeft: 8 }}>{hoveredSegment.value}</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 56, marginTop: 16 }}>
          {[
            { label: "ADMK", value: admk, color: "#547c5b" },
            { label: "DMK", value: dmk, color: "#c94d48" },
            { label: "TVK", value: tvk, color: "#E5A000" },
          ].map(p => (
            <div key={p.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontFamily: '"Source Serif 4", serif', fontWeight: 600, fontSize: 20, color: p.color }}>{p.value}</span>
              <span style={{ fontFamily: '"Inter Tight", sans-serif', fontWeight: 500, fontSize: 12, color: "#0a0a0a" }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}