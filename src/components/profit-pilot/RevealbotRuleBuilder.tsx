
import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, Check, Play, Pause, ArrowUpRight, ArrowUp, MousePointerClick, PlugZap, Database } from "lucide-react";

// ---- Types
type ToolKey = "none" | "revealbot" | "fb_rules" | "gads_script" | "tiktok_automation" | "madgicx" | "custom_api";
type MetricOption = { id: string; label: string };

// ---- Mock data
const METRIC_OPTIONS: MetricOption[] = [
  { id: "cpr", label: "Cost per Result" },
  { id: "purchase_roas", label: "Purchase ROAS" },
  { id: "lifetime_spend", label: "Lifetime Spend" },
  { id: "frequency", label: "Frequency" },
  { id: "cpm", label: "CPM" },
];

// ---- Helper components
const SectionTitle: React.FC<{ title: string; subtitle?: string }>= ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
    {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
  </div>
);

// ---- Revealbot Rule Builder Mock
const RevealbotRuleBuilder: React.FC = () => {
  const [ruleName, setRuleName] = useState("ชื่อกฎ (เช่น 'ปิด Ad Set ขาดทุน')");
  const [metricOpen, setMetricOpen] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<MetricOption>(METRIC_OPTIONS[1]);
  const [operator, setOperator] = useState("is greater than");
  const [days, setDays] = useState(1);
  const [unit, setUnit] = useState("วัน");

  return (
    <Card className="bg-zinc-900/70 border-zinc-800 text-zinc-100 shadow-xl">
      <CardContent className="p-6 space-y-5">
        <SectionTitle title="Revealbot Rule Builder" subtitle="UI ตัวอย่างที่เรนเดอร์จริงตาม dropdown" />

        {/* Rule name */}
        <div className="bg-zinc-800/80 rounded-2xl p-4">
          <Input
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            className="bg-zinc-900 border-zinc-700 text-zinc-100"
          />

          {/* Condition Row */}
          <div className="mt-4 flex items-center gap-3 relative">
            <div className="px-3 py-2 rounded-lg bg-sky-600 text-white font-semibold">f</div>

            <Button
              variant="secondary"
              className="bg-zinc-900 border border-zinc-700 text-zinc-100 hover:bg-zinc-800 rounded-xl"
              onClick={() => setMetricOpen((v) => !v)}
            >
              {selectedMetric.label}
              <ChevronDown className="ml-2 h-4 w-4"/>
            </Button>

            <Button variant="secondary" className="bg-zinc-900 border border-zinc-700 rounded-xl">
              {operator}
              <ChevronDown className="ml-2 h-4 w-4"/>
            </Button>

            <Input
              value={days}
              onChange={(e) => setDays(Number(e.target.value || 0))}
              className="w-16 text-center bg-zinc-900 border-zinc-700"
            />

            <Button variant="secondary" className="bg-zinc-900 border-zinc-700 rounded-xl">
              {unit}
              <ChevronDown className="ml-2 h-4 w-4"/>
            </Button>
          </div>

          {metricOpen && (
            <div className="relative">
              <div className="absolute z-50 mt-3 w-80 rounded-xl border border-zinc-700 bg-zinc-900/95 shadow-2xl backdrop-blur pointer-events-auto">
                <div className="px-4 py-2 text-xs text-zinc-400">Common</div>
                <ul className="py-1">
                  {METRIC_OPTIONS.map((m) => {
                    const active = m.id === selectedMetric.id;
                    return (
                      <li key={m.id}>
                        <button
                          className={`w-full text-left px-4 py-2 hover:bg-zinc-800 ${active ? "bg-emerald-700/40" : ""}`}
                          onClick={() => {
                            setSelectedMetric(m);
                            setMetricOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="grow">{m.label}</div>
                            {active && <Check className="h-4 w-4"/>}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <ActionPill icon={<Play className="h-4 w-4"/>} label="Start" sub="เปิดแอด"/>
          <ActionPill icon={<Pause className="h-4 w-4"/>} label="Pause" sub="หยุดแอด"/>
          <ActionPill icon={<ArrowUpRight className="h-4 w-4"/>} label="Increase budget" sub="เพิ่มงบประมาณ"/>
          <ActionPill icon={<ArrowUp className="h-4 w-4"/>} label="Set budget" sub="ตั้งงบประมาณ"/>
          <ActionPill icon={<ArrowUpRight className="h-4 w-4"/>} label="Increase spending limits" sub="เพิ่มวงเงิน"/>
          <ActionPill icon={<ArrowUp className="h-4 w-4"/>} label="Set spending limits" sub="ตั้งวงเงิน"/>
        </div>
      </CardContent>
    </Card>
  );
};

const ActionPill: React.FC<{ icon: React.ReactNode; label: string; sub?: string }> = ({ icon, label, sub }) => (
  <div className="flex items-center gap-2 rounded-xl bg-yellow-400/10 border border-yellow-400/30 px-3 py-2 text-yellow-200">
    <div className="shrink-0 rounded-md bg-yellow-400/20 p-1">{icon}</div>
    <div>
      <div className="leading-tight text-sm">{label}</div>
      {sub && <div className="text-[11px] text-yellow-300/80">{sub}</div>}
    </div>
  </div>
);

// ---- Tool Selector Shell
const ToolSelectorShell: React.FC = () => {
  const [tool, setTool] = useState<ToolKey>("none");

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-zinc-950 to-zinc-900 text-zinc-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MousePointerClick className="h-5 w-5"/>
            <h1 className="text-2xl font-semibold tracking-tight">Dark UI webapp mockup</h1>
          </div>
        </header>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardContent className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
              {/* Platform selector */}
              <div>
                <label className="text-xs text-zinc-400">แพลตฟอร์มโฆษณา</label>
                <Select>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800">
                    <SelectValue placeholder="เลือกแพลตฟอร์ม" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="facebook">Facebook Ads</SelectItem>
                    <SelectItem value="tiktok">TikTok Ads</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="xads">X Ads</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Automation tool selector */}
              <div>
                <label className="text-xs text-zinc-400">เลือกเครื่องมืออัตโนมัติ</label>
                <Select value={tool} onValueChange={(v: ToolKey) => setTool(v)}>
                  <SelectTrigger className="bg-zinc-950 border-zinc-800">
                    <SelectValue placeholder="เลือกเครื่องมืออัตโนมัติ" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800">
                    <SelectItem value="none">— ยังไม่ได้เลือก —</SelectItem>
                    <SelectItem value="revealbot">Revealbot</SelectItem>
                    <SelectItem value="gads_script">Google Ads Script</SelectItem>
                    <SelectItem value="fb_rules">Facebook Ads Manager Rules</SelectItem>
                    <SelectItem value="tiktok_automation">TikTok Ads Automation</SelectItem>
                    <SelectItem value="madgicx">Madgicx</SelectItem>
                    <SelectItem value="custom_api">Custom API</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Add Rule button on top */}
              <div className="flex justify-end lg:justify-end">
                <Button variant="default" className="bg-cyan-500 hover:bg-cyan-400 text-zinc-900 font-semibold">+ เพิ่ม Rule ใหม่</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {tool === "none" && (
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-10 text-center text-zinc-400">
              เลือกเครื่องมือจาก dropdown ด้านบนเพื่อแสดง UI ที่เกี่ยวข้อง
            </CardContent>
          </Card>
        )}

        {tool === "revealbot" && <RevealbotRuleBuilder />}

        {tool === "gads_script" && (
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-10 text-center text-zinc-300 space-y-2">
              <div className="text-lg font-medium">Google Ads Script</div>
              <p className="text-sm text-zinc-400">พื้นที่สำหรับสคริปต์ Google Ads (ตัวอย่าง)</p>
            </CardContent>
          </Card>
        )}

        {tool === "fb_rules" && (
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-10 text-center text-zinc-300 space-y-2">
              <div className="text-lg font-medium">Facebook Ads Manager Rules</div>
              <p className="text-sm text-zinc-400">UI สำหรับ Meta Marketing API Rules (ตัวอย่าง)</p>
            </CardContent>
          </Card>
        )}

        {tool === "tiktok_automation" && (
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-10 text-center text-zinc-300 space-y-2">
              <div className="text-lg font-medium">TikTok Ads Automation</div>
              <p className="text-sm text-zinc-400">UI ตัวอย่างกติกาอัตโนมัติ (Placeholder)</p>
            </CardContent>
          </Card>
        )}

        {tool === "madgicx" && (
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-10 text-center text-zinc-300 space-y-2">
              <div className="text-lg font-medium">Madgicx</div>
              <p className="text-sm text-zinc-400">เลย์เอาต์จำลองให้ใกล้เคียงหน้าเครื่องมือจริง 100% พร้อมสัญลักษณ์พื้นฐาน</p>
            </CardContent>
          </Card>
        )}

        {tool === "custom_api" && (
          <Card className="bg-zinc-900/60 border-zinc-800">
            <CardContent className="p-10 text-center text-zinc-300 space-y-2">
              <div className="text-lg font-medium">Custom API</div>
              <p className="text-sm text-zinc-400">เชื่อมต่อระบบภายใน/เอเจนซี่</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ToolSelectorShell;
