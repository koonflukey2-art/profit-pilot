// src/components/profit-pilot/ProFunnel.tsx
import React from "react";

type Stage = "TOFU" | "MOFU" | "BOFU";

type IconPair = { left?: string; right?: string; badge?: string };
type Labels = Record<Stage, { title: string; lines: string[] }>;

type Props = {
  width?: number;
  gap?: number;
  bofuFlatBase?: boolean; // true = BOFU ฐานตรง
  border?: string; // สีเส้นขอบ
  icons?: Partial<Record<Stage, IconPair>>;
  labels?: Labels;
  gradients?: Partial<Record<Stage, [string, string]>>;
};

const FallbackIcons: Record<Stage, IconPair> = {
  TOFU: {
    left: "📢",
    right: "📱❤️",
  },
  MOFU: {
    left: "🎯",
    right: "📊",
  },
  BOFU: {
    left: "💰",
    right: "🛒",
    badge: "SALE",
  },
};

const FallbackLabels: Labels = {
  TOFU: {
    title: "TOFU",
    lines: ["Top of Funnel:", "VDOs / Social Media"],
  },
  MOFU: {
    title: "MOFU",
    lines: ["Middle of Funnel:", "White Papers / Case Studies"],
  },
  BOFU: {
    title: "BOFU",
    lines: ["Bottom of Funnel", "Incentives and Offers / Sales"],
  },
};

const FallbackGradients: Record<Stage, [string, string]> = {
  TOFU: ["#38bdf8", "#0ea5e9"], // blue
  MOFU: ["#2dd4bf", "#14b8a6"], // teal
  BOFU: ["#34d399", "#10b981"], // green
};

export default function ProFunnel({
  width = 400,
  gap = 16,
  bofuFlatBase = false,
  border = "#0f172a",
  icons = {},
  labels = FallbackLabels,
  gradients = {},
}: Props) {
  const mergedIcons = { ...FallbackIcons, ...icons };
  const mergedGradients = { ...FallbackGradients, ...gradients };

  const stages: Stage[] = ["TOFU", "MOFU", "BOFU"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap,
        width,
        margin: "0 auto",
      }}
    >
      {stages.map((stage, idx) => {
        const isLast = idx === stages.length - 1;
        const grad = mergedGradients[stage];
        const label = labels[stage];
        const icon = mergedIcons[stage];

        return (
          <div
            key={stage}
            style={{
              position: "relative",
              background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
              color: "white",
              padding: "32px 24px",
              clipPath: isLast && bofuFlatBase
                ? "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
                : "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
              border: `2px solid ${border}`,
              borderRadius: 12,
              textAlign: "center",
              fontFamily: "sans-serif",
            }}
          >
            {/* ไอคอนซ้าย */}
            {icon.left && (
              <div
                style={{
                  position: "absolute",
                  left: -40,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 28,
                }}
              >
                {icon.left}
              </div>
            )}
            {/* ไอคอนขวา */}
            {icon.right && (
              <div
                style={{
                  position: "absolute",
                  right: -40,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 28,
                }}
              >
                {icon.right}
              </div>
            )}
            {/* Badge */}
            {icon.badge && (
              <span
                style={{
                  position: "absolute",
                  right: -24,
                  top: -10,
                  background: "red",
                  color: "white",
                  fontSize: 12,
                  padding: "2px 6px",
                  borderRadius: 6,
                  fontWeight: 700,
                }}
              >
                {icon.badge}
              </span>
            )}

            {/* Label text */}
            <div style={{ fontSize: 28, fontWeight: 800 }}>{label.title}</div>
            {label.lines.map((line, i) => (
              <div
                key={i}
                style={{ fontSize: i === 0 ? 16 : 14, opacity: i === 0 ? 0.95 : 0.8 }}
              >
                {line}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
