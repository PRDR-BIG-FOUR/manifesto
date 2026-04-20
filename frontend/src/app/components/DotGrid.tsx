import React from "react";
import { TOTALS, GRAND_TOTAL } from "../manifestoData";

const admkColor = "#547c5b";
const dmkColor  = "#c94d48";
const tvkColor  = "#E5A000";

export function DotGrid() {
  const cols = 44;
  const totalDots = GRAND_TOTAL;
  const admkCount = TOTALS.admk;
  const dmkCount  = TOTALS.dmk;
  const rects: React.ReactElement[] = [];

  for (let i = 0; i < totalDots; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * 8;
    const y = row * 8;
    let fill: string;
    if (i < admkCount) fill = admkColor;
    else if (i < admkCount + dmkCount) fill = dmkColor;
    else fill = tvkColor;
    rects.push(<rect key={i} x={x} y={y} width={6} height={6} fill={fill} />);
  }

  const totalRows = Math.ceil(totalDots / cols);
  const svgHeight = totalRows * 8;

  return (
    <svg width="352" height={svgHeight} style={{ display: "block" }}>
      {rects}
    </svg>
  );
}
