// MarketingFunnelVisual.jsx
import React from "react";

/**
 * แบบตามภาพ:
 * - TOFU:   เมกะโฟน (ซ้าย)  / โซเชียลบนมือถือ (ขวา)
 * - MOFU:   เป้ายิงแดง (ซ้าย) / การวิเคราะห์บนมือถือ (ขวา)
 * - BOFU:   เหรียญ (ซ้าย) / รถเข็น+SALE (ขวา) และ badge ไอคอนกราฟเล็กภายในก้นกรวย
 *
 * ปรับได้:
 * - iconLeft/iconRight/badgeInside: ใส่ URL หรือ dataURI
 * - bofuFlatBase: true = ฐาน BOFU เป็นเส้นตรง, false = ปลายแหลม (ค่าเริ่มต้นภาพตัวอย่าง = false)
 */

export default function MarketingFunnelVisual({
  width = 980,
  gap = 26,
  bofuFlatBase = false,
  icons = {
    TOFU: {
      left: "https://placehold.co/120x120/1d8c91/ffffff.png?text=📢",
      right: "https://placehold.co/120x120/1d8c91/ffffff.png?text=📱",
    },
    MOFU: {
      left: "https://placehold.co/120x120/1d8c91/ffffff.png?text=🎯",
      right: "https://placehold.co/120x120/1d8c91/ffffff.png?text=📈",
    },
    BOFU: {
      left: "https://placehold.co/120x120/1d8c91/ffffff.png?text=💰",
      right: "https://placehold.co/120x120/1d8c91/ffffff.png?text=🛒",
      badge: "https://placehold.co/70x70/1d8c91/ffffff.png?text=📊", // ไอคอนเล็กวางในก้นกรวย
    },
  },
  labels = {
    TOFU: { title: "TOFU", lines: ["Top of Funnel:", "VDOs / Social Media"] },
    MOFU: { title: "MOFU", lines: ["Middle of Funnel:", "White Papers /", "Case Studies"] },
    BOFU: { title: "BOFU", lines: ["Bottom of Funnel", "Incentives and", "Offers / Sales"] },
  },
}) {
  // สัดส่วนให้เหมือนภาพ
  const H = 610; // ความสูงรวมประมาณ
  const layerH = 165;
  const corner = 18;

  const topW   = [0.96, 0.86, 0.66];
  const botW   = [0.76, 0.66, bofuFlatBase ? 0.66 : 0.30]; // BOFU flat base ได้
  const y0     = 10;

  const totalH = 3 * layerH + 2 * gap + y0;

  const mkPoly = (idx, y) => {
    const Wt = width * topW[idx];
    const Wb = width * botW[idx];
    const cx = width / 2;
    const x1 = cx - Wt / 2, x2 = cx + Wt / 2;
    const x3 = cx + Wb / 2, x4 = cx - Wb / 2;

    const yTop = y, yBot = y + layerH;

    if (idx === 2 && !bofuFlatBase) {
      // BOFU ปลายแหลม (เหมือนภาพ)
      const tipX = cx, tipY = yBot + 40;
      return [
        [x1 + corner, yTop],
        [x2, yTop],
        [x3, yBot],
        [tipX, tipY],
        [x4, yBot],
        [x1, yTop + corner],
      ];
    }
    // ชั้นทั่วไป/BOFU flat base
    return [
      [x1 + corner, yTop],
      [x2, yTop],
      [x3, yBot],
      [x4, yBot],
      [x1, yTop + corner],
    ];
  };

  const polyBounds = (poly) => {
    const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
    return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
  };

  const iconBox = (poly, side = "left", maxPct = 0.20) => {
    // กล่องไอคอนซ้าย/ขวา ชิดขอบนิดหน่อย และไม่ล้น (มี clip)
    const { minX, maxX, minY, maxY } = polyBounds(poly);
    const pad = 18;
    const w = maxX - minX - pad * 2;
    const h = maxY - minY - pad * 2;
    const size = Math.min(h * 0.75, w * maxPct, 120);

    const y = (minY + maxY) / 2 - size / 2;
    const x = side === "left" ? (minX + pad) : (maxX - pad - size);
    return { x, y, size };
  };

  const textCenter = (poly) => {
    const { minX, maxX, minY, maxY } = polyBounds(poly);
    return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
  };

  const polyStr = (p) => p.map(([x, y]) => `${x},${y}`).join(" ");

  const grad = (id, c1, c2) => (
    <linearGradient id={id} x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stopColor={c1} />
      <stop offset="100%" stopColor={c2} />
    </linearGradient>
  );

  const layers = [
    { id: "TOFU",  fill: "url(#g1)", shadow: "#0a1b2f", brighten: 1.0 },
    { id: "MOFU",  fill: "url(#g2)", shadow: "#0a1b2f", brighten: 1.0 },
    { id: "BOFU",  fill: "url(#g3)", shadow: "#0a1b2f", brighten: 1.0 },
  ];

  return (
    <svg
      width={width}
      height={Math.max(totalH, H)}
      viewBox={`0 0 ${width} ${Math.max(totalH, H)}`}
      style={{ display: "block", background: "transparent", fontFamily: "Inter, system-ui, sans-serif" }}
      role="img"
      aria-label="Marketing Funnel"
    >
      <defs>
        {grad("g1", "#2FA4FF", "#2898F0")}
        {grad("g2", "#22C7C1", "#17B4AD")}
        {grad("g3", "#1D8C91", "#157680")}

        <filter id="soft" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.28" />
        </filter>
      </defs>

      {layers.map((L, i) => {
        const y = y0 + i * (layerH + gap);
        const poly = mkPoly(i, y);
        const clipId = `clip-${i}`;
        const leftBox  = iconBox(poly, "left");
        const rightBox = iconBox(poly, "right");
        const textPos  = textCenter(poly);

        return (
          <g key={L.id} filter="url(#soft)">
            <clipPath id={clipId}><polygon points={polyStr(poly)} /></clipPath>
            <polygon points={polyStr(poly)} fill={L.fill} />

            {/* ไอคอนซ้าย/ขวา (กันล้นด้วย clipPath) */}
            <image href={icons[L.id].left}  x={leftBox.x}  y={leftBox.y}  width={leftBox.size}  height={leftBox.size}  preserveAspectRatio="xMidYMid meet" clipPath={`url(#${clipId})`} />
            <image href={icons[L.id].right} x={rightBox.x} y={rightBox.y} width={rightBox.size} height={rightBox.size} preserveAspectRatio="xMidYMid meet" clipPath={`url(#${clipId})`} />

            {/* BOFU: badge ไอคอนเล็กวางที่ก้นกรวย */}
            {L.id === "BOFU" && icons.BOFU.badge && (
              <image
                href={icons.BOFU.badge}
                width={70}
                height={70}
                x={textPos.x - 35}
                y={bofuFlatBase ? (y + layerH - 80) : (y + layerH + 10)}
                preserveAspectRatio="xMidYMid meet"
                clipPath={`url(#${clipId})`}
              />
            )}

            {/* ข้อความกึ่งกลาง */}
            <g textAnchor="middle" dominantBaseline="middle" fill="#fff">
              <text x={textPos.x} y={textPos.y - 28} fontSize="42" fontWeight="800" letterSpacing="0.6"> {labels[L.id].title} </text>
              {labels[L.id].lines.map((line, idx) => (
                <text key={idx} x={textPos.x} y={textPos.y + idx * 26} fontSize="22" opacity="0.95" fontWeight={600}>
                  {line}
                </text>
              ))}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
