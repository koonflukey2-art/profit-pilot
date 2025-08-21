
import React from "react";

type StageKey = "TOFU" | "MOFU" | "BOFU";

type IconPair = {
  left?: string;   // URL หรือ dataURI ของไอคอนซ้าย (optional)
  right?: string;  // URL หรือ dataURI ของไอคอนขวา (optional)
  badge?: string;  // ไอคอนเล็กวางก้นกรวย (ใช้เฉพาะ BOFU) (optional)
};

type Labels = {
  [k in StageKey]: { title: string; lines: string[] };
};

type Props = {
  width?: number;
  gap?: number;
  /** true = BOFU ฐานเส้นตรง, false = ปลายแหลม (ตามงานภาพ) */
  bofuFlatBase?: boolean;
  /** ไอคอนที่มาจากภายนอก (หากว่าง จะใช้ไอคอน fallback ที่ฝังในไฟล์นี้แทน) */
  icons?: { TOFU?: IconPair; MOFU?: IconPair; BOFU?: IconPair };
  /** ข้อความที่แสดงในแต่ละชั้น */
  labels?: Labels;
  /** สีไล่เฉดของแต่ละชั้น (ลำดับ: From → To) */
  gradients?: {
    TOFU?: [string, string];
    MOFU?: [string, string];
    BOFU?: [string, string];
  };
};

