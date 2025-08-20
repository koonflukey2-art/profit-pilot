

"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Bot, CalendarCheck, FileSliders, Filter, GanttChartSquare, History, Plus, RotateCcw, Save, Search, Settings, Trash2, X, Target, Heart, ThumbsUp, Hash, DollarSign, Megaphone, BarChart, Percent, Tv, LineChart, Users, BrainCircuit, Info, Scaling, Briefcase, FileText, Zap, ClipboardCopy, Facebook, Wand, CheckIcon, ChevronDown, Play, Pause, ArrowUpRight, ArrowUp, ArrowDownRight, Square } from 'lucide-react';
import { generateUiTitles } from './actions';
import { Progress } from '../ui/progress';

const RevealBotMockup = () => {
  return (
    <div className="bg-[#1E2227] p-8 rounded-lg font-sans w-full max-w-4xl mx-auto my-10 shadow-2xl">
      <div className="relative">
        {/* Blurred Background for Dropdown */}
        <div className="absolute top-24 left-0 w-full h-48 bg-black/10 backdrop-blur-sm z-10"></div>
        
        {/* Rule Name Bar */}
        <div className="relative z-20 mb-4">
          <Input 
            value="ชื่อกฎ (เช่น ‘ปิด Ad Set ขาดทุน’)" 
            readOnly
            className="w-full bg-[#2A2F36] border-[#4A4F56] text-white text-base py-3 px-4 rounded-md placeholder-gray-400"
          />
        </div>

        {/* Condition Row */}
        <div className="relative z-20 flex items-center space-x-3 bg-[#2A2F36] p-3 rounded-lg border border-[#4A4F56]">
          <div className="bg-[#1877F2] w-7 h-7 flex items-center justify-center rounded-md">
            <Facebook className="w-5 h-5 text-white" fill="white" />
          </div>

          <div className="relative">
            <Button variant="outline" className="bg-[#3A3F46] border-[#5A5F66] text-white">
              Purchase ROAS <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <Select>
            <SelectTrigger className="w-auto bg-[#3A3F46] border-[#5A5F66] text-white">
              <SelectValue placeholder="is greater than" />
            </SelectTrigger>
          </Select>

          <Input type="number" value="1" readOnly className="w-20 bg-[#3A3F46] border-[#5A5F66] text-white text-center" />

          <Select>
            <SelectTrigger className="w-auto bg-[#3A3F46] border-[#5A5F66] text-white">
              <SelectValue placeholder="วัน" />
            </SelectTrigger>
          </Select>
        </div>
        
        {/* Forced Open Dropdown */}
        <div className="absolute top-[7.5rem] left-[5rem] w-64 bg-[#2C3138] rounded-lg shadow-2xl border border-[#4A4F56] z-30">
          <div className="p-1">
            <div className="px-3 py-2 text-sm text-gray-400">Common</div>
            <div className="flex items-center justify-between px-3 py-2 text-sm text-white rounded-md cursor-pointer hover:bg-[#3A3F46]">
              Cost per Result
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-sm text-white rounded-md cursor-pointer bg-[#359F8C]">
              <span>Purchase ROAS</span>
              <CheckIcon className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-sm text-white rounded-md cursor-pointer hover:bg-[#3A3F46]">
              Lifetime Spend
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-sm text-white rounded-md cursor-pointer hover:bg-[#3A3F46]">
              Frequency
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-sm text-white rounded-md cursor-pointer hover:bg-[#3A3F46]">
              CPM
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="relative z-0 mt-6 ml-10 flex flex-col space-y-3">
          <div className="flex items-center space-x-3 text-sm text-gray-300">
            <Play className="w-5 h-5 text-yellow-400" />
            <span>Start (เปิดแอด)</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-300">
            <Pause className="w-5 h-5 text-yellow-400" />
            <span>Pause (หยุดแอด)</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-300">
            <ArrowUpRight className="w-5 h-5 text-yellow-400" />
            <span>Increase budget (เพิ่มงบประมาณ CBO หรือ ABO)</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-300">
            <ArrowUp className="w-5 h-5 text-yellow-400" />
            <span>Set budget (ตั้งงบประมาณ CBO หรือ ABO)</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-300">
            <ArrowUpRight className="w-5 h-5 text-yellow-400" />
            <span>Increase spending limits (เพิ่มวงเงินที่ชุดโฆษณา)</span>
          </div>
           <div className="flex items-center space-x-3 text-sm text-gray-300">
            <ArrowUp className="w-5 h-5 text-yellow-400" />
            <span>Set spending limits (ตั้งวงเงินที่ชุดโฆษณา)</span>
          </div>
        </div>
      </div>
    </div>
  );
};


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
  budgetingStrategy: 'cbo'
};

const iconMap = {
  Facebook,
  Bot,
  Wand,
};

export function ProfitPilotPage() {
  const [isClient, setIsClient] = useState(false);
  const [inputs, setInputs] = useState(initialInputs);
  const [calculated, setCalculated] = useState({
    grossProfitUnit: 0,
    breakevenRoas: 0,
    breakevenCpa: 0,
    breakevenAdCostPercent: 0,
    targetOrders: 0,
    targetOrdersDaily: 0,
    targetRevenue: 0,
    adBudget: 0,
    adBudgetWithVat: 0,
    tofuBudget: 0,
    mofuBudget: 0,
    bofuBudget: 0,
    tofuBudgetPerAccountMonthly: 0,
    mofuBudgetPerAccountMonthly: 0,
    bofuBudgetPerAccountMonthly: 0,
    tofuBudgetPerAccountDaily: 0,
    mofuBudgetPerAccountDaily: 0,
    bofuBudgetPerAccountDaily: 0,
    netProfitUnit: 0,
    targetRoas: 0,
    targetCpa: 0,
    adCostPercent: 0,
    priceBeforeVat: 0,
  });
  const [automationRules, setAutomationRules] = useState([]);
  const [uiTitles, setUiTitles] = useState({ productInfoTitle: 'ข้อมูลสินค้า', costCalculationTitle: 'คำนวณต้นทุน', goalsAndResultsTitle: 'เป้าหมายและผลลัพธ์', advancedPlanningTitle: 'Advanced Planning' });
  const [activeTab, setActiveTab] = useState('metrics');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: () => {} });
  const [n8nWorkflow, setN8nWorkflow] = useState({ json: null, loading: false });
  const [theme, setTheme] = useState('dark');
  const [funnelStageFilter, setFunnelStageFilter] = useState('all');
  const [aiAdvice, setAiAdvice] = useState({ recommendations: '', insights: '', loading: false });
  
  const { toast } = useToast();

  const handleInputChange = useCallback((key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const calculateAll = useCallback(() => {
    const newInputs = { ...inputs };
    const s = {};
  
    s.sellingPrice = F.num(newInputs.sellingPrice);
    s.priceBeforeVat = s.sellingPrice / (1 + F.num(newInputs.vatProduct) / 100);
    s.cogs = F.num(newInputs.cogs);
    s.platformFeeCost = s.priceBeforeVat * (F.num(newInputs.platformFee) / 100);
    s.paymentFeeCost = s.sellingPrice * (F.num(newInputs.paymentFee) / 100);
    s.kolFeeCost = s.priceBeforeVat * (F.num(newInputs.kolFee) / 100);
    s.packagingCost = F.num(newInputs.packagingCost);
    s.shippingCost = F.num(newInputs.shippingCost);
    s.totalVariableCost = s.cogs + s.platformFeeCost + s.paymentFeeCost + s.kolFeeCost + s.packagingCost + s.shippingCost;
    s.grossProfitUnit = s.priceBeforeVat - s.totalVariableCost;
  
    s.breakevenRoas = s.grossProfitUnit > 0 ? s.priceBeforeVat / s.grossProfitUnit : 0;
    s.breakevenCpa = s.grossProfitUnit;
    s.breakevenAdCostPercent = s.priceBeforeVat > 0 ? (s.breakevenCpa / s.priceBeforeVat) * 100 : 0;
  
    let targetRoas = F.num(newInputs.targetRoas);
    let targetCpa = F.num(newInputs.targetCpa);
    let adCostPercent = F.num(newInputs.adCostPercent);
  
    if (s.priceBeforeVat > 0) {
      if (newInputs.calcDriver === 'roas') {
        targetCpa = targetRoas > 0 ? s.priceBeforeVat / targetRoas : 0;
        adCostPercent = s.priceBeforeVat > 0 ? (targetCpa / s.priceBeforeVat) * 100 : 0;
      } else if (newInputs.calcDriver === 'cpa') {
        targetRoas = targetCpa > 0 ? s.priceBeforeVat / targetCpa : 0;
        adCostPercent = s.priceBeforeVat > 0 ? (targetCpa / s.priceBeforeVat) * 100 : 0;
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
    const profitGoal = F.num(newInputs.profitGoal);
    const fixedCosts = F.num(newInputs.fixedCosts);
    const monthlyProfitGoal = newInputs.profitGoalTimeframe === 'daily' ? profitGoal * 30 : profitGoal;
    const totalProfitTarget = monthlyProfitGoal + fixedCosts;
    s.targetOrders = s.netProfitUnit > 0 ? totalProfitTarget / s.netProfitUnit : 0;
    s.targetRevenue = s.targetOrders * s.sellingPrice;
    s.adBudget = s.targetOrders * targetCpa;
    s.targetOrdersDaily = s.targetOrders / 30;

    s.adBudgetWithVat = s.adBudget * (1 + (F.num(newInputs.vatProduct) / 100));
  
    const funnelPlan = funnelPlans[newInputs.funnelPlan] || funnelPlans.launch;
    s.tofuBudget = s.adBudget * (funnelPlan.tofu / 100);
    s.mofuBudget = s.adBudget * (funnelPlan.mofu / 100);
    s.bofuBudget = s.adBudget * (funnelPlan.bofu / 100);

    const numAccounts = F.num(newInputs.numberOfAccounts) || 1;
    s.tofuBudgetPerAccountMonthly = s.tofuBudget / numAccounts;
    s.mofuBudgetPerAccountMonthly = s.mofuBudget / numAccounts;
    s.bofuBudgetPerAccountMonthly = s.bofuBudget / numAccounts;
    s.tofuBudgetPerAccountDaily = s.tofuBudgetPerAccountMonthly / 30;
    s.mofuBudgetPerAccountDaily = s.mofuBudgetPerAccountMonthly / 30;
    s.bofuBudgetPerAccountDaily = s.bofuBudgetPerAccountMonthly / 30;
    
    setCalculated(s);

    const updatedInputs = {...newInputs};
    let changed = false;

    if (newInputs.calcDriver !== 'roas' && isFinite(targetRoas) && F.num(newInputs.targetRoas).toFixed(2) !== targetRoas.toFixed(2)) {
      updatedInputs.targetRoas = targetRoas > 0 ? targetRoas.toFixed(2) : '';
      changed = true;
    }
    if (newInputs.calcDriver !== 'cpa' && isFinite(targetCpa) && F.num(newInputs.targetCpa).toFixed(2) !== targetCpa.toFixed(2)) {
      updatedInputs.targetCpa = targetCpa > 0 ? targetCpa.toFixed(2) : '';
      changed = true;
    }
    if (newInputs.calcDriver !== 'adcost' && isFinite(adCostPercent) && F.num(newInputs.adCostPercent).toFixed(1) !== adCostPercent.toFixed(1)) {
      updatedInputs.adCostPercent = adCostPercent > 0 ? adCostPercent.toFixed(1) : '';
      changed = true;
    }

    if (changed) {
        setInputs(updatedInputs);
    }
  
    if (newInputs.calcDriver === 'roas' && targetRoas > 0 && s.breakevenRoas > 0 && targetRoas < s.breakevenRoas) {
      toast({
        variant: "destructive",
        title: "Warning",
        description: "เป้าหมาย ROAS ต่ำกว่าจุดคุ้มทุน อาจทำให้ขาดทุนได้",
      })
    }
  }, [inputs, toast]);


  useEffect(() => {
    calculateAll();
  }, [inputs.sellingPrice, inputs.vatProduct, inputs.cogs, inputs.platformFee, inputs.paymentFee, inputs.kolFee, inputs.packagingCost, inputs.shippingCost, inputs.profitGoal, inputs.profitGoalTimeframe, inputs.fixedCosts, inputs.targetRoas, inputs.targetCpa, inputs.adCostPercent, inputs.calcDriver, inputs.funnelPlan, inputs.numberOfAccounts, inputs.budgetingStrategy, calculateAll]);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
        try {
            const savedHistory = JSON.parse(localStorage.getItem('profitPlannerHistory') || '[]');
            setHistory(savedHistory);
            
            const savedTheme = localStorage.getItem('profitPlannerTheme') || 'dark';
            setTheme(savedTheme);
        } catch (error) {
            console.error("Could not access localStorage:", error);
        }
    }
  }, []);
  
  useEffect(() => {
    if (isClient) {
        try {
            localStorage.setItem('profitPlannerTheme', theme);
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(theme);
        } catch (error) {
            console.error("Could not access localStorage:", error);
        }
    }
  }, [theme, isClient]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (!isClient) return;
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
  }, [inputs.productName, inputs.businessType, inputs.profitGoal, inputs.fixedCosts, isClient]);

  const autoDetectBusinessType = useCallback(() => {
    const combinedText = `${inputs.productName} ${inputs.productKeywords}`.toLowerCase();
    if (!combinedText.trim()) return;

    for (const [type, keywords] of Object.entries(businessTypeKeywords)) {
      if (keywords.some(kw => combinedText.includes(kw))) {
        handleInputChange('businessType', type);
        return;
      }
    }
  }, [inputs.productName, inputs.productKeywords, handleInputChange]);

  useEffect(() => {
    if (!isClient) return;
    const timer = setTimeout(() => {
        autoDetectBusinessType();
    }, 300);
    return () => clearTimeout(timer);
  }, [inputs.productName, inputs.productKeywords, autoDetectBusinessType, isClient]);

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
    if (typeof window === 'undefined') return;
    const planName = inputs.productName || 'แผนที่ไม่ได้ตั้งชื่อ';
    const newHistory = [{
      id: Date.now(),
      name: planName,
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
    if (typeof window === 'undefined') return;
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
        if (typeof window === 'undefined') return;
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
      name: '',
      level: toolConfig.levels[0].value,
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
    if (automationRules.length === 0) {
      toast({ variant: "destructive", title: "No Rules", description: "Please add at least one automation rule." });
      return;
    }
    setN8nWorkflow({ json: null, loading: true });
    
    const n8nWorkflowName = (document.getElementById('n8nWorkflowName') as HTMLInputElement)?.value;
    const n8nPrimaryGoal = (document.getElementById('n8nPrimaryGoal') as HTMLInputElement)?.value;
    
    try {
      const { generateAutomationWorkflow } = await import('./actions');
      const result = await generateAutomationWorkflow({
        workflowName: n8nWorkflowName || "Profit Pilot Workflow",
        primaryGoal: n8nPrimaryGoal || "Scale Revenue & Optimize CPA",
        platforms: [inputs.automationTool],
        features: automationRules.map(r => r.action),
        rules: automationRules
      });
      setN8nWorkflow({ json: result.workflowJson, loading: false });
      toast({ title: "Success", description: "n8n Workflow JSON generated successfully!" });
    } catch (error) {
      setN8nWorkflow({ json: null, loading: false });
      toast({ variant: "destructive", title: "Error", description: "Failed to generate workflow." });
    }
  };

  const fetchAiAdvice = useCallback(async () => {
    setAiAdvice(prev => ({...prev, loading: true}));
    try {
      const { getMetricsAdvice } = await import('./actions');
      const advice = await getMetricsAdvice({
        businessType: funnelObjectivesData[inputs.businessType]?.name || inputs.businessType,
        profitGoal: F.num(inputs.profitGoal),
        fixedCosts: F.num(inputs.fixedCosts),
        sellingPrice: F.num(inputs.sellingPrice),
        cogs: F.num(inputs.cogs),
        targetRoas: calculated.targetRoas,
        targetCpa: calculated.targetCpa,
        funnelPlan: funnelPlans[inputs.funnelPlan]?.name || inputs.funnelPlan,
        metricsPlan: metricsPlans[inputs.metricsPlan]?.name || inputs.metricsPlan,
      });
      setAiAdvice({ ...advice, loading: false });
    } catch (error) {
      toast({ variant: "destructive", title: "AI Advisor Error", description: "Failed to get AI-powered advice." });
      setAiAdvice({ recommendations: '', insights: '', loading: false });
    }
  }, [inputs, calculated, toast]);

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
  
  const funnelData = useMemo(() => {
    const data = [
      { name: 'TOFU', value: currentFunnelPlan.tofu, color: '#2196F3' },
      { name: 'MOFU', value: currentFunnelPlan.mofu, color: '#29B6F6' },
      { name: 'BOFU', value: currentFunnelPlan.bofu, color: '#4DD0E1' },
    ];
    return data;
  }, [currentFunnelPlan]);

  const FunnelChart = ({ data }) => {
    if (!data.length) return null;
  
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);
    if (totalValue === 0) return null;
  
    const chartData = data;

    return (
      <div className="w-full flex justify-center items-end my-4 py-4 min-h-[300px]">
        <div className="flex flex-col items-center justify-end w-full max-w-sm space-y-2">
          {chartData.map((item, index) => {
            const layerStyle: React.CSSProperties = {
                width: `${100 - (index * 20)}%`, // Visually represent funnel shape
                height: `${item.value}%`,
                minHeight: '40px',
                clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0% 100%)',
                backgroundColor: item.color,
                boxShadow: `0 0 15px ${item.color}, 0 0 25px ${item.color}66`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                textShadow: '0 0 5px #000, 0 0 10px #000',
            };
            return (
              <div key={item.name} style={layerStyle}>
                {item.name} {item.value}%
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const FloatingIcon = ({ icon, className = '', size = 'md', style = {} }) => {
    const IconComponent = icon;
    const sizeClasses = {
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
    };
    return (
      <div className={cn("absolute bg-card/50 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-lg border border-primary/20", className)} style={style}>
        <IconComponent className={cn(sizeClasses[size], "text-primary opacity-90")} />
      </div>
    );
  };
  
  const FunnelStructure = ({ data }) => {
    if (!data || data.length === 0) return null;

    const stageBoxWidth = 100;
    const campaignBoxWidth = 150;
    const adGroupBoxWidth = 150;
    const adBoxWidth = 144;
    const mainGap = 48; 
    const verticalGap = 16;
  
    return (
      <div className="relative p-4 md:p-8 min-w-[800px] overflow-x-auto">
        {data.map((funnel, funnelIndex) => {
          const adGroupsHeight = funnel.adGroups.reduce((acc, _, i) => acc + 50 + (i > 0 ? verticalGap : 0), 0);
          const adsHeight = funnel.ads.reduce((acc, _, i) => acc + 40 + (i > 0 ? verticalGap : 0), 0);
          const funnelHeight = Math.max(adGroupsHeight, adsHeight, 100) + 2 * verticalGap;
  
          const campaignY = (funnelHeight / 2) - 48;
          const stageX = 0;
          const campaignX = stageX + stageBoxWidth + mainGap;
          const adGroupX = campaignX + campaignBoxWidth + mainGap;
          const adX = adGroupX + adGroupBoxWidth + mainGap;
  
          const adGroupYPositions = funnel.adGroups.map((_, i) => {
            const totalHeight = funnel.adGroups.length * 50 + (funnel.adGroups.length - 1) * verticalGap;
            const startY = (funnelHeight - totalHeight) / 2;
            return startY + i * (50 + verticalGap);
          });
  
          const adYPositions = funnel.ads.map((_, i) => {
            const totalHeight = funnel.ads.length * 40 + (funnel.ads.length - 1) * verticalGap;
            const startY = (funnelHeight - totalHeight) / 2;
            return startY + i * (40 + verticalGap);
          });
  
          return (
            <div key={funnel.stage} className="relative" style={{ height: funnelHeight + verticalGap }}>
              {/* Lines SVG */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {/* Line from Campaign to Ad Group main vertical line */}
                <line 
                  x1={campaignX + campaignBoxWidth} 
                  y1={campaignY + 48} 
                  x2={adGroupX} 
                  y2={campaignY + 48} 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="2" 
                />
  
                {/* Ad Group main vertical line */}
                <line
                  x1={adGroupX}
                  y1={adGroupYPositions[0] + 25}
                  x2={adGroupX}
                  y2={adGroupYPositions[adGroupYPositions.length - 1] + 25}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                />

                {/* Lines from vertical to each Ad Group */}
                {adGroupYPositions.map((y, i) => (
                  <line
                    key={`adgroup-h-line-${i}`}
                    x1={adGroupX}
                    y1={y + 25}
                    x2={adGroupX + adGroupBoxWidth}
                    y2={y + 25}
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                  />
                ))}

                {/* Lines from Ad Groups to Ads */}
                 {adGroupYPositions.map((y, i) => (
                  <line
                    key={`adgroup-to-ad-line-${i}`}
                    x1={adGroupX + adGroupBoxWidth}
                    y1={y + 25}
                    x2={adX}
                    y2={adYPositions[i] + 20}
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                  />
                 ))}
                 {/* This is a simplified connection. For a more complex one, you'd need more logic */}
                 <line
                    x1={adGroupX + adGroupBoxWidth}
                    y1={adGroupYPositions[adGroupYPositions.length-1] + 25}
                    x2={adX}
                    y2={adYPositions[adYPositions.length-1] + 20}
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                  />
              </svg>
  
              {/* Stage Box */}
              <div className="absolute flex flex-col items-center justify-center" style={{ left: stageX, top: 0, height: funnelHeight, width: stageBoxWidth }}>
                <div className="neumorphic-card w-full h-16 flex items-center justify-center text-center">
                  <span className="font-bold text-lg">{funnel.stage}</span>
                </div>
              </div>
  
              {/* Campaign Box */}
              <div className="absolute" style={{ left: campaignX, top: campaignY }}>
                <div className="neumorphic-card w-[150px] h-24 flex flex-col items-center justify-center p-2 text-sm text-center">
                  <p className="font-bold">{funnel.campaign.title}</p>
                  <p>{funnel.campaign.budget}</p>
                  <p>{funnel.campaign.accounts}</p>
                </div>
              </div>
  
              {/* Ad Group Boxes */}
              <div className="absolute" style={{ left: adGroupX }}>
                <div className="flex flex-col" style={{gap: `${verticalGap}px`}}>
                  {funnel.adGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="neumorphic-card flex flex-col items-center justify-center p-2 h-[50px] w-full text-xs text-center" style={{ width: adGroupBoxWidth, top: adGroupYPositions[groupIndex] }}>
                      <p className="font-bold">{group.title}</p>
                      {group.subtitle && <p>{group.subtitle}</p>}
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Ad Boxes */}
              <div className="absolute" style={{ left: adX }}>
                <div className="flex flex-col" style={{gap: `${verticalGap}px`}}>
                  {funnel.ads.map((ad, adIndex) => (
                    <div key={adIndex} className={cn("neumorphic-card p-2 h-[40px] text-sm text-center flex items-center justify-center font-bold")} style={{ width: adBoxWidth, top: adYPositions[adIndex] }}>
                      {ad}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const summaryFunnelData = useMemo(() => ([
    {
      stage: 'ลูกค้าใหม่',
      campaign: {
        title: 'CBO / ABO',
        budget: `งบ/วัน: ${F.formatCurrency(calculated.tofuBudgetPerAccountDaily)} ฿`,
        accounts: `${F.formatInt(numAccounts)} บัญชี`,
      },
      adGroups: [
        { title: 'Demographic', subtitle: '(ประชากรศาสตร์)' },
        { title: 'Interest', subtitle: '(ความสนใจ)' },
        { title: 'Behavior', subtitle: '(พฤติกรรม)' },
        { title: 'Lookalike' },
      ],
      ads: ['VDO 1', 'VDO 2', 'รูปภาพ'],
    },
    {
      stage: 'Retarget',
      campaign: {
        title: 'CBO / ABO',
        budget: `งบ/วัน: ${F.formatCurrency(calculated.bofuBudgetPerAccountDaily)} ฿`,
        accounts: `${F.formatInt(numAccounts)} บัญชี`,
      },
      adGroups: [
        { title: 'INBOX', subtitle: '7,15,30 วัน' },
        { title: 'VDO75%', subtitle: '3,7,15,30 วัน' },
        { title: 'ENGAGE', subtitle: '3,7,15,30 วัน' },
      ],
      ads: ['VDO ปิด', 'โปรโมชั่น', 'รีวิว/ผลลัพธ์'],
    },
  ]), [calculated, numAccounts]);


  const SummaryInfoCard = ({ title, value, subValue, icon: Icon }) => (
    <Card className="neumorphic-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
        </CardContent>
    </Card>
);

  if (!isClient) {
      return (
        <div className="w-full h-screen flex items-center justify-center bg-background">
          <p className="text-foreground">Loading...</p>
        </div>
      );
  }
  
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
              <div className="space-y-3 pt-4">
                  <div className="neumorphic-card p-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="opacity-80">กำไรขั้นต้น/หน่วย</span>
                      <span className="font-bold text-primary">{F.formatCurrency(calculated.grossProfitUnit)}</span>
                    </div>
                  </div>
                  <div className="neumorphic-card p-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="opacity-80">จุดคุ้มทุน ROAS</span>
                      <span className="font-bold text-primary">{F.formatNumber(calculated.breakevenRoas)}</span>
                    </div>
                  </div>
                  <div className="neumorphic-card p-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="opacity-80">ยอดขายเป้าหมาย</span>
                      <span className="font-bold text-primary">{F.formatCurrency(calculated.targetRevenue)}</span>
                    </div>
                  </div>
                  <div className="neumorphic-card p-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="opacity-80">จำนวนออเดอร์</span>
                      <span className="font-bold text-primary">{F.formatInt(calculated.targetOrders)} <span className="text-xs opacity-70">({F.formatNumber(calculated.targetOrdersDaily, 1)}/วัน)</span></span>
                    </div>
                  </div>
                  <div className="neumorphic-card p-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="opacity-80">งบโฆษณา</span>
                      <span className="font-bold text-primary">{F.formatCurrency(calculated.adBudget)}</span>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="neumorphic-card p-6 mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="tab-nav mb-6 grid w-full grid-cols-3 md:grid-cols-7 bg-background shadow-inner">
            <TabsTrigger value="metrics" className="tab-button"><CalendarCheck className="w-4 h-4"/>Metrics แนะนำ</TabsTrigger>
            <TabsTrigger value="planning" className="tab-button"><GanttChartSquare className="w-4 h-4"/>การวางแผน</TabsTrigger>
            <TabsTrigger value="funnel" className="tab-button"><Filter className="w-4 h-4"/>กลยุทธ์ Funnel</TabsTrigger>
            <TabsTrigger value="automation" className="tab-button"><Bot className="w-4 h-4"/>สร้าง Rule</TabsTrigger>
            <TabsTrigger value="workflow" className="tab-button"><Zap className="w-4 h-4"/>Workflow Generator</TabsTrigger>
            <TabsTrigger value="summary" className="tab-button"><FileText className="w-4 h-4"/>สรุปแผน</TabsTrigger>
            <TabsTrigger value="history" className="tab-button"><History className="w-4 h-4"/>ประวัติ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Overview Card */}
              <Card className="neumorphic-card lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Info className="w-6 h-6 text-primary"/> ภาพรวมแผน</CardTitle>
                  <CardDescription>สรุปข้อมูลหลักและเป้าหมายของแผนที่คุณวางไว้</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg">
                      <Briefcase className="w-8 h-8 text-primary"/>
                      <div>
                        <p className="text-sm text-muted-foreground">สินค้า/ธุรกิจ</p>
                        <p className="font-bold">{inputs.productName || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{funnelObjectivesData[inputs.businessType]?.name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg">
                      <Target className="w-8 h-8 text-primary"/>
                      <div>
                        <p className="text-sm text-muted-foreground">เป้าหมายกำไร</p>
                        <p className="font-bold">{F.formatCurrency(inputs.profitGoal)}</p>
                        <p className="text-xs text-muted-foreground">{inputs.profitGoalTimeframe === 'monthly' ? 'ต่อเดือน' : 'ต่อวัน'}</p>
                      </div>
                    </div>
                     <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg">
                      <Scaling className="w-8 h-8 text-primary"/>
                      <div>
                        <p className="text-sm text-muted-foreground">ค่าใช้จ่ายคงที่</p>
                        <p className="font-bold">{F.formatCurrency(inputs.fixedCosts)}</p>
                         <p className="text-xs text-muted-foreground">ต่อเดือน</p>
                      </div>
                    </div>
                </CardContent>
              </Card>

              {/* Calculation Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-3">
                <SummaryInfoCard title="ราคาขาย (ต่อหน่วย)" value={F.formatCurrency(calculated.priceBeforeVat)} subValue={`รวม VAT: ${F.formatCurrency(inputs.sellingPrice)}`} icon={DollarSign} />
                <SummaryInfoCard title="กำไรขั้นต้น (ต่อหน่วย)" value={F.formatCurrency(calculated.grossProfitUnit)} subValue="ราคาขาย(ไม่รวม VAT) - ต้นทุนแปรผันทั้งหมด" icon={BarChart} />
                <SummaryInfoCard title="กำไรสุทธิ (ต่อหน่วย)" value={F.formatCurrency(calculated.netProfitUnit)} subValue="กำไรขั้นต้น - ค่าโฆษณาต่อหน่วย (CPA)" icon={LineChart} />
                <SummaryInfoCard title="งบโฆษณา (ต่อหน่วย)" value={F.formatCurrency(calculated.targetCpa)} subValue="Target CPA ที่คำนวณได้" icon={Megaphone} />
              </div>

              {/* Goals & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-3">
                <SummaryInfoCard title="ยอดขายเป้าหมาย (ต่อเดือน)" value={F.formatCurrency(calculated.targetRevenue)} icon={Users} />
                <SummaryInfoCard title="จำนวนออเดอร์ (ต่อเดือน)" value={F.formatInt(calculated.targetOrders)} subValue={`เฉลี่ย ${F.formatNumber(calculated.targetOrdersDaily, 1)} ออเดอร์/วัน`} icon={ThumbsUp} />
                <SummaryInfoCard title="งบโฆษณารวม (ต่อเดือน)" value={F.formatCurrency(calculated.adBudget)} icon={Percent} />
                 <SummaryInfoCard title="งบโฆษณา + VAT (ต่อเดือน)" value={F.formatCurrency(calculated.adBudgetWithVat)} subValue={`VAT ${inputs.vatProduct}%`} icon={Hash} />
              </div>
              
              {/* KPIs */}
              <div className="lg:col-span-3">
                 <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Target className="w-5 h-5 text-primary"/>ตัวชี้วัด (KPIs)</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="neumorphic-card p-4 text-center bg-red-900/20 border-red-500/50">
                        <p className="font-bold text-red-400">BE ROAS</p>
                        <p className="text-2xl font-bold text-red-400">{F.formatNumber(calculated.breakevenRoas)}</p>
                        <p className="text-xs text-red-200/70">ROAS คุ้มทุน</p>
                    </div>
                    <div className="neumorphic-card p-4 text-center bg-red-900/20 border-red-500/50">
                        <p className="font-bold text-red-400">BE CPA</p>
                        <p className="text-2xl font-bold text-red-400">{F.formatCurrency(calculated.breakevenCpa)}</p>
                        <p className="text-xs text-red-200/70">CPA คุ้มทุน</p>
                    </div>
                    <div className="neumorphic-card p-4 text-center bg-green-900/20 border-green-500/50">
                        <p className="font-bold text-green-400">Target ROAS</p>
                        <p className="text-2xl font-bold text-green-400">{F.formatNumber(calculated.targetRoas)}</p>
                         <p className="text-xs text-green-200/70">ROAS เป้าหมาย</p>
                    </div>
                    <div className="neumorphic-card p-4 text-center bg-green-900/20 border-green-500/50">
                        <p className="font-bold text-green-400">Target CPA</p>
                        <p className="text-2xl font-bold text-green-400">{F.formatCurrency(calculated.targetCpa)}</p>
                         <p className="text-xs text-green-200/70">CPA เป้าหมาย</p>
                    </div>
                 </div>
              </div>

               {/* AI Advisor */}
              <div className="lg:col-span-3">
                  <Card className="neumorphic-card">
                      <CardHeader>
                          <CardTitle className="flex items-center gap-2"><BrainCircuit className="w-6 h-6 text-primary"/> AI Advisor</CardTitle>
                          <CardDescription>รับคำแนะนำและข้อมูลเชิงลึกจาก AI เพื่อปรับปรุงแผนของคุณ</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <Button onClick={fetchAiAdvice} disabled={aiAdvice.loading} className="w-full neon-button">
                              {aiAdvice.loading ? 'กำลังวิเคราะห์...' : 'ขอคำแนะนำจาก AI'}
                          </Button>
                          {aiAdvice.loading && <Progress value={50} className="w-full mt-4" />}
                          {!aiAdvice.loading && (aiAdvice.recommendations || aiAdvice.insights) && (
                            <div className="mt-4 space-y-4 text-sm">
                                {aiAdvice.recommendations && (
                                  <div>
                                      <h4 className="font-bold mb-2">คำแนะนำ (Recommendations):</h4>
                                      <p className="p-4 bg-background/50 rounded-lg whitespace-pre-wrap">{aiAdvice.recommendations}</p>
                                  </div>
                                )}
                                {aiAdvice.insights && (
                                  <div>
                                      <h4 className="font-bold mb-2">ข้อมูลเชิงลึก (Insights):</h4>
                                      <p className="p-4 bg-background/50 rounded-lg whitespace-pre-wrap">{aiAdvice.insights}</p>
                                  </div>
                                )}
                            </div>
                          )}
                      </CardContent>
                  </Card>
              </div>
            </div>
          </TabsContent>
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
                     <h4 className="text-lg font-bold mb-4 text-red-500">ค่า Breakeven</h4>
                     <div className="space-y-4">
                        <div className="neumorphic-card p-4">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-red-500">BE ROAS</p>
                                <p className="font-bold text-xl text-red-500">{F.formatNumber(calculated.breakevenRoas)}</p>
                            </div>
                            <p className="text-xs text-red-200 mt-1">ค่า ROAS ต่ำสุดที่แคมเปญต้องทำให้ได้เพื่อ "เท่าทุน"</p>
                        </div>
                        <div className="neumorphic-card p-4">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-red-500">BE CPA</p>
                                <p className="font-bold text-xl text-red-500">{F.formatCurrency(calculated.breakevenCpa)}</p>
                            </div>
                            <p className="text-xs text-red-200 mt-1">ค่าโฆษณาสูงสุดที่จ่ายได้โดยไม่ขาดทุน</p>
                        </div>
                        <div className="neumorphic-card p-4">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-red-500">BE Ad Cost %</p>
                                <p className="font-bold text-xl text-red-500">{F.formatNumber(calculated.breakevenAdCostPercent, 0)}%</p>
                            </div>
                             <p className="text-xs text-red-200 mt-1">สัดส่วนค่าโฆษณาสูงสุดเมื่อเทียบกับราคาขาย</p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-primary" />
                การกระจายงบประมาณ
              </h3>
              <div className="neumorphic-card p-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                    <Label htmlFor="budgetingStrategy" className="block text-sm mb-2 font-medium opacity-80">รูปแบบการตั้งงบ</Label>
                    <Select value={inputs.budgetingStrategy} onValueChange={(val) => handleInputChange('budgetingStrategy', val)}>
                      <SelectTrigger id="budgetingStrategy" className="neumorphic-select"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cbo">ตั้งงบที่แคมเปญ (CBO)</SelectItem>
                        <SelectItem value="abo">ตั้งงบที่ชุดโฆษณา (ABO)</SelectItem>
                        <SelectItem value="max_spending">ตั้งวงเงินสูงสุด ที่ชุดโฆษณา (Max Spending Limit)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="numberOfAccounts" className="block text-sm mb-2 font-medium opacity-80">จำนวนบัญชีโฆษณา</Label>
                    <Input id="numberOfAccounts" value={inputs.numberOfAccounts} onChange={(e) => handleInputChange('numberOfAccounts', e.target.value)} type="number" className="neumorphic-input" />
                  </div>
                </div>

                <h4 className="text-lg font-bold mb-4 text-center gradient-text">การกระจายงบประมาณ</h4>
                <div className="flex justify-center mb-8 px-4">
                   <div className="relative w-full max-w-4xl min-h-[400px] flex items-center justify-center">
                    {/* Floating Icons */}
                    <FloatingIcon icon={LineChart} className="top-0 left-1/4 animate-bounce" size="lg" />
                    <FloatingIcon icon={BarChart} className="top-0 right-1/4 animate-bounce" size="lg" />
                    <FloatingIcon icon={Users} className="top-1/3 left-8" size="lg"/>
                    <FloatingIcon icon={Target} className="top-1/3 right-8" size="lg" />
                    <FloatingIcon icon={Megaphone} className="top-2/3 left-10" size="lg" />
                    <FloatingIcon icon={Heart} className="top-2/3 right-10" size="lg" />
                    <FloatingIcon icon={Tv} className="bottom-0 left-1/4" size="lg" />
                    <FloatingIcon icon={DollarSign} className="bottom-0 right-1/4" size="lg" />
                    <FloatingIcon icon={Percent} className="bottom-1/2 left-12 animate-pulse" size="md" />
                    <FloatingIcon icon={Hash} className="bottom-1/2 right-12 animate-pulse" size="md" />

                    {/* Funnel Chart */}
                    <div className="w-full max-w-sm">
                      <FunnelChart data={funnelData} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="neumorphic-card p-4 relative">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-bold" style={{ color: funnelData.find(d => d.name === 'TOFU')?.color }}>TOFU</h5>
                      <span className="font-bold" style={{ color: funnelData.find(d => d.name === 'TOFU')?.color }}>{currentFunnelPlan.tofu}%</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-center">
                      <div><p className="opacity-70">ยอดรวม</p><p className="font-bold">{F.formatCurrency(calculated.tofuBudget)}</p></div>
                      <div><p className="opacity-70">ต่อบัญชี/เดือน</p><p className="font-bold">{F.formatCurrency(calculated.tofuBudgetPerAccountMonthly)}</p></div>
                      <div><p className="opacity-70">ต่อบัญชี/วัน</p><p className="font-bold">{F.formatCurrency(calculated.tofuBudgetPerAccountDaily)}</p></div>
                      <div><p className="opacity-70">จำนวนบัญชี</p><p className="font-bold">{F.formatInt(numAccounts)}</p></div>
                    </div>
                  </div>
                   <div className="neumorphic-card p-4 relative">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-bold" style={{ color: funnelData.find(d => d.name === 'MOFU')?.color }}>MOFU</h5>
                       <span className="font-bold" style={{ color: funnelData.find(d => d.name === 'MOFU')?.color }}>{currentFunnelPlan.mofu}%</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-center">
                      <div><p className="opacity-70">ยอดรวม</p><p className="font-bold">{F.formatCurrency(calculated.mofuBudget)}</p></div>
                      <div><p className="opacity-70">ต่อบัญชี/เดือน</p><p className="font-bold">{F.formatCurrency(calculated.mofuBudgetPerAccountMonthly)}</p></div>
                      <div><p className="opacity-70">ต่อบัญชี/วัน</p><p className="font-bold">{F.formatCurrency(calculated.mofuBudgetPerAccountDaily)}</p></div>
                      <div><p className="opacity-70">จำนวนบัญชี</p><p className="font-bold">{F.formatInt(numAccounts)}</p></div>
                    </div>
                  </div>
                   <div className="neumorphic-card p-4 relative">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-bold" style={{ color: funnelData.find(d => d.name === 'BOFU')?.color }}>BOFU</h5>
                       <span className="font-bold" style={{ color: funnelData.find(d => d.name === 'BOFU')?.color }}>{currentFunnelPlan.bofu}%</span>
                    </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-center">
                      <div><p className="opacity-70">ยอดรวม</p><p className="font-bold">{F.formatCurrency(calculated.bofuBudget)}</p></div>
                      <div><p className="opacity-70">ต่อบัญชี/เดือน</p><p className="font-bold">{F.formatCurrency(calculated.bofuBudgetPerAccountMonthly)}</p></div>
                      <div><p className="opacity-70">ต่อบัญชี/วัน</p><p className="font-bold">{F.formatCurrency(calculated.bofuBudgetPerAccountDaily)}</p></div>
                      <div><p className="opacity-70">จำนวนบัญชี</p><p className="font-bold">{F.formatInt(numAccounts)}</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 text-white">Funnel Structure</h3>
              <div className="neumorphic-card p-2 md:p-6 space-y-4 overflow-x-auto">
                 <FunnelStructure data={summaryFunnelData} />
              </div>
            </div>

          </TabsContent>
          <TabsContent value="funnel">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h5 className="font-bold mb-3" style={{ color: funnelData.find(d => d.name === 'TOFU')?.color }}>TOFU (Top of Funnel)</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                    {funnelObjectives.tofu.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold mb-3" style={{ color: funnelData.find(d => d.name === 'MOFU')?.color }}>MOFU (Middle of Funnel)</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                    {funnelObjectives.mofu.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold mb-3" style={{ color: funnelData.find(d => d.name === 'BOFU')?.color }}>BOFU (Bottom of Funnel)</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                    {funnelObjectives.bofu.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="automation">
            <div className="my-8">
              <h2 className="text-2xl font-bold text-center text-white mb-4">ตัวอย่างหน้าจอ Revealbot</h2>
              <RevealBotMockup />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="md:col-span-1">
                        <Label htmlFor="metricsPlan-automation" className="block text-sm mb-2 font-medium opacity-80">แผน Metrics</Label>
                        <Select value={inputs.metricsPlan} onValueChange={(val) => handleInputChange('metricsPlan', val)}>
                            <SelectTrigger id="metricsPlan-automation" className="neumorphic-select"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                {Object.entries(metricsPlans).map(([key, {name}]) => <SelectItem key={key} value={key}>{name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-1">
                        <Label htmlFor="automation-tool" className="block text-sm mb-2 font-medium opacity-80">เครื่องมืออัตโนมัติ</Label>
                        <Select value={inputs.automationTool} onValueChange={(val) => handleInputChange('automationTool', val)}>
                            <SelectTrigger id="automation-tool" className="neumorphic-select w-full"><SelectValue/></SelectTrigger>
                            <SelectContent>
                            {Object.entries(automationToolsConfig).map(([key, {name}]) => <SelectItem key={key} value={key}>{name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                <div className="flex justify-end items-center mb-6">
                  <Button onClick={addRule} className="neon-button"><Plus className="w-4 h-4"/> เพิ่ม Rule ใหม่</Button>
                </div>
                <div className="space-y-4">
                  {automationRules.map(rule => {
                    const toolConfig = automationToolsConfig[inputs.automationTool];
                    const actionConfig = toolConfig.actions.find(a => a.value === rule.action);
                    const ToolIcon = iconMap[toolConfig.icon] || Bot;

                    return (
                      <div key={rule.id} className="neumorphic-card p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <Input value={rule.name} onChange={(e) => updateRule(rule.id, 'name', e.target.value)} className="neumorphic-input flex-grow" placeholder="ชื่อกฎ (เช่น 'ปิด Ad Set ขาดทุน')"/>
                            <Button variant="ghost" size="icon" onClick={() => deleteRule(rule.id)}><X className="w-4 h-4 text-red-400"/></Button>
                        </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <ToolIcon className="w-5 h-5 text-primary"/>
                            <Select value={rule.level} onValueChange={(v) => updateRule(rule.id, 'level', v)}><SelectTrigger className="neumorphic-select w-32 !text-white"/><SelectContent>{toolConfig.levels.map(o => <SelectItem key={o.value} value={o.value}>{o.text}</SelectItem>)}</SelectContent></Select>
                            <span className="font-bold text-primary">IF</span>
                            <Select value={rule.metric} onValueChange={(v) => updateRule(rule.id, 'metric', v)}><SelectTrigger className="neumorphic-select w-40 !text-white"/><SelectContent>{toolConfig.metrics.map(o => <SelectItem key={o.value} value={o.value}>{o.text}</SelectItem>)}</SelectContent></Select>
                            <Select value={rule.operator} onValueChange={(v) => updateRule(rule.id, 'operator', v)}><SelectTrigger className="neumorphic-select w-40 !text-white"/><SelectContent>{toolConfig.operators.map(o => <SelectItem key={o.value} value={o.value}>{o.text}</SelectItem>)}</SelectContent></Select>
                            <Input value={rule.value} onChange={(e) => updateRule(rule.id, 'value', e.target.value)} className="neumorphic-input w-24" placeholder="Value"/>
                            <span className="font-bold text-accent">THEN</span>
                            <Select value={rule.action} onValueChange={(v) => updateRule(rule.id, 'action', v)}><SelectTrigger className="neumorphic-select w-48 !text-white"/><SelectContent>{toolConfig.actions.map(o => <SelectItem key={o.value} value={o.value}>{o.text}</SelectItem>)}</SelectContent></Select>
                            {actionConfig?.needsValue && (
                              <Input value={rule.actionValue} onChange={(e) => updateRule(rule.id, 'actionValue', e.target.value)} className="neumorphic-input w-24" placeholder="Action Value"/>
                            )}
                            <Select value={rule.timeframe} onValueChange={(v) => updateRule(rule.id, 'timeframe', v)}><SelectTrigger className="neumorphic-select w-40 !text-white"/><SelectContent>{toolConfig.timeframes.map(o => <SelectItem key={o.value} value={o.value}>{o.text}</SelectItem>)}</SelectContent></Select>
                          </div>
                      </div>
                    )
                  })}
                </div>
                 <Card className="neumorphic-card mt-6">
                    <CardHeader>
                        <CardTitle>สรุปกฎทั้งหมด</CardTitle>
                        <CardDescription>นี่คือรายการกฎทั้งหมดที่คุณได้สร้างไว้</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {automationRules.length > 0 ? (
                            <ol className="list-decimal list-inside space-y-2 text-sm">
                            {automationRules.map((rule, index) => {
                                const toolConfig = automationToolsConfig[inputs.automationTool];
                                const levelText = toolConfig.levels.find(l => l.value === rule.level)?.text;
                                const metricText = toolConfig.metrics.find(m => m.value === rule.metric)?.text;
                                const operatorText = toolConfig.operators.find(o => o.value === rule.operator)?.text;
                                const actionText = toolConfig.actions.find(a => a.value === rule.action)?.text;
                                const timeText = toolConfig.timeframes.find(t => t.value === rule.timeframe)?.text;
                                return (
                                    <li key={rule.id} className="text-white">
                                        <b>{rule.name ? `${rule.name}: ` : ''}</b>
                                        ที่ระดับ {levelText}, ถ้า {metricText} {operatorText} {rule.value} 
                                        ภายใน {timeText}, 
                                        ให้ {actionText} {rule.actionValue && `${rule.actionValue}%`}
                                    </li>
                                );
                            })}
                            </ol>
                        ) : (
                            <p className="text-muted-foreground text-center">ยังไม่มีการสร้าง Rule</p>
                        )}
                    </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:mt-0">
                  <Card className="neumorphic-card h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-primary"/>กฎรูปแบบการชี้วัดด้วย ROAS</CardTitle>
                        <CardDescription>แนวทางการตั้งกฎอัตโนมัติพื้นฐานสำหรับ Revealbot</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {[
                        "ปิด ที่เวลา ...",
                        "เปิด ที่เวลา ...",
                        "ปิด เมื่อ ไม่มีทัก ไม่มีซื้อ",
                        "ปิด เมื่อ มีทัก ไม่มีซื้อ",
                        "ปิด เมื่อ มีซื้อ Roas < xxx",
                        "เปิด คืนชีพ เมื่อ Roas > xxx",
                        "Daily Scale เมื่อ Roas > xxx",
                        "หยุด Scale เมื่อ Roas < xxx และ ใช้เงินไปแล้ว > xxx // รักษากำไร",
                        "Reset งบ xxx ที่เวลา ...",
                      ].map((rule, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                          <span className="font-bold text-primary">{index + 1}.</span>
                          <p>{rule}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="neumorphic-card h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-primary"/>กฎรูปแบบการชี้วัดด้วยต้นทุนซื้อ</CardTitle>
                        <CardDescription>แนวทางการตั้งกฎอัตโนมัติพื้นฐานสำหรับ Revealbot</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      {[
                          "ปิด ที่เวลา ...",
                          "เปิด ที่เวลา ...",
                          "ปิด เมื่อ ไม่มีทัก ไม่มีซื้อ",
                          "ปิด เมื่อ มีทัก ไม่มีซื้อ",
                          "ปิด เมื่อ มีซื้อ และ ต้นทุนซื้อ > xxx",
                          "เปิด คืนชีพ เมื่อ ต้นทุนซื้อ < xxx",
                          "Daily Scale เมื่อ มีซื้อ และ ต้นทุนซื้อ < xxx",
                          "หยุด Scale เมื่อ ต้นทุนซื้อ > xxx และ ใช้เงินไปแล้ว > xxx // รักษากำไร",
                          "Reset งบ xxx ที่เวลา ...",
                      ].map((rule, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                          <span className="font-bold text-primary">{index + 1}.</span>
                          <p>{rule}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
              </div>
            </div>
          </TabsContent>
           <TabsContent value="workflow">
             <div className="neumorphic-card mt-6 p-6">
                  <h3 className="text-xl font-bold mb-4 gradient-text">n8n Workflow Generator</h3>
                  <p className="text-sm opacity-80 mb-6">สร้าง Workflow JSON สำหรับ n8n โดยอัตโนมัติตามกฎที่คุณสร้างไว้</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Input id="n8nWorkflowName" placeholder="ชื่อ Workflow (เช่น 'Profit Pilot Automation')" className="neumorphic-input" />
                    <Input id="n8nPrimaryGoal" placeholder="เป้าหมายหลัก (เช่น 'Scale Revenue & Optimize CPA')" className="neumorphic-input" />
                  </div>
                  
                  <Button onClick={handleGenerateN8nWorkflow} className="neon-button w-full" disabled={n8nWorkflow.loading || automationRules.length === 0}>
                    {n8nWorkflow.loading ? "กำลังสร้าง..." : (automationRules.length === 0 ? "โปรดสร้าง Rule ก่อน" : "สร้าง n8n Workflow JSON")}
                  </Button>

                  {n8nWorkflow.loading && <Progress value={50} className="w-full mt-4" />}
                  
                  {n8nWorkflow.json && (
                    <div className="mt-6 relative">
                      <h4 className="font-bold mb-2">Generated Workflow JSON</h4>
                       <div className="p-4 bg-background rounded-lg max-h-96 overflow-auto relative">
                        <Button size="sm" onClick={() => {
                            navigator.clipboard.writeText(n8nWorkflow.json);
                            toast({ title: "Copied!", description: "คัดลอก Workflow JSON แล้ว" });
                        }} className="absolute top-2 right-2 z-10 neon-button secondary"><ClipboardCopy className="w-4 h-4"/>คัดลอก</Button>
                        <pre className="text-xs whitespace-pre-wrap">{n8nWorkflow.json}</pre>
                      </div>
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
                    <p className="text-xs opacity-60">{new Date(item.id).toLocaleString()}</p>
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
                <div><p className="font-bold">{item.name}</p><p className="text-xs opacity-60">{new Date(item.id).toLocaleString()}</p></div>
                <div className="flex gap-2"><Button onClick={() => loadHistory(item.id)}>Load</Button><Button variant="destructive" onClick={() => deleteHistoryItem(item.id)}><Trash2 className="w-4 h-4"/></Button></div>
              </div>
            )) : <p className="text-center opacity-60">ยังไม่มีประวัติการวางแผน</p>}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
