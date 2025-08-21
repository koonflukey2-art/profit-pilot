// src/components/profit-pilot/MarketingFunnelVisual.tsx
import React from "react";

type StageKey = "TOFU" | "MOFU" | "BOFU";

type IconPair = {
  left?: string;
  right?: string;
  badge?: string;
};

type Labels = {
  [k in StageKey]: { title: string; lines: string[] };
};

type Props = {
  width?: number;
  gap?: number;
  bofuFlatBase?: boolean;
  icons?: { TOFU?: IconPair; MOFU?: IconPair; BOFU?: IconPair };
  labels?: Labels;
  gradients?: {
    TOFU?: [string, string];
    MOFU?: [string, string];
    BOFU?: [string, string];
  };
};

const FALLBACKS = {
  megaphone: "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80"><g fill="#F25C5C"><path d="M65 20 L65 60 L25 75 L25 5 Z" /><rect x="5" y="30" width="20" height="20" rx="4" /></g><circle cx="65" cy="40" r="15" fill="white" stroke="#F25C5C" stroke-width="8" /></svg>`),
  phoneSocial: "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><g transform="translate(10, 5)"><path d="M82.1,95.5H17.9c-4.4,0-8-3.6-8-8V12.5c0-4.4,3.6-8,8-8h64.3c4.4,0,8,3.6,8,8v75.1C90.1,91.9,86.5,95.5,82.1,95.5z" fill="#70D6FF"/><path fill="#F25C5C" d="M42.5 42.5 L65 52.5 L42.5 62.5 Z" /><path d="M95 10 A 5 5 0 0 1 100 15 L 100 25 A 5 5 0 0 1 95 30 Z" fill="#70D6FF"/><path d="M92 7 A 3 3 0 0 1 95 10 L 95 15 A 3 3 0 0 1 92 18 Z" fill="#70D6FF"/></g></svg>`),
  target: "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#F25C5C"/><circle cx="50" cy="50" r="35" fill="white"/><circle cx="50" cy="50" r="25" fill="#F25C5C"/><circle cx="50" cy="50" r="15" fill="white"/><path d="M60 40 L90 25 L75 50 Z" fill="#F25C5C" transform="rotate(10, 75, 40)"/></svg>`),
  analyticsPhone: "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><g transform="translate(10,0)"><rect x="10" y="5" width="80" height="110" rx="15" fill="#F5F5F5" /><g transform="translate(25, 20)"><g><path d="M40 25 A 20 20 0 1 1 20 5" fill="#1EBFC2" /><path d="M40 25 A 20 20 0 0 1 58 15" fill="#70D6FF" /><path d="M40,25 L20,5 L58,15 Z" fill="none" /></g><g transform="translate(0, 40)"><path d="M40 25 A 20 20 0 1 0 20 5" fill="#70D6FF" /><path d="M40 25 A 20 20 0 0 0 58 15" fill="#1EBFC2" /><path d="M40,25 L20,5 L58,15 Z" fill="none" /></g></g><path d="M60 50 L 75 35 L 85 40 L 75 60 L 85 70" stroke="#70D6FF" stroke-width="4" fill="none" /><circle cx="60" cy="50" r="5" fill="#70D6FF" /><circle cx="75" cy="35" r="5" fill="#70D6FF" /><circle cx="85" cy="40" r="5" fill="#70D6FF" /><circle cx="75" cy="60" r="5" fill="#70D6FF" /><circle cx="85" cy="70" r="5" fill="#70D6FF" /><rect x="65" y="80" width="25" height="15" rx="5" fill="#70D6FF" /></g></svg>`),
  coin: "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#F6C455" /><text x="50" y="68" font-size="60" font-family="Arial, sans-serif" fill="#D96A00" text-anchor="middle" font-weight="bold">$</text></svg>`),
  cartSale: "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100"><g transform="translate(5,10)"><rect x="10" y="30" width="100" height="40" rx="8" fill="#70D6FF" /><circle cx="35" cy="80" r="10" fill="#70D6FF"/><circle cx="85" cy="80" r="10" fill="#70D6FF"/><rect x="25" y="40" width="20" height="20" fill="#1EBFC2" /><rect x="50" y="40" width="20" height="20" fill="#1EBFC2" /><rect x="75" y="40" width="20" height="20" fill="#1EBFC2" /><rect x="95" y="20" width="40" height="25" rx="5" fill="#F25C5C" /><text x="115" y="38" font-size="18" fill="white" font-weight="bold" text-anchor="middle">SALE</text></g></svg>`),
  growthBars: "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g transform="translate(5,0)"><rect x="10" y="60" width="15" height="30" fill="#F6C455" /><rect x="30" y="40" width="15" height="50" fill="#F6C455" /><rect x="50" y="20" width="15" height="70" fill="#F6C455" /><rect x="70" y="0" width="15" height="90" fill="#F6C455" /></g></svg>`),
};