const FALLBACKS = {
  // ไอคอน fallback แบบ SVG dataURI ให้แสดงได้ทันที
  megaphone:
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#ff4d4d"/></linearGradient></defs><path d="M10 60 L90 40 L90 80 Z" fill="url(#g)" stroke="#c7c7c7" stroke-width="4"/><rect x="90" y="50" width="10" height="20" rx="2" fill="#2a2a2a"/></svg>`
    ),
  phoneSocial:
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect x="30" y="10" rx="12" width="60" height="100" fill="#4aa3ff"/><circle cx="60" cy="45" r="16" fill="#fff"/><polygon points="56,38 74,45 56,52" fill="#ff4242"/></svg>`
    ),
  target:
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="44" fill="#ff6666"/><circle cx="60" cy="60" r="28" fill="#ffffff"/><circle cx="60" cy="60" r="14" fill="#ff6666"/><polygon points="90,32 112,40 92,52" fill="#b70000"/></svg>`
    ),
  analyticsPhone:
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect x="30" y="10" rx="12" width="60" height="100" fill="#38d4c8"/><rect x="42" y="72" width="8" height="18" rx="2" fill="#0b7e74"/><rect x="58" y="60" width="8" height="30" rx="2" fill="#0b7e74"/><rect x="74" y="48" width="8" height="42" rx="2" fill="#0b7e74"/></svg>`
    ),
  coin:
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="44" fill="#ffc24b" stroke="#e2a420" stroke-width="6"/><text x="60" y="70" text-anchor="middle" font-size="42" font-family="Arial" fill="#9c6d00">$</text></svg>`
    ),
  cartSale:
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120"><rect x="26" y="46" width="90" height="34" rx="6" fill="#49a6ff"/><polygon points="116,46 150,46 140,62 116,62" fill="#ff5a5a"/><circle cx="50" cy="90" r="10" fill="#284b63"/><circle cx="98" cy="90" r="10" fill="#284b63"/></svg>`
    ),
  growthBars:
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect x="20" y="70" width="14" height="30" fill="#2fd06e"/><rect x="46" y="58" width="14" height="42" fill="#2fd06e"/><rect x="72" y="40" width="14" height="60" fill="#2fd06e"/><path d="M20 36 C40 20, 60 16, 90 28" stroke="#f9b233" stroke-width="8" fill="none"/></svg>`
    ),
};

const defaultLabels: Labels = {
  TOFU: { title: "TOFU 60%", lines: ["งบ/วัน: 0.00 ฿ ฿"] },
  MOFU: { title: "MOFU 30%", lines: ["งบ/วัน: 0.00 ฿ ฿"] },
  BOFU: { title: "BOFU 10%", lines: ["งบ/วัน: 0.00 ฿ ฿"] },
};

const defaultGradients = {
  TOFU: ["#2FA4FF", "#2898F0"] as [string, string],
  MOFU: ["#22C7C1", "#17B4AD"] as [string, string],
  BOFU: ["#1D8C91", "#157680"] as [string, string],
};

export default function MarketingFunnelVisual({
  width = 980,
  gap = 26,
  bofuFlatBase = false,
  icons = {},
  labels = defaultLabels,
  gradients = defaultGradients,
}: Props) {
  const layerH = 165;
  const yStart = 10;
  const corner = 18;
  const topW = [0.96, 0.86, 0.66];
  const botW = [0.76, 0.66, bofuFlatBase ? 0.66 : 0.3];
  const totalH = 3 * layerH + 2 * gap + yStart;

  const mkPoly = (idx: number, y: number) => {
    const Wt = width * topW[idx];
    const Wb = width * botW[idx];
    const cx = width / 2;
    const x1 = cx - Wt / 2,
      x2 = cx + Wt / 2;
    const x3 = cx + Wb / 2,
      x4 = cx - Wb / 2;
    const yTop = y,
      yBot = y + layerH;

    if (idx === 2 && !bofuFlatBase) {
      const tipX = cx,
        tipY = yBot + 40;
      return [
        [x1 + corner, yTop],
        [x2, yTop],
        [x3, yBot],
        [tipX, tipY],
        [x4, yBot],
        [x1, yTop + corner],
      ];
    }
    return [
      [x1 + corner, yTop],
      [x2, yTop],
      [x3, yBot],
      [x4, yBot],
      [x1, yTop + corner],
    ];
  };

  const polyStr = (p: number[][]) => p.map(([x, y]) => `${x},${y}`).join(" ");
  const bounds = (p: number[][]) => {
    const xs = p.map((v) => v[0]);
    const ys = p.map((v) => v[1]);
    return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
  };
  const center = (p: number[][]) => {
    const b = bounds(p);
    return { x: (b.minX + b.maxX) / 2, y: (b.minY + b.maxY) / 2 };
  };
  const iconBox = (p: number[][], side: "left" | "right", maxPct = 0.2) => {
    const b = bounds(p);
    const pad = 18;
    const w = b.maxX - b.minX - pad * 2;
    const h = b.maxY - b.minY - pad * 2;
    const size = Math.min(h * 0.75, w * maxPct, 120);
    const y = (b.minY + b.maxY) / 2 - size / 2;
    const x = side === "left" ? b.minX + pad : b.maxX - pad - size;
    return { x, y, size };
  };

  // สร้าง data สำหรับแต่ละชั้น
  const stages: StageKey[] = ["TOFU", "MOFU", "BOFU"];
  const layerMeta = stages.map((id, i) => {
    const y = yStart + i * (layerH + gap);
    const poly = mkPoly(i, y);
    return {
      id,
      y,
      poly,
      clipId: `clip-${i}`,
      text: center(poly),
      left: iconBox(poly, "left"),
      right: iconBox(poly, "right"),
      grad: gradients[id] || defaultGradients[id],
      icons: icons[id] || {},
    };
  });

  // ฟังก์ชันแสดงไอคอน: ถ้าส่ง src มาไม่ได้/ว่าง → ใช้ fallback
  const iconSrcFor = (stage: StageKey, side: "left" | "right" | "badge") => {
    const pair = icons?.[stage] || {};
    const src = (pair as any)?.[side] as string | undefined;
    if (src && src.trim()) return src;

    // เลือก fallback ตาม stage/side
    if (stage === "TOFU") return side === "left" ? FALLBACKS.megaphone : FALLBACKS.phoneSocial;
    if (stage === "MOFU") return side === "left" ? FALLBACKS.target : FALLBACKS.analyticsPhone;
    if (stage === "BOFU") {
      if (side === "left") return FALLBACKS.coin;
      if (side === "right") return FALLBACKS.cartSale;
      return FALLBACKS.growthBars;
    }
    return FALLBACKS.megaphone;
  };

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
        {/* กราดิเอนต์สำหรับแต่ละชั้น */}
        {layerMeta.map(({ id, grad }, idx) => (
          <linearGradient key={id} id={`grad-${idx}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={grad[0]} />
            <stop offset="100%" stopColor={grad[1]} />
          </linearGradient>
        ))}
        <filter id="soft" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.28" />
        </filter>
      </defs>

      {layerMeta.map((L, idx) => (
        <g key={L.id} filter="url(#soft)">
          <clipPath id={L.clipId}>
            <polygon points={polyStr(L.poly)} />
          </clipPath>

          {/* ตัวฟันเนล */}
          <polygon points={polyStr(L.poly)} fill={`url(#grad-${idx})`} />

          {/* ไอคอนซ้าย/ขวา */}
          <image
            href={iconSrcFor(L.id, "left")}
            x={L.left.x}
            y={L.left.y}
            width={L.left.size}
            height={L.left.size}
            preserveAspectRatio="xMidYMid meet"
            clipPath={`url(#${L.clipId})`}
          />
          <image
            href={iconSrcFor(L.id, "right")}
            x={L.right.x}
            y={L.right.y}
            width={L.right.size}
            height={L.right.size}
            preserveAspectRatio="xMidYMid meet"
            clipPath={`url(#${L.clipId})`}
          />

          {/* BOFU: badge เล็กที่ก้นกรวย (ถ้าอยากโชว์) */}
          {L.id === "BOFU" && (
            <image
              href={iconSrcFor("BOFU", "badge")}
              width={70}
              height={70}
              x={L.text.x - 35}
              y={!bofuFlatBase ? L.y + 165 + 10 : L.y + 165 - 80}
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${L.clipId})`}
            />
          )}

          {/* ข้อความกึ่งกลาง */}
          <g textAnchor="middle" dominantBaseline="middle" fill="#fff">
            <text x={L.text.x} y={L.text.y - 28} fontSize="42" fontWeight="800" letterSpacing="0.6">
              {labels[L.id].title}
            </text>
            {labels[L.id].lines.map((line, i) => (
              <text key={i} x={L.text.x} y={L.text.y + i * 26} fontSize="22" opacity={0.95} fontWeight={600}>
                {line}
              </text>
            ))}
          </g>
        </g>
      ))}
    </svg>
  );
}
