import React from "react";

type Stage = "TOFU" | "MOFU" | "BOFU";
type IconPair = { left?: string; right?: string; badge?: string };
type Labels = Record<Stage, { title: string; lines: string[] }>;

type Props = {
  width?: number;
  gap?: number;
  bofuFlatBase?: boolean;              // true = ฐาน BOFU เส้นตรง
  border?: string;                     // สีเส้นขอบเบา ๆ
  icons?: Partial<Record<Stage, IconPair>>;
  labels?: Labels;
  gradients?: Partial<Record<Stage, [string, string]>>;
};

const FALLBACK = {
  TOFU: { left: "data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='#fff'/><stop offset='1' stop-color='#ff5252'/></linearGradient></defs><path d='M12 62L92 40v40z' fill='url(#g)' stroke='#c7c7c7' stroke-width='4'/><rect x='92' y='50' width='12' height='20' rx='2' fill='#2a2a2a'/></svg>`) ,
          right:"data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect x='30' y='10' rx='12' width='60' height='100' fill='#5ab1ff'/><circle cx='60' cy='46' r='16' fill='#fff'/><polygon points='56,38 74,46 56,54' fill='#ff3d3d'/></svg>`)},
  MOFU:{ left: "data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><circle cx='60' cy='60' r='44' fill='#ff6b6b'/><circle cx='60' cy='60' r='28' fill='#fff'/><circle cx='60' cy='60' r='12' fill='#ff6b6b'/></svg>`),
          right:"data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect x='30' y='10' rx='12' width='60' height='100' fill='#25c8c0'/><rect x='42' y='72' width='10' height='18' rx='2' fill='#0b7e74'/><rect x='58' y='58' width='10' height='32' rx='2' fill='#0b7e74'/><rect x='74' y='44' width='10' height='46' rx='2' fill='#0b7e74'/></svg>`)},
  BOFU:{ left: "data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><circle cx='60' cy='60' r='44' fill='#ffc24b' stroke='#e2a420' stroke-width='6'/><text x='60' y='74' text-anchor='middle' font-size='40' font-family='Arial' fill='#915f00'>$</text></svg>`),
          right:"data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 120'><rect x='28' y='46' width='90' height='34' rx='6' fill='#58a9ff'/><polygon points='118,46 150,46 138,64 118,64' fill='#ff6666'/><circle cx='50' cy='90' r='10' fill='#2c3e50'/><circle cx='98' cy='90' r='10' fill='#2c3e50'/></svg>`),
          badge:"data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect x='24' y='70' width='16' height='30' fill='#2fd06e'/><rect x='50' y='56' width='16' height='44' fill='#2fd06e'/><rect x='76' y='36' width='16' height='64' fill='#2fd06e'/><path d='M24 40 C44 24,64 20,96 30' stroke='#f7b733' stroke-width='8' fill='none'/></svg>`)}
};

const DEFAULT_LABELS: Labels = {
  TOFU: { title: "TOFU 30%", lines: ["งบ/วัน: 0.00 ฿"] },
  MOFU: { title: "MOFU 40%", lines: ["งบ/วัน: 0.00 ฿"] },
  BOFU: { title: "BOFU 30%", lines: ["งบ/วัน: 0.00 ฿"] },
};

const DEFAULT_GRADIENTS: Required<Props["gradients"]> = {
  TOFU: ["#2FA4FF", "#2898F0"],
  MOFU: ["#22C7C1", "#17B4AD"],
  BOFU: ["#1D8C91", "#157680"],
};

export default function ProFunnel({
  width = 1100,
  gap = 28,
  bofuFlatBase = true,
  border = "rgba(255,255,255,.08)",
  icons = {},
  labels = DEFAULT_LABELS,
  gradients = DEFAULT_GRADIENTS,
}: Props) {
  // สัดส่วนมืออาชีพ: มุม/องศาคงที่ทุกชั้น
  const H = 620;
  const layerH = 150;
  const radius = 16;
  const chamfer = 34;          // มุมบากซ้าย
  const sideSlope = 0.115;     // ความชันด้านขวา (~6.5°)
  const startY = 10;

  // ความกว้าง top/bottom แบบเสถียร (BOFU ฐานตรง)
  const topW  = [0.94, 0.86, 0.78];
  const botW  = [0.78, 0.70, bofuFlatBase ? 0.78 : 0.46];

  const totalH = 3 * layerH + 2 * gap + startY;

  // วาดด้วย polygon (มุมบากซ้าย + โค้งปลอม)
  const poly = (i: number, y: number) => {
    const Wt = width * topW[i];
    const Wb = width * botW[i];
    const cx = width / 2;

    const leftTop  = cx - Wt / 2;
    const rightTop = cx + Wt / 2;

    // ด้านล่างขยับเข้าเล็กน้อย
    const leftBot  = cx - Wb / 2;
    const rightBot = cx + Wb / 2;

    const yTop = y;
    const yBot = y + layerH;

    // จุด
    const pts: [number, number][] = [
      [leftTop + chamfer, yTop],                         // มุมบากซ้ายบน
      [rightTop - radius, yTop],                         // ขอบบนขวา (เว้น radius)
      [rightBot, yBot],                                  // มุมขวาล่าง
      [leftBot + radius, yBot],                          // ขอบล่างซ้าย (เว้น radius)
      [leftTop, yTop + chamfer],                         // มุมบากซ้ายล่าง
    ];

    // ถ้า BOFU ไม่ให้ฐานตรง → ทำปลายแหลมกลาง
    if (i === 2 && !bofuFlatBase) {
      const tipX = cx, tipY = yBot + 42;
      pts.splice(3, 0, [tipX, tipY]);
    }

    return pts;
  };

  const toStr = (p: [number, number][]) => p.map(([x, y]) => `${x},${y}`).join(" ");
  const bounds = (p: [number, number][]) => {
    const xs = p.map(v => v[0]), ys = p.map(v => v[1]);
    return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
  };
  const center = (p: [number, number][]) => {
    const b = bounds(p); return { x: (b.minX + b.maxX)/2, y: (b.minY + b.maxY)/2 };
  };
  const iconBox = (p: [number, number][], side:"left"|"right", pct=0.20) => {
    const b = bounds(p);
    const pad = 20, w=b.maxX-b.minX-pad*2, h=b.maxY-b.minY-pad*2;
    const s = Math.min(h*0.72, w*pct, 110);
    const y = (b.minY + b.maxY)/2 - s/2;
    const x = side === "left" ? (b.minX + pad) : (b.maxX - pad - s);
    return { x, y, s };
  };

  const STAGES: Stage[] = ["TOFU","MOFU","BOFU"];
  const layers = STAGES.map((id, i) => {
    const y = startY + i * (layerH + gap);
    const pts = poly(i, y);
    const b = bounds(pts);
    const cx = (b.minX + b.maxX)/2, cy=(b.minY + b.maxY)/2;

    return {
      id, y, pts,
      clipId: `pf-clip-${i}`,
      gradId: `pf-grad-${i}`,
      text: { x: cx, y: cy },
      left:  iconBox(pts, "left"),
      right: iconBox(pts, "right"),
      grad: (gradients[id] ?? DEFAULT_GRADIENTS[id])!,
      icons: icons[id] ?? {},
    };
  });

  const iconSrc = (stage: Stage, side: keyof IconPair): string => {
    const custom = icons?.[stage]?.[side];
    if (custom && custom.trim()) return custom;
    // fallback
    if (stage === "TOFU") return side === "left" ? FALLBACK.TOFU.left : FALLBACK.TOFU.right;
    if (stage === "MOFU") return side === "left" ? FALLBACK.MOFU.left : FALLBACK.MOFU.right;
    if (stage === "BOFU") {
      if (side === "badge") return FALLBACK.BOFU.badge;
      return side === "left" ? FALLBACK.BOFU.left : FALLBACK.BOFU.right;
    }
    return FALLBACK.TOFU.left;
  };

  return (
    <svg
      width={width}
      height={Math.max(totalH, H)}
      viewBox={`0 0 ${width} ${Math.max(totalH, H)}`}
      style={{ display:"block", background:"transparent", fontFamily:"Inter, system-ui, sans-serif" }}
      role="img"
      aria-label="Budget Funnel"
    >
      <defs>
        {layers.map(l => (
          <linearGradient key={l.gradId} id={l.gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={l.grad[0]} />
            <stop offset="100%" stopColor={l.grad[1]} />
          </linearGradient>
        ))}
        {/* เงานอก + ขอบเบา ๆ */}
        <filter id="pf-soft" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.28" />
        </filter>
        {/* เงาด้านในนุ่ม ๆ เพื่อความพรีเมียม */}
        <filter id="pf-inner" x="-50%" y="-50%" width="200%" height="200%">
          <feOffset dx="0" dy="2"/>
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="arithmetic" k2="1" k3="-0.8"/>
        </filter>
      </defs>

      {layers.map((L, idx) => (
        <g key={L.id} filter="url(#pf-soft)">
          <clipPath id={L.clipId}><polygon points={toStr(L.pts)} /></clipPath>

          {/* shape */}
          <polygon points={toStr(L.pts)} fill={`url(#${L.gradId})`} filter="url(#pf-inner)" stroke={border} strokeWidth={1} />

          {/* icons */}
          <image href={iconSrc(L.id,"left")}  x={L.left.x}  y={L.left.y}  width={L.left.s}  height={L.left.s}
                 preserveAspectRatio="xMidYMid meet" clipPath={`url(#${L.clipId})`} />
          <image href={iconSrc(L.id,"right")} x={L.right.x} y={L.right.y} width={L.right.s} height={L.right.s}
                 preserveAspectRatio="xMidYMid meet" clipPath={`url(#${L.clipId})`} />

          {/* BOFU badge เล็กที่ก้นกรวย */}
          {L.id==="BOFU" && (
            <image href={iconSrc("BOFU","badge")} width={62} height={62}
                   x={L.text.x - 31} y={bofuFlatBase ? (L.y + layerH - 76) : (L.y + layerH + 8)}
                   preserveAspectRatio="xMidYMid meet" clipPath={`url(#${L.clipId})`} />
          )}

          {/* texts */}
          <g textAnchor="middle" dominantBaseline="middle" fill="#fff">
            <text x={L.text.x} y={L.text.y-22} fontSize="40" fontWeight={800} letterSpacing=".5">{labels[L.id].title}</text>
            {labels[L.id].lines.map((line, i)=>
              <text key={i} x={L.text.x} y={L.text.y + i*24} fontSize="20" fontWeight={700} fill="rgba(255,255,255,.92)">
                {line}
              </text>
            )}
          </g>
        </g>
      ))}
    </svg>
  );
}