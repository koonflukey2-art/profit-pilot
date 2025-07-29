"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  platformFees,
  funnelPlans,
  metricsPlans,
  funnelObjectivesData,
  automationToolsConfig,
  businessTypeKeywords
} from './data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Bot, CalendarCheck, FileSliders, Filter, GanttChartSquare, History, Plus, RotateCcw, Save, Search, Settings, Trash2, X } from 'lucide-react';
import { generateUiTitles, generateAutomationWorkflow, getMetricsAdvice } from './actions';
import { Progress } from '../ui/progress';

const F = {
  num: (val) => parseFloat(String(val)) || 0,
  formatCurrency: (val) => `${F.num(val).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿`,
  formatNumber: (val, digits = 2) => F.num(val).toLocaleString('th-TH', { minimumFractionDigits: digits, maximumFractionDigits: digits }),
  formatInt: (val) => Math.ceil(F.num(val)).toLocaleString('th-TH'),
};

const initialInputs = {
  productName: '',
  productKeywords: '',
  businessType: 'ecommerce_website_campaign',
  sellingPrice: '',
  vatProduct: '7',
  cogs: '',
  salesPlatform: 'own_website',
  platformFee: '0',
  paymentFee: '3.0',
  kolFee: '10',
  packagingCost: '10',
  shippingCost: '35',
  profitGoal: '100000',
  profitGoalTimeframe: 'monthly',
  fixedCosts: '50000',
  targetRoas: '4',
  targetCpa: '',
  adCostPercent: '',
  calcDriver: 'roas',
  funnelPlan: 'launch',
  numberOfAccounts: '1',
  metricsPlan: 'fb_ecommerce_growth',
  automationTool: 'facebook',
};

