
import React, { useState } from "react";
import { icon } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebook,
  faGoogle,
  faTiktok,
  faTwitter,
  faMedium,
} from "@fortawesome/free-brands-svg-icons";
import {
  faPlay,
  faPause,
  faArrowUpRightFromSquare,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

// Convert a FontAwesome icon into a data URI. Encoded for direct use in <img> tags.
function faToDataUri(fa: any, color: string) {
  const svgString = icon(fa, { styles: { color } }).html.join("");
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// Actions supported across tools: labels in Thai and English plus a yellow icon.
const ACTIONS = [
  { value: "start", labelTH: "เปิดแอด", labelEN: "Start", icon: faToDataUri(faPlay, "#FACC15") },
  { value: "pause", labelTH: "หยุดแอด", labelEN: "Pause", icon: faToDataUri(faPause, "#FACC15") },
  { value: "increaseBudget", labelTH: "เพิ่มงบประมาณ", labelEN: "Increase budget", icon: faToDataUri(faArrowUpRightFromSquare, "#FACC15") },
  { value: "setBudget", labelTH: "ตั้งงบประมาณ", labelEN: "Set budget", icon: faToDataUri(faArrowUp, "#FACC15") },
  { value: "increaseLimit", labelTH: "เพิ่มวงเงิน", labelEN: "Increase spending limits", icon: faToDataUri(faArrowUpRightFromSquare, "#FACC15") },
  { value: "setLimit", labelTH: "ตั้งวงเงิน", labelEN: "Set spending limits", icon: faToDataUri(faArrowUp, "#FACC15") },
];

// Operators with Thai and English descriptors.
const OPERATORS = [
  { value: "greater_than", labelTH: "มากกว่า", labelEN: "greater than" },
  { value: "less_than", labelTH: "น้อยกว่า", labelEN: "less than" },
  { value: "equal", labelTH: "เท่ากับ", labelEN: "equal to" },
];

// Predefined metrics per tool. Replace with real data when integrating APIs.
const TOOL_METRICS: Record<string, string[]> = {
  Revealbot: ["Cost per Result", "Purchase ROAS", "Lifetime Spend", "Frequency", "CPM"],
  "Google Ads Script": ["Conversions", "CTR", "CPC", "CPM", "Impressions"],
  "Facebook Ads Manager Rules": ["Cost per Result", "Purchase ROAS", "Lifetime Spend", "Frequency", "CPM"],
  "TikTok Ads Automation": ["CPA", "CPC", "CPM", "CTR", "Conversions"],
  Madgicx: ["ROAS", "CPA", "CPC", "CPM", "CTR"],
  "Custom API": ["Custom Metric 1", "Custom Metric 2", "Custom Metric 3"],
};

// Advertising platforms with associated icons and brand colors.
const PLATFORMS = [
  { name: "Facebook Ads", icon: faToDataUri(faFacebook, "#1877F2"), color: "#1877F2" },
  { name: "Google Ads", icon: faToDataUri(faGoogle, "#4285F4"), color: "#4285F4" },
  { name: "TikTok Ads", icon: faToDataUri(faTiktok, "#25F4EE"), color: "#25F4EE" },
  { name: "X Ads", icon: faToDataUri(faTwitter, "#1DA1F2"), color: "#1DA1F2" },
  { name: "Other", icon: faToDataUri(faMedium, "#000000"), color: "#333333" },
];

// Available automation tools.
const TOOLS = [
  "Revealbot",
  "Google Ads Script",
  "Facebook Ads Manager Rules",
  "TikTok Ads Automation",
  "Madgicx",
  "Custom API",
];

interface Condition {
  metric: string;
  operator: string;
  value: number;
  unit: string;
  action: string;
}

export default function AutomationRuleBuilder() {
  // Platform and tool selection
  const [platform, setPlatform] = useState<string>(PLATFORMS[0].name);
  const [tool, setTool] = useState<string>(TOOLS[0]);

  // List of saved rules
  const [rules, setRules] = useState<string[]>([]);

  // Whether the rule builder is visible
  const [showBuilder, setShowBuilder] = useState<boolean>(false);

  // Rule details
  const [ruleName, setRuleName] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");
  const getDefaultMetric = (toolName: string) => TOOL_METRICS[toolName][0] || "";
  const [conditions, setConditions] = useState<Condition[]>([
    {
      metric: getDefaultMetric(TOOLS[0]),
      operator: OPERATORS[0].value,
      value: 0,
      unit: "day",
      action: ACTIONS[0].value,
    },
  ]);

  // Update conditions when tool changes
  const handleToolChange = (value: string) => {
    setTool(value);
    setConditions([
      {
        metric: getDefaultMetric(value),
        operator: OPERATORS[0].value,
        value: 0,
        unit: "day",
        action: ACTIONS[0].value,
      },
    ]);
  };

  // Update a particular condition by index
  const updateCondition = (index: number, updates: Partial<Condition>) => {
    setConditions((prev) => prev.map((cond, i) => (i === index ? { ...cond, ...updates } : cond)));
  };

  // Add a new empty condition row
  const addCondition = () => {
    setConditions((prev) => [
      ...prev,
      {
        metric: getDefaultMetric(tool),
        operator: OPERATORS[0].value,
        value: 0,
        unit: "day",
        action: ACTIONS[0].value,
      },
    ]);
  };

  // Remove a condition row
  const removeCondition = (index: number) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
  };

  // Save the rule and reset builder
  const saveRule = () => {
    if (!ruleName.trim()) {
      alert("โปรดระบุชื่อกฎ");
      return;
    }
    const summaryParts = conditions.map((cond, idx) => {
      const op = OPERATORS.find((o) => o.value === cond.operator);
      const action = ACTIONS.find((a) => a.value === cond.action);
      const opLabel = op ? `${op.labelTH} (${op.labelEN})` : "";
      const actionLabel = action ? `${action.labelEN} (${action.labelTH})` : "";
      return `${idx + 1}) ${cond.metric} ${opLabel} ${cond.value} ${cond.unit}, ${actionLabel}`;
    });
    const summary = `กฏ: ${ruleName} — จุดประสงค์: ${purpose || "—"}. เงื่อนไข: ${summaryParts.join("; ")}`;
    setRules((prev) => [...prev, summary]);
    // Reset builder
    setRuleName("");
    setPurpose("");
    setConditions([
      {
        metric: getDefaultMetric(tool),
        operator: OPERATORS[0].value,
        value: 0,
        unit: "day",
        action: ACTIONS[0].value,
      },
    ]);
    setShowBuilder(false);
  };

  // Delete a saved rule
  const deleteRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  // Current platform object to access color and icon
  const currentPlatform = PLATFORMS.find((p) => p.name === platform);

  return (
    <div className="max-w-4xl mx-auto mt-8 text-white">
      {/* Heading */}
      <h2 className="text-xl font-bold mb-4">สร้างกฏอัตโนมัติ</h2>

      {/* Selection row */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
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
        <div className="flex-1">
          <label className="block mb-1 text-sm">เลือกเครื่องมืออัตโนมัติ</label>
          <div className="relative">
            <select
              value={tool}
              onChange={(e) => handleToolChange(e.target.value)}
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
        {/* Create rule button */}
        <button
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded self-start md:self-auto"
          onClick={() => setShowBuilder(true)}
        >
          สร้างกฏ
        </button>
      </div>

      {/* Platform header with brand color background */}
      {currentPlatform && (
        <div
          className="flex items-center gap-2 p-2 rounded mb-4"
          style={{ backgroundColor: currentPlatform.color, color: "#FFFFFF" }}
        >
          <img src={currentPlatform.icon} alt={currentPlatform.name} className="h-6 w-6" />
          <span className="font-semibold">{currentPlatform.name}</span>
        </div>
      )}

      {/* Rule builder section */}
      {showBuilder && (
        <div className="bg-zinc-800 p-4 rounded mb-4 space-y-4">
          <h3 className="text-lg font-bold">กำหนดกฏใหม่</h3>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col">
              <span className="text-sm mb-1">ชื่อกฎ</span>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className="bg-zinc-700 border border-zinc-600 text-white px-2 py-1 rounded"
                placeholder="ระบุชื่อกฎ (เช่น ปิด Ad Set ขาดทุน)"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm mb-1">จุดประสงค์</span>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="bg-zinc-700 border border-zinc-600 text-white px-2 py-1 rounded"
                placeholder="วัตถุประสงค์ของกฎ"
              />
            </label>
          </div>
          <div className="space-y-4">
            {conditions.map((cond, idx) => (
              <div key={idx} className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{idx + 1}.</span>
                <select
                  value={cond.metric}
                  onChange={(e) => updateCondition(idx, { metric: e.target.value })}
                  className="bg-zinc-700 border border-zinc-600 text-white px-2 py-1 rounded"
                >
                  {TOOL_METRICS[tool].map((m) => (
                    <option key={m} value={m} className="bg-zinc-700 text-white">
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={cond.operator}
                  onChange={(e) => updateCondition(idx, { operator: e.target.value })}
                  className="bg-zinc-700 border border-zinc-600 text-white px-2 py-1 rounded"
                >
                  {OPERATORS.map((op) => (
                    <option key={op.value} value={op.value} className="bg-zinc-700 text-white">
                      {op.labelTH} ({op.labelEN})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={cond.value}
                  onChange={(e) => updateCondition(idx, { value: parseFloat(e.target.value) })}
                  className="bg-zinc-700 border border-zinc-600 text-white px-2 py-1 rounded w-20"
                />
                <select
                  value={cond.unit}
                  onChange={(e) => updateCondition(idx, { unit: e.target.value })}
                  className="bg-zinc-700 border border-zinc-600 text-white px-2 py-1 rounded"
                >
                  <option value="day">วัน (day)</option>
                  <option value="week">สัปดาห์ (week)</option>
                  <option value="month">เดือน (month)</option>
                </select>
                <select
                  value={cond.action}
                  onChange={(e) => updateCondition(idx, { action: e.target.value })}
                  className="bg-zinc-700 border border-zinc-600 text-white px-2 py-1 rounded"
                >
                  {ACTIONS.map((act) => (
                    <option key={act.value} value={act.value} className="bg-zinc-700 text-white">
                      {act.labelEN} ({act.labelTH})
                    </option>
                  ))}
                </select>
                {conditions.length > 1 && (
                  <button
                    onClick={() => removeCondition(idx)}
                    className="text-red-500 hover:text-red-400 px-2"
                  >
                    ลบ
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addCondition}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded"
          >
            + เพิ่มเงื่อนไข
          </button>
          <div className="flex gap-2 mt-4">
            <button
              onClick={saveRule}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
            >
              บันทึกกฎ
            </button>
            <button
              onClick={() => {
                setShowBuilder(false);
                setRuleName("");
                setPurpose("");
                setConditions([
                  {
                    metric: getDefaultMetric(tool),
                    operator: OPERATORS[0].value,
                    value: 0,
                    unit: "day",
                    action: ACTIONS[0].value,
                  },
                ]);
              }}
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* Summary of saved rules */}
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
                  onClick={() => deleteRule(idx)}
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

    