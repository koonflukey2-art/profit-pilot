"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  platformFees,
  funnelPlans,
  metricsPlans,
  funnelObjectivesData,
  automationToolsConfig,
  businessTypeKeywords,
  platformFeeLabels
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
import { Bot, CalendarCheck, FileSliders, Filter, GanttChartSquare, History, Plus, RotateCcw, Save, Search, Settings, Trash2, X, ArrowRight } from 'lucide-react';
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
  platformFee: '',
  paymentFee: '',
  kolFee: '',
  packagingCost: '',
  shippingCost: '',
  profitGoal: '',
  profitGoalTimeframe: 'monthly',
  fixedCosts: '',
  targetRoas: '',
  targetCpa: '',
  adCostPercent: '',
  calcDriver: 'roas',
  funnelPlan: 'launch',
  numberOfAccounts: '1',
  metricsPlan: 'fb_s1_plan',
  automationTool: 'facebook',
};

export function ProfitPilotPage() {
  const [inputs, setInputs] = useState(initialInputs);
  const [calculated, setCalculated] = useState({});
  const [automationRules, setAutomationRules] = useState([]);
  const [uiTitles, setUiTitles] = useState({ productInfoTitle: 'ข้อมูลสินค้า', costCalculationTitle: 'คำนวณต้นทุน', goalsAndResultsTitle: 'เป้าหมายและผลลัพธ์', advancedPlanningTitle: 'Advanced Planning' });
  const [activeTab, setActiveTab] = useState('planning');
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
            adCostPercent = targetCpa > 0 ? (targetCpa / s.priceBeforeVat) * 100 : 0;
        } else if (i.calcDriver === 'cpa') {
            targetRoas = targetCpa > 0 ? s.priceBeforeVat / targetCpa : 0;
            adCostPercent = targetCpa > 0 ? (targetCpa / s.priceBeforeVat) * 100 : 0;
        } else { // calcDriver === 'adcost'
            targetCpa = s.priceBeforeVat * (adCostPercent / 100);
            targetRoas = targetCpa > 0 ? s.priceBeforeVat / targetCpa : 0;
        }
    } else {
        targetRoas = 0; targetCpa = 0; adCostPercent = 0;
    }

    s.targetRoas = targetRoas;
    s.targetCpa = targetCpa;
    s.adCostPercent = adCostPercent;
    
    s.netProfitUnit = s.grossProfitUnit - targetCpa;
    const profitGoal = F.num(i.profitGoal);
    const fixedCosts = F.num(i.fixedCosts);
    const monthlyProfitGoal = i.profitGoalTimeframe === 'daily' ? profitGoal * 30 : profitGoal;
    const totalProfitTarget = monthlyProfitGoal + fixedCosts;
    s.targetOrders = s.netProfitUnit > 0 ? totalProfitTarget / s.netProfitUnit : 0;
    s.targetOrdersDaily = s.targetOrders / 30;
    s.targetRevenue = s.targetOrders * s.sellingPrice;
    s.adBudget = s.targetOrders * targetCpa;
    s.adBudgetWithVat = s.adBudget * (1 + (F.num(i.vatProduct) / 100));

    const funnelPlan = funnelPlans[i.funnelPlan] || funnelPlans.launch;
    s.tofuBudget = s.adBudget * (funnelPlan.tofu / 100);
    s.mofuBudget = s.adBudget * (funnelPlan.mofu / 100);
    s.bofuBudget = s.adBudget * (funnelPlan.bofu / 100);
    
    setCalculated(s);

    const newInputs = {...inputs};
    let changed = false;
    if (i.calcDriver !== 'roas' && isFinite(targetRoas) && F.num(i.targetRoas).toFixed(2) !== targetRoas.toFixed(2)) {
      newInputs.targetRoas = targetRoas.toFixed(2);
      changed = true;
    }
    if (i.calcDriver !== 'cpa' && isFinite(targetCpa) && F.num(i.targetCpa).toFixed(2) !== targetCpa.toFixed(2)) {
        newInputs.targetCpa = targetCpa.toFixed(2);
        changed = true;
    }
    if (i.calcDriver !== 'adcost' && isFinite(adCostPercent) && F.num(i.adCostPercent).toFixed(1) !== adCostPercent.toFixed(1)) {
        newInputs.adCostPercent = adCostPercent.toFixed(1);
        changed = true;
    }
    if (changed) {
        setInputs(newInputs);
    }

    if (i.calcDriver === 'roas' && targetRoas > 0 && s.breakevenRoas > 0 && targetRoas < s.breakevenRoas) {
      toast({
        variant: "destructive",
        title: "Warning",
        description: "เป้าหมาย ROAS ต่ำกว่าจุดคุ้มทุน อาจทำให้ขาดทุนได้",
      })
    }
  }, [inputs, toast]);


  useEffect(() => {
    calculateAll();
  }, [calculateAll]);

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

  const selectedMetricsPlan = metricsPlans[inputs.metricsPlan] || metricsPlans.fb_s1_plan;
  const filteredKpis = useMemo(() => {
    if (funnelStageFilter === 'all') {
      return selectedMetricsPlan.kpis;
    }
    return selectedMetricsPlan.kpis.filter(kpi => kpi.stage === funnelStageFilter);
  }, [selectedMetricsPlan, funnelStageFilter]);
  const funnelObjectives = funnelObjectivesData[inputs.businessType]?.objectives || funnelObjectivesData.ecommerce_website_campaign.objectives;

  const getImportanceBadge = (importance) => {
    switch (importance) {
      case 'สูงมาก': return 'bg-red-500 hover:bg-red-600';
      case 'สูง': return 'bg-orange-500 hover:bg-orange-600';
      case 'กลาง': return 'bg-yellow-500 hover:bg-yellow-600 text-black';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const currentFunnelPlan = funnelPlans[inputs.funnelPlan] || { tofu: 0, mofu: 0, bofu: 0 };
  const numAccounts = F.num(inputs.numberOfAccounts) || 1;
  const budgetPerAccountMonth = (calculated.adBudget || 0) / numAccounts;
  const budgetPerAccountDay = budgetPerAccountMonth / 30;

  const funnelData = useMemo(() => {
    return [
      { name: 'TOFU', value: currentFunnelPlan.tofu, color: 'hsl(var(--primary))' },
      { name: 'MOFU', value: currentFunnelPlan.mofu, color: 'hsl(var(--accent))' },
      { name: 'BOFU', value: currentFunnelPlan.bofu, color: 'hsl(157 71% 38%)' },
    ].sort((a, b) => b.value - a.value);
  }, [currentFunnelPlan]);
  
  const StructureBox = ({ title, children, className = '' }) => (
    <div className={cn("bg-blue-900/50 border border-primary/50 rounded-lg p-3 text-center neumorphic-card", className)}>
      <p className="text-sm font-bold text-primary">{title}</p>
      {children}
    </div>
  );

  const StructureLine = ({ hasArrow = false }) => (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className="w-full h-px bg-primary/50 relative">
        {hasArrow && <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />}
      </div>
    </div>
  );
  
  return (
    <>
      <header className="text-center mb-8 relative">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Profit Pilot</h1>
        <p className="text-base opacity-80">Profit & Metrics Planner v5.3</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="neumorphic-card p-6 h-full">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/20">
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
                    {Object.entries(funnelObjectivesData).map(([key, { name }]) =>(
                      <SelectItem key={key} value={key}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="neumorphic-card p-6 h-full">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/20">
              <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground font-bold text-xl rounded-lg shadow-md">2</div>
              <h2 className="text-2xl font-bold">{uiTitles.costCalculationTitle}</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sellingPrice" className="block text-sm mb-2 font-medium opacity-80">ราคาขาย</Label>
                  <Input id="sellingPrice" value={inputs.sellingPrice} onChange={(e) => handleInputChange('sellingPrice', e.target.value)} type="number" placeholder="" className="neumorphic-input" />
                </div>
                <div>
                  <Label htmlFor="vatProduct" className="block text-sm mb-2 font-medium opacity-80">VAT (%)</Label>
                  <Input id="vatProduct" value={inputs.vatProduct} onChange={(e) => handleInputChange('vatProduct', e.target.value)} type="number" placeholder="7" className="neumorphic-input" />
                </div>
              </div>
              <div>
                <Label htmlFor="cogs" className="block text-sm mb-2 font-medium opacity-80">ต้นทุนสินค้า (COGS)</Label>
                <Input id="cogs" value={inputs.cogs} onChange={(e) => handleInputChange('cogs', e.target.value)} type="number" placeholder="" className="neumorphic-input" />
              </div>
              <div>
                <Label htmlFor="salesPlatform" className="block text-sm mb-2 font-medium opacity-80">ช่องทางขาย</Label>
                <Select value={inputs.salesPlatform} onValueChange={handlePlatformChange}>
                  <SelectTrigger id="salesPlatform" className="neumorphic-select"><SelectValue/></SelectTrigger>
                  <SelectContent>
                    {Object.keys(platformFees).map(p => <SelectItem key={p} value={p}>{platformFeeLabels[p]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <Label htmlFor="platformFee" className="block text-sm mb-2 font-medium opacity-80">ค่าแพลตฟอร์ม (%)</Label>
                    <Input id="platformFee" value={inputs.platformFee} onChange={(e) => handleInputChange('platformFee', e.target.value)} type="number" className="neumorphic-input" readOnly={inputs.salesPlatform !== 'other'} placeholder="" />
                 </div>
                 <div>
                    <Label htmlFor="paymentFee" className="block text-sm mb-2 font-medium opacity-80">ค่าชำระเงิน (%)</Label>
                    <Input id="paymentFee" value={inputs.paymentFee} onChange={(e) => handleInputChange('paymentFee', e.target.value)} type="number" className="neumorphic-input" readOnly={inputs.salesPlatform !== 'other'} placeholder="" />
                 </div>
              </div>
              <div>
                <Label htmlFor="kolFee" className="block text-sm mb-2 font-medium opacity-80">ค่าคอมมิชชั่น KOL (%)</Label>
                <Input id="kolFee" value={inputs.kolFee} onChange={(e) => handleInputChange('kolFee', e.target.value)} type="number" placeholder="" className="neumorphic-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <Label htmlFor="packagingCost" className="block text-sm mb-2 font-medium opacity-80">ค่าแพ็ค</Label>
                    <Input id="packagingCost" value={inputs.packagingCost} onChange={(e) => handleInputChange('packagingCost', e.target.value)} type="number" placeholder="" className="neumorphic-input" />
                 </div>
                 <div>
                    <Label htmlFor="shippingCost" className="block text-sm mb-2 font-medium opacity-80">ค่าส่ง</Label>
                    <Input id="shippingCost" value={inputs.shippingCost} onChange={(e) => handleInputChange('shippingCost', e.target.value)} type="number" placeholder="" className="neumorphic-input" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="neumorphic-card p-6 h-full">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/20">
              <div className="flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground font-bold text-xl rounded-lg shadow-md">3</div>
              <h2 className="text-2xl font-bold">{uiTitles.goalsAndResultsTitle}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="profitGoal" className="block text-sm mb-2 font-medium opacity-80">เป้าหมายกำไร</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Input id="profitGoal" value={inputs.profitGoal} onChange={(e) => handleInputChange('profitGoal', e.target.value)} type="number" placeholder="" className="neumorphic-input col-span-2" />
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
                <Input id="fixedCosts" value={inputs.fixedCosts} onChange={(e) => handleInputChange('fixedCosts', e.target.value)} type="number" placeholder="" className="neumorphic-input" />
              </div>
              <div className="space-y-2 pt-4">
                  <div className="flex justify-between items-center text-sm"><span className="opacity-80">กำไรขั้นต้น/หน่วย</span><span className="font-bold text-primary">{F.formatCurrency(calculated.grossProfitUnit)}</span></div>
                  <div className="flex justify-between items-center text-sm"><span className="opacity-80">จุดคุ้มทุน ROAS</span><span className="font-bold text-primary">{F.formatNumber(calculated.breakevenRoas)}</span></div>
                  <div className="flex justify-between items-center text-sm"><span className="opacity-80">ยอดขายเป้าหมาย</span><span className="font-bold text-primary">{F.formatCurrency(calculated.targetRevenue)}</span></div>
                  <div className="flex justify-between items-center text-sm"><span className="opacity-80">จำนวนออเดอร์</span><span className="font-bold text-primary">{F.formatInt(calculated.targetOrders)} <span className="text-xs opacity-70">({F.formatNumber(calculated.targetOrdersDaily, 1)}/วัน)</span></span></div>
                  <div className="flex justify-between items-center text-sm"><span className="opacity-80">งบโฆษณา</span><span className="font-bold text-primary">{F.formatCurrency(calculated.adBudget)}</span></div>
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
             <div className="flex items-center gap-4 mb-4">
                <Label className="text-sm font-medium opacity-80">กรองตาม Funnel Stage:</Label>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant={funnelStageFilter === 'all' ? 'default' : 'outline'} onClick={() => setFunnelStageFilter('all')}>All</Button>
                  <Button size="sm" variant={funnelStageFilter === 'TOFU' ? 'default' : 'outline'} onClick={() => setFunnelStageFilter('TOFU')}>TOFU</Button>
                  <Button size="sm" variant={funnelStageFilter === 'MOFU' ? 'default' : 'outline'} onClick={() => setFunnelStageFilter('MOFU')}>MOFU</Button>
                  <Button size="sm" variant={funnelStageFilter === 'BOFU' ? 'default' : 'outline'} onClick={() => setFunnelStageFilter('BOFU')}>BOFU</Button>
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
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Metrics Calculator</h3>
              <div className="neumorphic-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Label className="block text-base mb-3 font-medium">เลือกตัวตั้งต้น</Label>
                    <RadioGroup value={inputs.calcDriver} onValueChange={(val) => handleInputChange('calcDriver', val)} className="space-y-2">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="roas" id="r-roas" /><Label htmlFor="r-roas">ROAS (Return on Ad Spend)</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="cpa" id="r-cpa" /><Label htmlFor="r-cpa">CPA (Cost per Acquisition)</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="adcost" id="r-adcost" /><Label htmlFor="r-adcost">Ad% (Ad Spend Percentage)</Label></div>
                    </RadioGroup>
                     <div className="grid grid-cols-3 gap-4 mt-6">
                      <div>
                        <Label htmlFor="targetRoas" className="block text-sm mb-2 opacity-80">ROAS</Label>
                        <Input value={inputs.targetRoas} onChange={(e) => handleInputChange('targetRoas', e.target.value)} type="number" readOnly={inputs.calcDriver !== 'roas'} className="neumorphic-input" placeholder="" />
                      </div>
                      <div>
                        <Label htmlFor="targetCpa" className="block text-sm mb-2 opacity-80">CPA (฿)</Label>
                        <Input value={inputs.targetCpa} onChange={(e) => handleInputChange('targetCpa', e.target.value)} type="number" readOnly={inputs.calcDriver !== 'cpa'} className="neumorphic-input" placeholder="" />
                      </div>
                      <div>
                        <Label htmlFor="adCostPercent" className="block text-sm mb-2 opacity-80">Ad% (%)</Label>
                        <Input value={inputs.adCostPercent} onChange={(e) => handleInputChange('adCostPercent', e.target.value)} type="number" readOnly={inputs.calcDriver !== 'adcost'} className="neumorphic-input" placeholder="" />
                      </div>
                    </div>
                  </div>
                  <div>
                     <h4 className="text-lg font-bold mb-4 gradient-text">ค่า Breakeven</h4>
                     <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-background shadow-inner">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-primary">BE ROAS</p>
                                <p className="font-bold text-xl text-primary">{F.formatNumber(calculated.breakevenRoas)}</p>
                            </div>
                            <p className="text-xs opacity-70 mt-1">ค่า ROAS ต่ำสุดที่แคมเปญต้องทำให้ได้เพื่อ "เท่าทุน"</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background shadow-inner">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-primary">BE CPA</p>
                                <p className="font-bold text-xl text-primary">{F.formatCurrency(calculated.breakevenCpa)}</p>
                            </div>
                            <p className="text-xs opacity-70 mt-1">ค่าโฆษณาสูงสุดที่จ่ายได้โดยไม่ขาดทุน</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background shadow-inner">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-primary">BE Ad Cost %</p>
                                <p className="font-bold text-xl text-primary">{F.formatNumber(calculated.breakevenAdCostPercent, 0)}%</p>
                            </div>
                             <p className="text-xs opacity-70 mt-1">สัดส่วนค่าโฆษณาสูงสุดเมื่อเทียบกับราคาขาย</p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 text-white">การแบ่งงบประมาณ</h3>
              <div className="neumorphic-card p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="funnelPlan" className="block text-sm mb-2 font-medium opacity-80">แผนกลยุทธ์ Funnel</Label>
                    <Select value={inputs.funnelPlan} onValueChange={(val) => handleInputChange('funnelPlan', val)}>
                      <SelectTrigger id="funnelPlan" className="neumorphic-select"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(funnelPlans).map(([key, { name }]) => <SelectItem key={key} value={key}>{name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="numberOfAccounts" className="block text-sm mb-2 font-medium opacity-80">จำนวนบัญชีโฆษณา</Label>
                    <Input id="numberOfAccounts" value={inputs.numberOfAccounts} onChange={(e) => handleInputChange('numberOfAccounts', e.target.value)} type="number" className="neumorphic-input" />
                  </div>
                </div>

                <h4 className="text-lg font-bold mb-4 text-center gradient-text">การกระจายงบประมาณ</h4>
                <div className="flex justify-center mb-8">
                   <div className="w-full max-w-sm flex flex-col gap-1.5 items-center">
                    {funnelData.map(({ name, value, color }, index) => {
                      const scale = 1 - index * 0.15;
                      return (
                        <div
                          key={index}
                          className="relative h-12 flex items-center justify-center text-white font-bold"
                          style={{
                            backgroundColor: color,
                            width: `${scale * 100}%`,
                            boxShadow: `0 0 15px ${color}`,
                            clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)',
                          }}
                        >
                          {name} {value}%
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="neumorphic-card p-4 relative">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-bold text-primary">TOFU</h5>
                      <span className="font-bold text-primary">{currentFunnelPlan.tofu}%</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><p className="opacity-70">ยอดรวม</p><p className="font-bold">{F.formatCurrency(calculated.tofuBudget)}</p></div>
                      <div><p className="opacity-70">ต่อบัญชี/เดือน</p><p className="font-bold">{F.formatCurrency((calculated.tofuBudget || 0) / numAccounts)}</p></div>
                      <div><p className="opacity-70">ต่อบัญชี/วัน</p><p className="font-bold">{F.formatCurrency((calculated.tofuBudget || 0) / numAccounts / 30)}</p></div>
                      <div><p className="opacity-70">จำนวนบัญชี</p><p className="font-bold">{F.formatInt(numAccounts)} บัญชี</p></div>
                    </div>
                  </div>
                   <div className="neumorphic-card p-4 relative">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-bold text-accent">MOFU</h5>
                       <span className="font-bold text-accent">{currentFunnelPlan.mofu}%</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><p className="opacity-70">ยอดรวม</p><p className="font-bold">{F.formatCurrency(calculated.mofuBudget)}</p></div>
                      <div><p className="opacity-70">ต่อบัญชี/เดือน</p><p className="font-bold">{F.formatCurrency((calculated.mofuBudget || 0) / numAccounts)}</p></div>
                      <div><p className="opacity-70">ต่อบัญชี/วัน</p><p className="font-bold">{F.formatCurrency((calculated.mofuBudget || 0) / numAccounts / 30)}</p></div>
                      <div><p className="opacity-70">จำนวนบัญชี</p><p className="font-bold">{F.formatInt(numAccounts)} บัญชี</p></div>
                    </div>
                  </div>
                   <div className="neumorphic-card p-4 relative">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-bold" style={{ color: 'hsl(157 71% 38%)' }}>BOFU</h5>
                       <span className="font-bold" style={{ color: 'hsl(157 71% 38%)' }}>{currentFunnelPlan.bofu}%</span>
                    </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><p className="opacity-70">ยอดรวม</p><p className="font-bold">{F.formatCurrency(calculated.bofuBudget)}</p></div>
                      <div><p className="opacity-70">ต่อบัญชี/เดือน</p><p className="font-bold">{F.formatCurrency((calculated.bofuBudget || 0) / numAccounts)}</p></div>
                      <div><p className="opacity-70">ต่อบัญชี/วัน</p><p className="font-bold">{F.formatCurrency((calculated.bofuBudget || 0) / numAccounts / 30)}</p></div>
                      <div><p className="opacity-70">จำนวนบัญชี</p><p className="font-bold">{F.formatInt(numAccounts)} บัญชี</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 text-white">Funnel Structure</h3>
              <div className="neumorphic-card p-6 space-y-8">
                {/* New Customer Structure */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-1/6 self-stretch">
                      <div className="bg-primary text-primary-foreground p-3 rounded-lg text-center h-full flex flex-col justify-center">
                        <h4 className="font-bold text-lg">ลูกค้าใหม่</h4>
                         <p className="text-xs mt-2 opacity-80">({F.formatCurrency(budgetPerAccountDay)}/วัน)</p>
                      </div>
                    </div>
                    <StructureLine />
                    <div className="w-1/4">
                      <StructureBox title="Campaign">
                        <div className="bg-background/80 rounded-md p-2 mt-2">
                          <p className="font-bold text-lg">Conversion</p>
                          <p className="font-bold text-2xl text-accent">CBO</p>
                        </div>
                        <p className="text-xs mt-2 opacity-80">งบ: {F.formatCurrency(budgetPerAccountDay)}</p>
                      </StructureBox>
                    </div>
                    <StructureLine hasArrow />
                    <div className="w-1/4">
                      <StructureBox title="Ad Set">
                        <div className="bg-background/80 rounded-md p-2 mt-1 space-y-1">
                          <p className="text-xs p-1 bg-gray-700/50 rounded">Interest</p>
                          <p className="text-xs p-1 bg-gray-700/50 rounded">Lookalike</p>
                        </div>
                         <p className="text-xs mt-2 opacity-80">{F.formatInt(numAccounts)} บัญชี</p>
                      </StructureBox>
                    </div>
                    <StructureLine hasArrow />
                     <div className="w-1/4">
                      <StructureBox title="Ads">
                        <div className="bg-background/80 rounded-md p-2 mt-1 space-y-1">
                           <p className="text-xs p-1 bg-gray-700/50 rounded">VDO 1</p>
                           <p className="text-xs p-1 bg-gray-700/50 rounded">VDO 2</p>
                           <p className="text-xs p-1 bg-gray-700/50 rounded">Dynamic Creative</p>
                        </div>
                      </StructureBox>
                    </div>
                  </div>
                </div>

                <div className="border-t border-primary/30 my-8"></div>

                {/* Retarget Structure */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="w-1/6 self-stretch">
                      <div className="bg-accent text-accent-foreground p-3 rounded-lg text-center h-full flex flex-col justify-center">
                        <h4 className="font-bold text-lg">Retarget</h4>
                      </div>
                    </div>
                     <StructureLine />
                    <div className="w-1/4">
                      <StructureBox title="Campaign">
                         <div className="bg-background/80 rounded-md p-2 mt-2">
                          <p className="font-bold text-lg">Conversion</p>
                          <p className="font-bold text-2xl text-accent">CBO</p>
                        </div>
                         <p className="text-xs mt-2 opacity-80">แยกตาม Stage</p>
                      </StructureBox>
                    </div>
                    <StructureLine hasArrow />
                    <div className="w-1/4">
                      <StructureBox title="Ad Set">
                        <div className="bg-background/80 rounded-md p-2 mt-1 space-y-1 text-xs">
                          <p className="p-1 bg-gray-700/50 rounded">ATC 7-14 วัน</p>
                          <p className="p-1 bg-gray-700/50 rounded">View Content 7 วัน</p>
                          <p className="p-1 bg-gray-700/50 rounded">Page/IG Engage 30 วัน</p>
                        </div>
                      </StructureBox>
                    </div>
                    <StructureLine hasArrow />
                     <div className="w-1/4">
                      <StructureBox title="Ads">
                        <div className="bg-background/80 rounded-md p-2 mt-1 space-y-1 text-xs">
                           <p className="p-1 bg-gray-700/50 rounded">โปรโมชั่น</p>
                           <p className="p-1 bg-gray-700/50 rounded">รีวิว/ผลลัพธ์</p>
                           <p className="p-1 bg-gray-700/50 rounded">คอนเทนต์ใหม่</p>
                        </div>
                      </StructureBox>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </TabsContent>
          <TabsContent value="funnel">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <h5 className="font-bold mb-3" style={{color: 'hsl(157 71% 38%)'}}>BOFU (Bottom of Funnel)</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                    {funnelObjectives.bofu.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="automation">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <Label htmlFor="automation-tool" className="block text-sm mb-2 font-medium opacity-80">เครื่องมืออัตโนมัติ</Label>
                   <Select value={inputs.automationTool} onValueChange={(val) => handleInputChange('automationTool', val)}>
                    <SelectTrigger id="automation-tool" className="neumorphic-select w-48"><SelectValue/></SelectTrigger>
                    <SelectContent>
                      {Object.entries(automationToolsConfig).map(([key, {name}]) => <SelectItem key={key} value={key}>{name}</SelectItem>)}
                    </SelectContent>
                  </Select>
              </div>
              <Button onClick={addRule} className="neon-button"><Plus className="w-4 h-4"/> เพิ่ม Rule ใหม่</Button>
            </div>
            <div className="space-y-4">
              {automationRules.map(rule => {
                const toolConfig = automationToolsConfig[inputs.automationTool];
                const actionConfig = toolConfig.actions.find(a => a.value === rule.action);

                return (
                  <div key={rule.id} className="neumorphic-card p-4">
                     <div className="flex justify-end -mt-2 -mr-2"><Button variant="ghost" size="icon" onClick={() => deleteRule(rule.id)}><X className="w-4 h-4 text-red-400"/></Button></div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="font-bold text-primary">IF</span>
                        <Select value={rule.metric} onValueChange={(v) => updateRule(rule.id, 'metric', v)}><SelectTrigger className="neumorphic-select w-40"/><SelectContent>{toolConfig.metrics.map(o => <SelectItem key={o.value} value={o.value}>{o.text}</SelectItem>)}</SelectContent></Select>
                        <Select value={rule.operator} onValueChange={(v) => updateRule(rule.id, 'operator', v)}><SelectTrigger className="neumorphic-select w-40"/><SelectContent>{toolConfig.operators.map(o => <SelectItem key={o.value} value={o.value}>{o.text}</SelectItem>)}</SelectContent></Select>
                        <Input value={rule.value} onChange={(e) => updateRule(rule.id, 'value', e.target.value)} className="neumorphic-input w-24" placeholder="Value"/>
                        <span className="font-bold text-accent">THEN</span>
                        <Select value={rule.action} onValueChange={(v) => updateRule(rule.id, 'action', v)}><SelectTrigger className="neumorphic-select w-48"/><SelectContent>{toolConfig.actions.map(o => <SelectItem key={o.value} value={o.value}>{o.text}</SelectItem>)}</SelectContent></Select>
                        {actionConfig?.needsValue && (
                          <Input value={rule.actionValue} onChange={(e) => updateRule(rule.id, 'actionValue', e.target.value)} className="neumorphic-input w-24" placeholder="Action Value"/>
                        )}
                        <Select value={rule.timeframe} onValueChange={(v) => updateRule(rule.id, 'timeframe', v)}><SelectTrigger className="neumorphic-select w-40"/><SelectContent>{toolConfig.timeframes.map(o => <SelectItem key={o.value} value={o.value}>{o.text}</SelectItem>)}</SelectContent></Select>
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
                   <Button size="sm" onClick={() => navigator.clipboard.writeText(n8nWorkflow.json)} className="absolute top-2 right-2">Copy</Button>
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

      <AlertDialog open={confirmModal.isOpen} onOpenChange={(isOpen) => !isOpen && setConfirmModal({isOpen: false, message: '', onConfirm: () => {}})}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>ยืนยันการกระทำ</AlertDialogTitle><AlertDialogDescription>{confirmModal.message}</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmModal({isOpen: false, message: '', onConfirm: () => {}})}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={() => { confirmModal.onConfirm(); setConfirmModal({isOpen: false, message: '', onConfirm: () => {}}); }}>ยืนยัน</AlertDialogAction>
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

    