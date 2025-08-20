import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Check } from "lucide-react";

const METRIC_OPTIONS = [
  "Cost per Result",
  "Purchase ROAS",
  "Lifetime Spend",
  "Frequency",
  "CPM",
];

const RevealbotRuleBuilder = () => {
  const [ruleName, setRuleName] = useState("ชื่อกฎ (เช่น 'ปิด Ad Set ขาดทุน')");
  const [metricOpen, setMetricOpen] = useState(false);   // default ปิด
  const [selectedMetric, setSelectedMetric] = useState("Purchase ROAS");
  const [operator, setOperator] = useState("is greater than");
  const [days, setDays] = useState(1);
  const [unit, setUnit] = useState("วัน");

  return (
    <Card className="bg-zinc-900 text-zinc-100 border-zinc-800">
      <CardContent className="p-6 space-y-6">
        {/* Rule name */}
        <Input
          value={ruleName}
          onChange={(e) => setRuleName(e.target.value)}
          className="bg-zinc-800 border-zinc-700"
        />

        {/* Condition Row */}
        <div className="flex items-center gap-3 mt-4 relative">
          {/* Facebook badge */}
          <div className="px-3 py-2 rounded-lg bg-sky-600 text-white font-semibold">f</div>

          {/* Metric selector */}
          <Button
            variant="secondary"
            className="bg-zinc-900 border border-zinc-700 rounded-xl"
            onClick={() => setMetricOpen((prev) => !prev)}
          >
            {selectedMetric}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>

          {/* Operator */}
          <Button variant="secondary" className="bg-zinc-900 border border-zinc-700 rounded-xl">
            {operator}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>

          {/* Number input */}
          <Input
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-16 text-center bg-zinc-900 border-zinc-700"
          />

          {/* Unit */}
          <Button variant="secondary" className="bg-zinc-900 border border-zinc-700 rounded-xl">
            {unit}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>

          {/* Dropdown Menu */}
          {metricOpen && (
            <div className="absolute left-14 top-14 w-64 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50">
              <ul>
                {METRIC_OPTIONS.map((m) => (
                  <li key={m}>
                    <button
                      className={`w-full text-left px-4 py-2 hover:bg-zinc-800 flex justify-between ${
                        selectedMetric === m ? "bg-emerald-700/40" : ""
                      }`}
                      onClick={() => {
                        setSelectedMetric(m);
                        setMetricOpen(false);
                      }}
                    >
                      {m}
                      {selectedMetric === m && <Check className="h-4 w-4" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RevealbotRuleBuilder;
