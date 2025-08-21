
// MarketingFunnelVisual.jsx
import React from "react";

/**
 * MarketingFunnelVisual
 * - ฟันเนล 3 ชั้น: TOFU, MOFU, BOFU (ทรงเหมือนภาพตัวอย่าง)
 * - ไอคอนซ้าย/ขวา วางกึ่งกลางชั้น และกันล้นด้วย clipPath
 * - ข้อความกึ่งกลางแนวตั้ง-แนวนอน
 * - เลือกให้ฐาน BOFU เป็น "เส้นตรง" ได้ (bofuFlatBase)
 * - ปรับไอคอน/ข้อความ/สี ได้ผ่าน props
 */

export default function MarketingFunnelVisual({
  width = 980,
  gap = 26,
  bofuFlatBase = false,
  icons = {
    TOFU: {
      left:  "/assets/icons/megaphone-white-red.png",
      right: "/assets/icons/phone-social.png",
    },
    MOFU: {
      left:  "/assets/icons/target-red.png",
      right: "/assets/icons/analytics-phone.png",
    },
    BOFU: {
      left:  "/assets/icons/coin.png",
      right: "/assets/icons/cart-sale.png",
      badge: "/assets/icons/growth-bars.png", // ไอคอนเล็กวางก้นกรวย (ถ้ามี)
    },
  },
  labels = {
    TOFU: { title: "TOFU 60%", lines: ["งบ/วัน: 0.00 ฿ ฿"] },
    MOFU: { title: "MOFU 30%", lines: ["งบ/วัน: 0.00 ฿ ฿"] },
    BOFU: { title: "BOFU 10%", lines: ["งบ/วัน: 0.00 ฿ ฿"] },
  },
}) {
  // สัดส่วนรูปร่างให้ใกล้เคียงงานจริง
  const layerH = 165;
  const corner = 18;
  const topW = [0.96, 0.86, 0.66];
  const botW = [0.76, 0.66, bofuFlatBase ? 0.66 : 0.30]; // BOFU: เส้นตรงได้
  const yOffset = 10;
  const totalH = 3 * layerH + 2 * gap + yOffset;

  const mkPoly = (idx, y) => {
    const Wt = width * topW[idx];
    const Wb = width * botW[idx];
    const cx = width / 2;
    const x1 = cx - Wt / 2, x2 = cx + Wt / 2;
    const x3 = cx + Wb / 2, x4 = cx - Wb / 2;
    const yTop = y, yBot = y + layerH;

    if (idx === 2 && !bofuFlatBase) {
      // BOFU ปลายแหลม (ตามภาพตัวอย่าง)
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
    // ชั้นทั่วไป หรือ BOFU แบบฐานเส้นตรง
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
    // กล่องไอคอนซ้าย/ขวา—ติดขอบเล็กน้อยและไม่ล้น
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
    { id: "TOFU", fill: "url(#g1)" },
    { id: "MOFU", fill: "url(#g2)" },
    { id: "BOFU", fill: "url(#g3)" },
  ];

  return (
    <svg
      width={width}
      height={Math.max(totalH, 610)}
      viewBox={`0 0 ${width} ${Math.max(totalH, 610)}`}
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
        const y = yOffset + i * (layerH + gap);
        const poly = mkPoly(i, y);
        const clipId = `clip-${i}`;
        const left  = iconBox(poly, "left");
        const right = iconBox(poly, "right");
        const txt   = textCenter(poly);

        return (
          <g key={L.id} filter="url(#soft)">
            <clipPath id={clipId}><polygon points={polyStr(poly)} /></clipPath>
            <polygon points={polyStr(poly)} fill={L.fill} />

            {/* ไอคอนซ้าย/ขวา (กันล้นด้วย clipPath) */}
            <image href={icons[L.id].left}  x={left.x}  y={left.y}  width={left.size}  height={left.size}  preserveAspectRatio="xMidYMid meet" clipPath={`url(#${clipId})`} />
            <image href={icons[L.id].right} x={right.x} y={right.y} width={right.size} height={right.size} preserveAspectRatio="xMidYMid meet" clipPath={`url(#${clipId})`} />

            {/* BOFU: badge เล็กตรงก้นกรวย (ถ้ามี) */}
            {L.id === "BOFU" && icons.BOFU?.badge && (
              <image
                href={icons.BOFU.badge}
                width={70}
                height={70}
                x={txt.x - 35}
                y={bofuFlatBase ? (y + layerH - 80) : (y + layerH + 10)}
                preserveAspectRatio="xMidYMid meet"
                clipPath={`url(#${clipId})`}
              />
            )}

            {/* ข้อความกึ่งกลาง */}
            <g textAnchor="middle" dominantBaseline="middle" fill="#fff">
              <text x={txt.x} y={txt.y - 28} fontSize="42" fontWeight="800" letterSpacing="0.6">
                {labels[L.id].title}
              </text>
              {labels[L.id].lines.map((line, idx) => (
                <text key={idx} x={txt.x} y={txt.y + idx * 26} fontSize="22" opacity="0.95" fontWeight={600}>
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