export function ProfitPilotPage() {
  const [inputs, setInputs] = useState(initialInputs);
  const [calculated, setCalculated] = useState({});
  const [automationRules, setAutomationRules] = useState([]);
  const [uiTitles, setUiTitles] = useState({ productInfoTitle: 'ข้อมูลสินค้า', costCalculationTitle: 'คำนวณต้นทุน', goalsAndResultsTitle: 'เป้าหมายและผลลัพธ์', advancedPlanningTitle: 'Advanced Planning' });
  const [activeTab, setActiveTab] = useState('metrics');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: () => {} });
  const [n8nWorkflow, setN8nWorkflow] = useState({ json: null, loading: false });
  const [theme, setTheme] = useState('dark');
  const [funnelStageFilter, setFunnelStageFilter] = useState('all');
  
  const { toast } = useToast();

  const handleInputChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const calculateAll = useCallback(() => {
    const i = { ...inputs };
    const s = {};

    s.sellingPrice = F.num(i.sellingPrice);
    s.priceBeforeVat = s.sellingPrice / (1 + F.num(i.vatProduct) / 100);
    s.cogs = F.num(i.cogs);
    s.platformFeeCost = s.priceBeforeVat * (F.num(i.platformFee) / 100);
    s.paymentFeeCost = s.sellingPrice * (F.num(i.paymentFee) / 100);
    s.kolFeeCost = s.priceBeforeVat * (F.num(i.kolFee) / 100);
    s.packagingCost = F.num(i.packagingCost);
    s.shippingCost = F.num(i.shippingCost);
    s.totalVariableCost = s.cogs + s.platformFeeCost + s.paymentFeeCost + s.kolFeeCost + s.packagingCost + s.shippingCost;
    s.grossProfitUnit = s.priceBeforeVat - s.totalVariableCost;

    s.breakevenRoas = s.grossProfitUnit > 0 ? s.priceBeforeVat / s.grossProfitUnit : 0;
    s.breakevenCpa = s.grossProfitUnit;
    s.breakevenAdCostPercent = s.priceBeforeVat > 0 ? (s.breakevenCpa / s.priceBeforeVat) * 100 : 0;

    let targetRoas = F.num(i.targetRoas);
    let targetCpa = F.num(i.targetCpa);
    let adCostPercent = F.num(i.adCostPercent);

    if (s.priceBeforeVat > 0) {
        if (i.calcDriver === 'roas') {
            targetCpa = targetRoas > 0 ? s.priceBeforeVat / targetRoas : 0;
            adCostPercent = (targetCpa / s.priceBeforeVat) * 100;
        } else if (i.calcDriver === 'cpa') {
            targetRoas = targetCpa > 0 ? s.priceBeforeVat / targetCpa : 0;
            adCostPercent = (targetCpa / s.priceBeforeVat) * 100;
        } else {
            targetCpa = s.priceBeforeVat * (adCostPercent / 100);
            targetRoas = targetCpa > 0 ? s.priceBeforeVat / targetCpa : 0;
        }
    } else {
        targetRoas = 0; targetCpa = 0; adCostPercent = 0;
    }

    s.targetRoas = targetRoas;
    s.targetCpa = targetCpa;
    s.adCostPercent = adCostPercent;

    s.netProfitUnit = s.grossProfitUnit - s.targetCpa;
    const profitGoal = F.num(i.profitGoal);
    const fixedCosts = F.num(i.fixedCosts);
    const monthlyProfitGoal = i.profitGoalTimeframe === 'daily' ? profitGoal * 30 : profitGoal;
    const totalProfitTarget = monthlyProfitGoal + fixedCosts;
    s.targetOrders = s.netProfitUnit > 0 ? totalProfitTarget / s.netProfitUnit : 0;
    s.targetOrdersDaily = s.targetOrders / 30;
    s.targetRevenue = s.targetOrders * s.sellingPrice;
    s.adBudget = s.targetOrders * s.targetCpa;
    s.adBudgetWithVat = s.adBudget * (1 + (F.num(i.vatProduct) / 100));

    const funnelPlan = funnelPlans[i.funnelPlan] || funnelPlans.launch;
    s.tofuBudget = s.adBudget * (funnelPlan.tofu / 100);
    s.mofuBudget = s.adBudget * (funnelPlan.mofu / 100);
    s.bofuBudget = s.adBudget * (funnelPlan.bofu / 100);
    
    setCalculated(s);

    if (targetRoas > 0 && s.breakevenRoas > 0 && targetRoas < s.breakevenRoas) {
      toast({
        variant: "destructive",
        title: "Warning",
        description: "เป้าหมาย ROAS ต่ำกว่าจุดคุ้มทุน อาจทำให้ขาดทุนได้",
      })
    }
  }, [inputs, toast]);

  useEffect(() => {
    calculateAll();
  }, [inputs, calculateAll]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('profitPlannerHistory') || '[]');
    setHistory(savedHistory);
    const savedTheme = localStorage.getItem('profitPlannerTheme') || 'dark';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('profitPlannerTheme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputs.productName) {
        generateUiTitles({
          productName: inputs.productName,
          businessType: inputs.businessType,
          profitGoal: F.num(inputs.profitGoal),
          fixedCosts: F.num(inputs.fixedCosts)
        }).then(titles => setUiTitles(titles));
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [inputs.productName, inputs.businessType, inputs.profitGoal, inputs.fixedCosts]);

  const autoDetectBusinessType = useCallback(() => {
    const combinedText = `${inputs.productName} ${inputs.productKeywords}`.toLowerCase();
    if (!combinedText.trim()) return;

    for (const [type, keywords] of Object.entries(businessTypeKeywords)) {
      if (keywords.some(kw => combinedText.includes(kw))) {
        handleInputChange('businessType', type);
        return;
      }
    }
  }, [inputs.productName, inputs.productKeywords]);

  useEffect(() => {
    const timer = setTimeout(() => {
        autoDetectBusinessType();
    }, 300);
    return () => clearTimeout(timer);
  }, [inputs.productName, inputs.productKeywords, autoDetectBusinessType]);

  const handlePlatformChange = (value) => {
    const fees = platformFees[value];
    if (fees) {
      setInputs(prev => ({
        ...prev,
        salesPlatform: value,
        platformFee: fees.platform.toString(),
        paymentFee: fees.payment.toString(),
      }));
    }
  };

  const saveHistory = () => {
    const planName = inputs.productName || 'แผนที่ไม่ได้ตั้งชื่อ';
    const newHistory = [{
      id: Date.now(),
      name: planName,
      date: new Date().toLocaleString('th-TH'),
      inputs,
      automationRules
    }, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('profitPlannerHistory', JSON.stringify(newHistory));
    toast({ title: 'Success', description: `บันทึกแผน "${planName}" สำเร็จ!` });
  };

  const loadHistory = (id) => {
    const entry = history.find(item => item.id === id);
    if (entry) {
      setInputs(entry.inputs);
      setAutomationRules(entry.automationRules || []);
      setIsHistoryModalOpen(false);
      toast({ title: 'Success', description: `โหลดแผน "${entry.name}" สำเร็จ` });
    }
  };

  const deleteHistoryItem = (id) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('profitPlannerHistory', JSON.stringify(newHistory));
    toast({ title: 'Success', description: 'ลบแผนสำเร็จ' });
  };
  
  const clearHistory = () => {
    setConfirmModal({
      isOpen: true,
      message: 'คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้',
      onConfirm: () => {
        setHistory([]);
        localStorage.removeItem('profitPlannerHistory');
        toast({ title: 'Success', description: 'ล้างประวัติทั้งหมดแล้ว' });
      }
    });
  };

  const resetForm = () => {
    setConfirmModal({
        isOpen: true,
        message: 'คุณต้องการรีเซ็ตข้อมูลทั้งหมดในฟอร์มหรือไม่?',
        onConfirm: () => {
            setInputs(initialInputs);
            setAutomationRules([]);
            toast({ title: 'Success', description: 'รีเซ็ตฟอร์มเรียบร้อยแล้ว' });
        }
    });
  };

  const addRule = () => {
    const toolConfig = automationToolsConfig[inputs.automationTool];
    const newRule = {
      id: Date.now(),
      metric: toolConfig.metrics[0].value,
      operator: toolConfig.operators[0].value,
      value: F.formatNumber(calculated.targetRoas + 1 || 5, 2),
      action: toolConfig.actions.find(a => a.needsValue)?.value || toolConfig.actions[0].value,
      actionValue: '20',
      timeframe: toolConfig.timeframes[0].value
    };
    setAutomationRules(prev => [...prev, newRule]);
  };
  
  const updateRule = (id, field, value) => {
    setAutomationRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };
  
  const deleteRule = (id) => {
    setAutomationRules(prev => prev.filter(r => r.id !== id));
  };

  const handleGenerateN8nWorkflow = async () => {
    setN8nWorkflow({ json: null, loading: true });
    
    const [n8nWorkflowName, n8nPrimaryGoal] = [document.getElementById('n8nWorkflowName')?.value, document.getElementById('n8nPrimaryGoal')?.value];
    
    try {
      const result = await generateAutomationWorkflow({
        workflowName: n8nWorkflowName || "Profit Pilot Workflow",
        primaryGoal: n8nPrimaryGoal || "scale-revenue",
        platforms: ["facebook", "sheets", "slack", "email"], // Simplified for example
        features: ["budget optimization", "creative refresh"],
        rules: automationRules
      });
      setN8nWorkflow({ json: result.workflowJson, loading: false });
      toast({ title: "Success", description: "n8n Workflow JSON generated successfully!" });
    } catch (error) {
      setN8nWorkflow({ json: null, loading: false });
      toast({ variant: "destructive", title: "Error", description: "Failed to generate workflow." });
    }
  };

  const selectedMetricsPlan = metricsPlans[inputs.metricsPlan] || metricsPlans.fb_ecommerce_growth;
  const filteredKpis = useMemo(() => {
    if (funnelStageFilter === 'all') {
      return selectedMetricsPlan.kpis;
    }
    return selectedMetricsPlan.kpis.filter(kpi => kpi.stage === funnelStageFilter);
  }, [selectedMetricsPlan, funnelStageFilter]);
  const funnelObjectives = funnelObjectivesData[inputs.businessType]?.objectives || funnelObjectivesData.ecommerce_website_campaign.objectives;

  const getImportanceBadge = (importance) => {
    switch (importance) {
      case 'สูงสุด': return 'bg-red-500 hover:bg-red-600';
      case 'สูง': return 'bg-orange-500 hover:bg-orange-600';
      case 'กลาง': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  return (
    <>
      <header className="text-center mb-8 relative">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Profit Pilot</h1>
        <p className="text-base opacity-80">Profit & Metrics Planner v5.3</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="neumorphic-card p-6 h-full">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground font-bold text-xl rounded-lg shadow-md">1</div>
              <h2 className="text-2xl font-bold">{uiTitles.productInfoTitle}</h2>
            </div>
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                <Label htmlFor="theme-switch" className="text-sm font-medium opacity-80">โหมดธีม</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-70">สว่าง</span>
                  <Switch id="theme-switch" checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                  <span className="text-xs opacity-70">มืด</span>
                </div>
              </div>
              <div>
                <Label htmlFor="productName" className="block text-sm mb-2 font-medium opacity-80">ชื่อสินค้า (ระบบจะเลือกประเภทธุรกิจให้อัตโนมัติ)</Label>
                <Input id="productName" value={inputs.productName} onChange={(e) => handleInputChange('productName', e.target.value)} className="neumorphic-input" placeholder="เช่น 'ครีมกันแดด SPF50+'" />
              </div>
              <div>
                <Label htmlFor="productKeywords" className="block text-sm mb-2 font-medium opacity-80">คีย์เวิร์ด (ช่วยให้ตรวจจับแม่นยำขึ้น)</Label>
                <Input id="productKeywords" value={inputs.productKeywords} onChange={(e) => handleInputChange('productKeywords', e.target.value)} className="neumorphic-input" placeholder="เช่น 'skincare', 'กันแดด', 'เครื่องสำอาง'" />
              </div>
              <div>
                <Label htmlFor="businessType" className="block text-sm mb-2 font-medium opacity-80">ประเภทธุรกิจ</Label>
                <Select value={inputs.businessType} onValueChange={(val) => handleInputChange('businessType', val)}>
                  <SelectTrigger className="neumorphic-select">
                    <SelectValue placeholder="เลือกประเภทธุรกิจ" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(funnelObjectivesData).map(([key, { objectives }]) =>(
                      <SelectItem key={key} value={key}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="neumorphic-card p-6 h-full">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground font-bold text-xl rounded-lg shadow-md">2</div>
              <h2 className="text-2xl font-bold">{uiTitles.costCalculationTitle}</h2>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input value={inputs.sellingPrice} onChange={(e) => handleInputChange('sellingPrice', e.target.value)} type="number" placeholder="ราคาขาย" className="neumorphic-input" />
                <Input value={inputs.vatProduct} onChange={(e) => handleInputChange('vatProduct', e.target.value)} type="number" placeholder="VAT %" className="neumorphic-input" />
              </div>
              <Input value={inputs.cogs} onChange={(e) => handleInputChange('cogs', e.target.value)} type="number" placeholder="ต้นทุนสินค้า (COGS)" className="neumorphic-input" />
              <Select value={inputs.salesPlatform} onValueChange={handlePlatformChange}>
                <SelectTrigger className="neumorphic-select"><SelectValue/></SelectTrigger>
                <SelectContent>
                  {Object.keys(platformFees).map(p => <SelectItem key={p} value={p}>{p.replace(/_/g, ' ').toUpperCase()}</SelectItem>)}
                </SelectContent>
              </Select>
               <div className="grid grid-cols-2 gap-3">
                <Input value={inputs.platformFee} onChange={(e) => handleInputChange('platformFee', e.target.value)} type="number" placeholder="ค่าแพลตฟอร์ม %" className="neumorphic-input" readOnly={inputs.salesPlatform !== 'other'} />
                <Input value={inputs.paymentFee} onChange={(e) => handleInputChange('paymentFee', e.target.value)} type="number" placeholder="ค่าชำระเงิน %" className="neumorphic-input" readOnly={inputs.salesPlatform !== 'other'} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="neumorphic-card p-6 h-full">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground font-bold text-xl rounded-lg shadow-md">3</div>
              <h2 className="text-2xl font-bold">{uiTitles.goalsAndResultsTitle}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="profitGoal" className="block text-sm mb-2 font-medium opacity-80">เป้าหมายกำไร</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Input id="profitGoal" value={inputs.profitGoal} onChange={(e) => handleInputChange('profitGoal', e.target.value)} type="number" placeholder="เป้าหมายกำไร" className="neumorphic-input col-span-2" />
                  <Select value={inputs.profitGoalTimeframe} onValueChange={(val) => handleInputChange('profitGoalTimeframe', val)}>
                    <SelectTrigger className="neumorphic-select"><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">ต่อเดือน</SelectItem>
                      <SelectItem value="daily">ต่อวัน</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="fixedCosts" className="block text-sm mb-2 font-medium opacity-80">ค่าใช้จ่ายคงที่/เดือน</Label>
                <Input id="fixedCosts" value={inputs.fixedCosts} onChange={(e) => handleInputChange('fixedCosts', e.target.value)} type="number" placeholder="ค่าใช้จ่ายคงที่/เดือน" className="neumorphic-input" />
              </div>
              <hr className="border-border my-4 opacity-30" />
              <div className="space-y-2">
                  <div className="mini-value"><span className="label">กำไรขั้นต้น/หน่วย</span><span className="value text-primary">{F.formatCurrency(calculated.grossProfitUnit)}</span></div>
                  <div className="mini-value"><span className="label">จุดคุ้มทุน ROAS</span><span className="value text-primary">{F.formatNumber(calculated.breakevenRoas)}</span></div>
                  <div className="mini-value"><span className="label">ยอดขายเป้าหมาย</span><span className="value text-primary">{F.formatCurrency(calculated.targetRevenue)}</span></div>
                  <div className="mini-value"><span className="label">จำนวนออเดอร์</span><span className="value text-primary">{F.formatInt(calculated.targetOrders)} ({F.formatNumber(calculated.targetOrdersDaily, 1)}/วัน)</span></div>
                  <div className="mini-value"><span className="label">งบโฆษณา</span><span className="value text-primary">{F.formatCurrency(calculated.adBudget)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="neumorphic-card p-6 mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="tab-nav mb-6 grid w-full grid-cols-2 md:grid-cols-5 bg-background shadow-inner">
            <TabsTrigger value="metrics" className="tab-button"><CalendarCheck className="w-4 h-4"/>Metrics แนะนำ</TabsTrigger>
            <TabsTrigger value="planning" className="tab-button"><GanttChartSquare className="w-4 h-4"/>การวางแผน</TabsTrigger>
            <TabsTrigger value="funnel" className="tab-button"><Filter className="w-4 h-4"/>กลยุทธ์ Funnel</TabsTrigger>
            <TabsTrigger value="automation" className="tab-button"><Bot className="w-4 h-4"/>ระบบอัตโนมัติ</TabsTrigger>
            <TabsTrigger value="history" className="tab-button"><History className="w-4 h-4"/>ประวัติ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-1">
                    <Label htmlFor="metricsPlan" className="block text-sm mb-2 font-medium opacity-80">แผน Metrics</Label>
                    <Select value={inputs.metricsPlan} onValueChange={(val) => handleInputChange('metricsPlan', val)}>
                        <SelectTrigger id="metricsPlan" className="neumorphic-select"><SelectValue/></SelectTrigger>
                        <SelectContent>
                            {Object.entries(metricsPlans).map(([key, {name}]) => <SelectItem key={key} value={key}>{name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="md:col-span-2">
                    <p className="p-4 rounded-lg border bg-blue-900/20 border-primary/50 text-sm h-full flex items-center">
                        <b>บทสรุปแผน:</b>&nbsp;{selectedMetricsPlan.summary}
                    </p>
                </div>
             </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>KPIs</TableHead>
                    <TableHead>Benchmark</TableHead>
                    <TableHead>ความสำคัญ</TableHead>
                    <TableHead>หมายเหตุ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKpis.map((kpi, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-bold">{kpi.metric}</TableCell>
                      <TableCell className="text-primary font-semibold">{kpi.benchmark}</TableCell>
                      <TableCell><Badge className={cn("text-white", getImportanceBadge(kpi.importance))}>{kpi.importance}</Badge></TableCell>
                      <TableCell>{kpi.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="planning">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-bold text-lg mb-4">คำนวณ Metrics เป้าหมาย</h3>
                     <RadioGroup value={inputs.calcDriver} onValueChange={(val) => handleInputChange('calcDriver', val)} className="flex gap-2 mb-4">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="roas" id="r-roas" /><Label htmlFor="r-roas">ROAS</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="cpa" id="r-cpa" /><Label htmlFor="r-cpa">CPA</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="adcost" id="r-adcost" /><Label htmlFor="r-adcost">Ad Cost %</Label></div>
                    </RadioGroup>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <Input value={F.formatNumber(calculated.targetRoas || 0)} onChange={(e) => handleInputChange('targetRoas', e.target.value)} type="number" readOnly={inputs.calcDriver !== 'roas'} className="neumorphic-input" />
                      <Input value={F.formatNumber(calculated.targetCpa || 0)} onChange={(e) => handleInputChange('targetCpa', e.target.value)} type="number" readOnly={inputs.calcDriver !== 'cpa'} className="neumorphic-input" />
                      <Input value={F.formatNumber(calculated.adCostPercent || 0, 1)} onChange={(e) => handleInputChange('adCostPercent', e.target.value)} type="number" readOnly={inputs.calcDriver !== 'adcost'} className="neumorphic-input" />
                    </div>
                </div>
                <div>
                     <h3 className="font-bold text-lg mb-4">การแบ่งงบประมาณ</h3>
                    <Select value={inputs.funnelPlan} onValueChange={(val) => handleInputChange('funnelPlan', val)}>
                      <SelectTrigger className="neumorphic-select"><SelectValue/></SelectTrigger>
                      <SelectContent>
                        {Object.entries(funnelPlans).map(([key, {name}]) => <SelectItem key={key} value={key}>{name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                </div>
             </div>
          </TabsContent>
          <TabsContent value="funnel">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold mb-3 text-primary">TOFU (Top of Funnel)</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                    {funnelObjectives.tofu.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold mb-3 text-accent">MOFU (Middle of Funnel)</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                    {funnelObjectives.mofu.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold mb-3 text-purple-400">BOFU (Bottom of Funnel)</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                    {funnelObjectives.bofu.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="automation">
            <div className="flex justify-between items-center mb-6">
              <Button onClick={addRule} className="neon-button"><Plus className="w-4 h-4"/> เพิ่ม Rule ใหม่</Button>
            </div>
            <div className="space-y-4">
              {automationRules.map(rule => {
                const toolConfig = automationToolsConfig[inputs.automationTool];
                return (
                  <div key={rule.id} className="neumorphic-card p-4">
                     <div className="flex justify-end"><Button variant="ghost" size="icon" onClick={() => deleteRule(rule.id)}><X className="w-4 h-4 text-red-400"/></Button></div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Select value={rule.metric} onValueChange={(v) => updateRule(rule.id, 'metric', v)}><SelectTrigger className="neumorphic-select"/><SelectContent>{toolConfig.metrics.map(o => <SelectItem key={o.value} value={o.value}>{o.text}</SelectItem>)}</SelectContent></Select>
                        <Input value={rule.value} onChange={(e) => updateRule(rule.id, 'value', e.target.value)} className="neumorphic-input" placeholder="Value"/>
                        <Select value={rule.action} onValueChange={(v) => updateRule(rule.id, 'action', v)}><SelectTrigger className="neumorphic-select"/><SelectContent>{toolConfig.actions.map(o => <SelectItem key={o.value} value={o.value}>{o.text}</SelectItem>)}</SelectContent></Select>
                      </div>
                  </div>
                )
              })}
            </div>
             <div className="neumorphic-card mt-6 p-6">
              <h3 className="text-xl font-bold mb-4 gradient-text">n8n Workflow Generator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Input id="n8nWorkflowName" placeholder="Workflow Name" className="neumorphic-input" />
                <Input id="n8nPrimaryGoal" placeholder="Primary Goal" className="neumorphic-input" />
              </div>
              <Button onClick={handleGenerateN8nWorkflow} className="neon-button w-full" disabled={n8nWorkflow.loading}>
                {n8nWorkflow.loading ? "Generating..." : "Generate n8n Workflow JSON"}
              </Button>
              {n8nWorkflow.loading && <Progress value={50} className="w-full mt-4" />}
              {n8nWorkflow.json && (
                <div className="mt-4 p-4 bg-background rounded-lg max-h-96 overflow-auto">
                  <pre className="text-xs">{n8nWorkflow.json}</pre>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="history">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">ประวัติการวางแผน</h3>
              <Button variant="ghost" onClick={clearHistory} disabled={history.length === 0} className="text-red-400">ล้างประวัติ</Button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {history.length > 0 ? history.map(item => (
                <div key={item.id} className="neumorphic-card flex justify-between items-center p-3">
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-xs opacity-60">{item.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => loadHistory(item.id)}>โหลด</Button>
                    <Button variant="destructive" onClick={() => deleteHistoryItem(item.id)}><Trash2 className="w-4 h-4"/></Button>
                  </div>
                </div>
              )) : <p className="text-center opacity-60">ยังไม่มีประวัติการวางแผน</p>}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={confirmModal.isOpen} onOpenChange={(isOpen) => !isOpen && setConfirmModal({isOpen: false})}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>ยืนยันการกระทำ</AlertDialogTitle><AlertDialogDescription>{confirmModal.message}</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmModal({isOpen: false})}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={() => { confirmModal.onConfirm(); setConfirmModal({isOpen: false}); }}>ยืนยัน</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t-2 border-primary p-4 z-50">
        <div className="container mx-auto flex justify-center items-center gap-3">
          <Button onClick={saveHistory} className="neon-button"><Save className="w-4 h-4"/> บันทึกแผน</Button>
          <Button onClick={() => setIsHistoryModalOpen(true)} className="neon-button"><Search className="w-4 h-4"/> เรียกดูแผน</Button>
          <Button onClick={resetForm} className="neon-button danger"><RotateCcw className="w-4 h-4"/> รีเซ็ต</Button>
        </div>
      </div>

      <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
        <DialogContent className="neumorphic-card">
          <DialogHeader><DialogTitle className="gradient-text">ประวัติการวางแผน</DialogTitle><DialogClose /></DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto p-1">
            {history.length > 0 ? history.map(item => (
              <div key={item.id} className="neumorphic-card flex justify-between items-center p-3">
                <div><p className="font-bold">{item.name}</p><p className="text-xs opacity-60">{item.date}</p></div>
                <div className="flex gap-2"><Button onClick={() => loadHistory(item.id)}>Load</Button><Button variant="destructive" onClick={() => deleteHistoryItem(item.id)}><Trash2 className="w-4 h-4"/></Button></div>
              </div>
            )) : <p className="text-center opacity-60">ยังไม่มีประวัติการวางแผน</p>}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