const defaultLabels: Labels = {
  TOFU: { title: "TOFU", lines: ["Top of Funnel:", "VDOs / Social Media"] },
  MOFU: { title: "MOFU", lines: ["Middle of Funnel:", "White Papers /", "Case Studies"] },
  BOFU: { title: "BOFU", lines: ["Bottom of Funnel", "Incentives and", "Offers / Sales"] },
};

const defaultGradients = {
  TOFU: ["#3FAAFD", "#3FAAFD"] as [string, string],
  MOFU: ["#1EBFC2", "#1EBFC2"] as [string, string],
  BOFU: ["#16BA84", "#16BA84"] as [string, string],
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
  
  const points = [
    { p: "5,140 95,140 90,105 10,105", color: gradients.TOFU || defaultGradients.TOFU },
    { p: "10,95 90,95 85,60 15,60", color: gradients.MOFU || defaultGradients.MOFU },
    { p: "15,55 85,55 65,10 35,10", color: gradients.BOFU || defaultGradients.BOFU },
  ];
  
  const iconPositions = {
    TOFU: { left: {x: 8, y:112, s:30}, right: {x: 72, y:112, s:30} },
    MOFU: { left: {x: 12, y:68, s:30}, right: {x: 72, y:68, s:30} },
    BOFU: { left: {x: 17, y:23, s:30}, right: {x: 72, y:23, s:30}, badge: {x: 43, y: 15, s:15} }
  };
  
  const labelPositions = {
    TOFU: { title: {y: 130}, line1: {y:122}, line2: {y:117} },
    MOFU: { title: {y: 87}, line1: {y:79}, line2: {y:74} },
    BOFU: { title: {y: 45}, line1: {y:37}, line2: {y:32} },
  };

  const iconSrcFor = (stage: StageKey, side: "left" | "right" | "badge") => {
    const pair = icons?.[stage] || {};
    const src = (pair as any)?.[side] as string | undefined;
    if (src && src.trim()) return src;

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
      height={width * 1.5}
      viewBox="0 0 100 150"
      style={{ display: "block", background: "transparent", fontFamily: "Inter, system-ui, sans-serif" }}
      role="img"
      aria-label="Marketing Funnel"
    >
      <defs>
        {points.map((layer, i) => (
           <linearGradient key={`grad-${i}`} id={`grad-${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={layer.color[0]} />
            <stop offset="100%" stopColor={layer.color[1]} />
          </linearGradient>
        ))}
      </defs>

      {points.map((layer, i) => (
        <polygon key={i} points={layer.p} fill={`url(#grad-${i})`} />
      ))}
      
      {Object.entries(labels).map(([stage, content]) => {
         const s = stage as StageKey;
         const lPos = labelPositions[s];
         const iPos = iconPositions[s];
         return (
            <g key={stage}>
                <text x="50" y={lPos.title.y} fill="white" fontSize="2" fontWeight="bold" textAnchor="middle">{content.title}</text>
                <text x="50" y={lPos.line1.y} fill="white" fontSize="1" textAnchor="middle">{content.lines[0]}</text>
                {content.lines[1] && <text x="50" y={lPos.line2.y} fill="white" fontSize="1" textAnchor="middle">{content.lines[1]}</text>}
                
                <image href={iconSrcFor(s, "left")} x={iPos.left.x} y={iPos.left.y} height={iPos.left.s} width={iPos.left.s} />
                <image href={iconSrcFor(s, "right")} x={iPos.right.x} y={iPos.right.y} height={iPos.right.s} width={iPos.right.s} />
                {iPos.badge && <image href={iconSrcFor(s, "badge")} x={iPos.badge.x} y={iPos.badge.y} height={iPos.badge.s} width={iPos.badge.s} />}
            </g>
         )
      })}
    </svg>
  );
}
