import React, { useState } from "react";
import { icon } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebook,
  faGoogle,
  faTiktok,
  faTwitter,
  faMedium,
  faMagic,
} from "@fortawesome/free-brands-svg-icons";
import {
  faPlay,
  faPause,
  faArrowUpRightFromSquare,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

// Convert a FontAwesome icon into a data URI for use in <img> tags.
function faToDataUri(fa: any, color: string) {
  const svgString = icon(fa, { styles: { color } }).html.join("");
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// List of available actions and their corresponding icons. This can be
// extended or adjusted per tool if needed. Each action has a label in
// Thai (for display) and English (for internal use), plus an icon.
const ACTIONS = [
  { value: "start", label: "เปิดแอด", icon: faToDataUri(faPlay, "#FACC15") },
  { value: "pause", label: "หยุดแอด", icon: faToDataUri(faPause, "#FACC15") },
  { value: "increaseBudget", label: "เพิ่มงบประมาณ", icon: faToDataUri(faArrowUpRightFromSquare, "#FACC15") },
  { value: "setBudget", label: "ตั้งงบประมาณ", icon: faToDataUri(faArrowUp, "#FACC15") },
  { value: "increaseLimit", label: "เพิ่มวงเงิน", icon: faToDataUri(faArrowUpRightFromSquare, "#FACC15") },
  { value: "setLimit", label: "ตั้งวงเงิน", icon: faToDataUri(faArrowUp, "#FACC15") },
];

// Metrics definitions per tool. If you connect to real APIs, replace
// these arrays with data fetched from the respective platforms.
const TOOL_METRICS: Record<string, string[]> = {
  "Revealbot": [
    "Cost per Result",
    "Purchase ROAS",
    "Lifetime Spend",
    "Frequency",
    "CPM",
  ],
  "Google Ads Script": [
    "Conversions",
    "CTR",
    "CPC",
    "CPM",
    "Impressions",
  ],
  "Facebook Ads Manager Rules": [
    "Cost per Result",
    "Purchase ROAS",
    "Lifetime Spend",
    "Frequency",
    "CPM",
  ],
  "TikTok Ads Automation": [
    "CPA",
    "CPC",
    "CPM",
    "CTR",
    "Conversions",
  ],
  "Madgicx": [
    "ROAS",
    "CPA",
    "CPC",
    "CPM",
    "CTR",
  ],
  "Custom API": [
    "Custom Metric 1",
    "Custom Metric 2",
    "Custom Metric 3",
  ],
};

// Operators available for all tools. If you need more granular control
// per tool, define a similar map like TOOL_METRICS.
const OPERATORS = [
  { value: "greater_than", label: "มากกว่า" },
  { value: "less_than", label: "น้อยกว่า" },
  { value: "equal", label: "เท่ากับ" },
];

// Platform definitions with their brand icons. Logos are displayed
// next to the selected platform. You can extend this list.
const PLATFORMS = [
  {
    name: "Facebook Ads",
    icon: faToDataUri(faFacebook, "#1877F2"),
  },
  {
    name: "Google Ads",
    icon: faToDataUri(faGoogle, "#4285F4"),
  },
  {
    name: "TikTok Ads",
    icon: faToDataUri(faTiktok, "#010101"),
  },
  {
    name: "X Ads",
    icon: faToDataUri(faTwitter, "#1DA1F2"),
  },
  {
    name: "Other",
    icon: faToDataUri(faMedium, "#000000"),
  },
];

// Tool list. Each tool corresponds to a set of metrics defined above.
const TOOLS = [
  "Revealbot",
  "Google Ads Script",
  "Facebook Ads Manager Rules",
  "TikTok Ads Automation",
  "Madgicx",
  "Custom API",
];

interface RuleData {
  metric: string;
  operator: string;
  value: number;
  unit: string;
  action: string;
}

// Component for building a rule for a selected tool. It pulls metrics
// from TOOL_METRICS and actions from ACTIONS. When the Add Rule
// button is clicked, it calls the onAddRule callback with a summary.
function RuleBuilder({
  toolName,
  onAddRule,
}: {
  toolName: string;
  onAddRule: (summary: string) => void;
}) {
  const metrics = TOOL_METRICS[toolName] || [];
  const [metric, setMetric] = useState(metrics[0] || "");
  const [operator, setOperator] = useState(OPERATORS[0].value);
  const [value, setValue] = useState(0);
  const [unit, setUnit] = useState("day");
  const [action, setAction] = useState(ACTIONS[0].value);
  const getOperatorLabel = (op: string) => OPERATORS.find((o) => o.value === op)?.label || "";
  const getActionLabel = (act: string) => ACTIONS.find((a) => a.value === act)?.label || "";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="font-medium">Metric:</label>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white px-2 py-1 rounded"
        >
          {metrics.map((m) => (
            <option key={m} value={m} className="bg-zinc-800 text-white">
              {m}
            </option>
          ))}
        </select>
        <label className="font-medium">Operator:</label>
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white px-2 py-1 rounded"
        >
          {OPERATORS.map((op) => (
            <option key={op.value} value={op.value} className="bg-zinc-800 text-white">
              {op.label}
            </option>
          ))}
        </select>
        <label className="font-medium">Value:</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          className="bg-zinc-800 border border-zinc-700 text-white px-2 py-1 rounded w-20"
        />
        <label className="font-medium">Unit:</label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white px-2 py-1 rounded"
        >
          <option value="day">วัน</option>
          <option value="week">สัปดาห์</option>
          <option value="month">เดือน</option>
        </select>
        <label className="font-medium">Action:</label>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 text-white px-2 py-1 rounded"
        >
          {ACTIONS.map((act) => (
            <option key={act.value} value={act.value} className="bg-zinc-800 text-white">
              {act.label}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => {
          const operatorLabel = getOperatorLabel(operator);
          const actionLabel = getActionLabel(action);
          const summary = `${metric} ${operatorLabel} ${value} ใน 1 ${unit}, ให้${actionLabel}`;
          onAddRule(summary);
        }}
        className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded"
      >
        เพิ่มกฎนี้
      </button>
    </div>
  );
}

export default function EnhancedToolSelectorShell() {
  const [platform, setPlatform] = useState(PLATFORMS[0].name);
  const [tool, setTool] = useState(TOOLS[0]);
  const [rules, setRules] = useState<string[]>([]);

  const handleAddRule = (summary: string) => {
    setRules((prev) => [...prev, summary]);
  };
  const handleDeleteRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  const currentPlatform = PLATFORMS.find((p) => p.name === platform);

  return (
    <div className="max-w-4xl mx-auto mt-8 text-white">
      <h2 className="text-xl font-bold mb-4">Dark UI webapp mockup</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
        {/* Platform selector */}
        <div className="flex-1">
          <label className="block mb-1 text-sm">แพลตฟอร์มโฆษณา</label>
          <div className="relative">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-4 py-2 pr-8 rounded bg-zinc-800 border border-zinc-700 appearance-none"
            >
              {PLATFORMS.map((p) => (
                <option key={p.name} value={p.name} className="bg-zinc-800 text-white">
                  {p.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-zinc-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.943l3.71-3.713a.75.75 0 111.08 1.04l-4.25 4.26a.75.75 0 01-1.08 0l-4.25-4.25a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        {/* Tool selector */}
        <div className="flex-1">
          <label className="block mb-1 text-sm">เลือกเครื่องมืออัตโนมัติ</label>
          <div className="relative">
            <select
              value={tool}
              onChange={(e) => setTool(e.target.value)}
              className="w-full px-4 py-2 pr-8 rounded bg-zinc-800 border border-zinc-700 appearance-none"
            >
              {TOOLS.map((t) => (
                <option key={t} value={t} className="bg-zinc-800 text-white">
                  {t}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-zinc-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.943l3.71-3.713a.75.75 0 111.08 1.04l-4.25 4.26a.75.75 0 01-1.08 0l-4.25-4.25a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        {/* Placeholder button remains for potential future expansions */}
        <button
          onClick={() => {
            // Only call Add Rule if the tool has its builder or default builder.
            if (!tool) return;
            // Use default summary when no builder is displayed.
            handleAddRule(`สร้างกฎสำหรับ ${platform} โดยใช้ ${tool}`);
          }}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded self-start md:self-auto"
        >
          + เพิ่ม Rule ใหม่
        </button>
      </div>
      {/* Display selected platform logo */}
      <div className="mb-4 flex items-center gap-2">
        {currentPlatform && (
          <img src={currentPlatform.icon} alt={currentPlatform.name} className="h-6 w-6" />
        )}
        <span className="font-medium">{platform}</span>
      </div>
      {/* Tool-specific builder UI */}
      <div className="mb-4">
        {/* Render rule builder for the selected tool */}
        <RuleBuilder toolName={tool} onAddRule={handleAddRule} />
      </div>
      {/* Rules summary section */}
      <div className="bg-zinc-800 p-4 rounded">
        <h3 className="text-lg font-bold mb-2">สรุปกฎทั้งหมด</h3>
        {rules.length === 0 ? (
          <p className="text-sm text-zinc-400">ยังไม่มีกฎที่สร้างขึ้น</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {rules.map((rule, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>{idx + 1}. {rule}</span>
                <button
                  className="text-red-500 hover:text-red-400"
                  onClick={() => handleDeleteRule(idx)}
                >
                  ลบกฎ
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
