import React, { useState } from "react";
import { icon } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebook,
  faGoogle,
  faTiktok,
  faTwitter,
  faMedium,
} from "@fortawesome/free-brands-svg-icons";

// Helper to convert a FontAwesome SVG into a data URI. We encode the
// returned HTML string so that it can be used directly in an <img>
// element. This avoids having to bundle external SVG assets.
function faToDataUri(fa: any, color: string) {
  const svgString = icon(fa, { styles: { color } }).html.join("");
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// A simple rule builder for Facebook Ads Manager Rules. This component
// demonstrates a real input/output flow: you can select a metric,
// operator, threshold and unit, then click "Add Rule" to see the rule
// summary below. In a production app this is where you would hook
// directly into the Facebook Ads Marketing API.
function FacebookAdsRuleBuilder({ onAddRule }: { onAddRule: (summary: string) => void }) {
  const metrics = ["Cost per Result", "Purchase ROAS", "Lifetime Spend", "Frequency", "CPM"];
  const operators = ["is greater than", "is less than", "equals"];
  const [metric, setMetric] = useState(metrics[1]);
  const [operator, setOperator] = useState(operators[0]);
  const [value, setValue] = useState(1);
  const [unit, setUnit] = useState("day");
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className="font-medium">Metric:</label>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          className="border rounded px-2 py-1 bg-zinc-800 text-white"
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
          className="border rounded px-2 py-1 bg-zinc-800 text-white"
        >
          {operators.map((op) => (
            <option key={op} value={op} className="bg-zinc-800 text-white">
              {op}
            </option>
          ))}
        </select>
        <label className="font-medium">Value:</label>
        <input
          type="number"
          value={value}
          min={0}
          step={0.01}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          className="border rounded px-2 py-1 w-20 bg-zinc-800 text-white"
        />
        <label className="font-medium">Unit:</label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="border rounded px-2 py-1 bg-zinc-800 text-white"
        >
          <option value="day" className="bg-zinc-800 text-white">
            วัน
          </option>
          <option value="week" className="bg-zinc-800 text-white">
            สัปดาห์
          </option>
          <option value="month" className="bg-zinc-800 text-white">
            เดือน
          </option>
        </select>
      </div>
      <button
        onClick={() => {
          const summary = `เมื่อ ${metric} ${operator} ${value} ใน 1 ${unit}, ให้ดำเนินการ`;
          onAddRule(summary);
        }}
        className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded"
      >
        เพิ่มกฎนี้
      </button>
    </div>
  );
}

// Placeholder component for other tools. Replace this with a real
// implementation for each specific platform/tool pair. It simply
// displays which tool is selected and could later host its own
// rule-building form.
function PlaceholderTool({ toolName }: { toolName: string }) {
  return (
    <div className="p-4 bg-zinc-800 rounded text-white">
      <p>UI สำหรับ {toolName} (ตัวอย่าง)</p>
    </div>
  );
}

export default function ToolSelectorShell() {
  // State for selected advertising platform and automation tool
  const [platform, setPlatform] = useState("Facebook Ads");
  const [automationTool, setAutomationTool] = useState("Facebook Ads Manager Rules");
  const [rules, setRules] = useState<string[]>([]);

  // Map of platforms to their brand colors and FontAwesome icons
  const platforms = [
    {
      name: "Facebook Ads",
      icon: faToDataUri(faFacebook, "#1877f2"),
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
      icon: faToDataUri(faTwitter, "#1da1f2"),
    },
    {
      name: "Other",
      icon: faToDataUri(faMedium, "#000000"),
    },
  ];

  // Automation tool options. If you add a new tool, define its UI
  // rendering logic below in the switch statement.
  const automationTools = [
    "ยังไม่ได้เลือก",
    "Revealbot",
    "Google Ads Script",
    "Facebook Ads Manager Rules",
    "TikTok Ads Automation",
    "Madgicx",
    "Custom API",
  ];

  // Callback to add rule summary to the list
  const addRule = (summary: string) => {
    setRules((prev) => [...prev, summary]);
  };

  // Render the rule-building UI depending on selected platform and tool
  const renderToolUI = () => {
    switch (automationTool) {
      case "Facebook Ads Manager Rules":
        return <FacebookAdsRuleBuilder onAddRule={addRule} />;
      case "Revealbot":
      case "Google Ads Script":
      case "TikTok Ads Automation":
      case "Madgicx":
      case "Custom API":
        return <PlaceholderTool toolName={automationTool} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 text-white">
      <h2 className="text-xl font-bold mb-4">Dark UI webapp mockup</h2>
      {/* Selector Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
        {/* Advertising Platform Selector */}
        <div className="flex-1">
          <label className="block mb-1 text-sm">แพลตฟอร์มโฆษณา</label>
          <div className="relative">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-4 py-2 pr-8 rounded bg-zinc-800 border border-zinc-700 appearance-none"
            >
              {platforms.map((p) => (
                <option key={p.name} value={p.name} className="bg-zinc-800 text-white">
                  {p.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="h-4 w-4 text-zinc-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.943l3.71-3.713a.75.75 0 111.08 1.04l-4.25 4.26a.75.75 0 01-1.08 0l-4.25-4.25a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* Automation Tool Selector */}
        <div className="flex-1">
          <label className="block mb-1 text-sm">เลือกเครื่องมืออัตโนมัติ</label>
          <div className="relative">
            <select
              value={automationTool}
              onChange={(e) => setAutomationTool(e.target.value)}
              className="w-full px-4 py-2 pr-8 rounded bg-zinc-800 border border-zinc-700 appearance-none"
            >
              {automationTools.map((tool) => (
                <option key={tool} value={tool} className="bg-zinc-800 text-white">
                  {tool}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="h-4 w-4 text-zinc-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.943l3.71-3.713a.75.75 0 111.08 1.04l-4.25 4.26a.75.75 0 01-1.08 0l-4.25-4.25a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* Add Rule Button */}
        <button
          onClick={() => {
            if (automationTool === "Facebook Ads Manager Rules") {
              // Do nothing here; rule will be added via builder
            } else if (automationTool === "ยังไม่ได้เลือก") {
              alert("โปรดเลือกเครื่องมืออัตโนมัติ");
            } else {
              addRule(`สร้างกฎสำหรับ ${platform} โดยใช้ ${automationTool}`);
            }
          }}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded self-start md:self-auto"
        >
          + เพิ่ม Rule ใหม่
        </button>
      </div>
      {/* Platform logo display */}
      <div className="mb-4 flex items-center gap-2">
          {platforms.map((p) => (
            p.name === platform ? (
              <img
                key={p.name}
                src={p.icon}
                alt={p.name}
                className="h-6 w-6"
              />
            ) : null
          ))}
          <span className="font-medium">{platform}</span>
      </div>
      {/* Tool UI section */}
      <div className="mb-4">
        {renderToolUI()}
      </div>
      {/* Rule summary section */}
      <div className="bg-zinc-800 p-4 rounded">
        <h3 className="text-lg font-bold mb-2">สรุปกฎทั้งหมด</h3>
        {rules.length === 0 ? (
          <p className="text-sm text-zinc-400">ยังไม่มีกฎที่สร้างขึ้น</p>
        ) : (
          <ol className="list-decimal list-inside space-y-1 text-sm">
            {rules.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
