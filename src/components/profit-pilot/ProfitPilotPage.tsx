
"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Bot, CalendarCheck, FileSliders, Filter, GanttChartSquare, History, Plus, RotateCcw, Save, Search, Settings, Trash2, X, Target, Heart, ThumbsUp, Hash, DollarSign, Megaphone, BarChart, Percent, Tv, LineChart, Users, BrainCircuit, Info, Scaling, Briefcase, FileText, Zap, ClipboardCopy, Facebook, Wand, CheckIcon, ChevronDown, Play, Pause, ArrowUpRight, ArrowUp, Square, MousePointerClick, LayoutDashboard, AlertTriangle, Music, ShoppingBag, Globe, Plug, Send, AlertCircle, CheckCircle2, Download, Gauge, TrendingDown, TrendingUp, Home, PencilLine } from 'lucide-react';
import { generateUiTitles } from './actions';
import { Progress } from '../ui/progress';
import AutomationRuleBuilder from './RevealbotRuleBuilder';
import ProFunnel from './ProFunnel';
import { format, isThisYear, isToday, isThisMonth, parseISO } from 'date-fns';


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
  includePackaging: true,
  includeShipping: true,
  includePaymentFee: true,
  includeKolFee: false,
  includeCodFee: false,
  codFeePercent: '',
  includeExtraHandling: false,
  extraHandlingCost: '',
  includeReturnRate: false,
  returnRatePercent: '',
  expectedConversionRate: '2.5',
  includeLtv: false,
  ltvPerCustomer: '',
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
  automationTool: 'revealbot',
  budgetingStrategy: 'cbo'
};

const iconMap = {
  Facebook,
  Bot,
  Wand,
};

type AdEntry = {
  id: number;
  platform: string;
  campaignName: string;
  date: string;
  spend: number;
  revenue: number;
  conversions: number;
  source: 'manual' | 'sync';
};

type OrderEntry = {
  id: number;
  platform: string;
  orderId: string;
  date: string;
  amount: number;
  cost: number;
  items: number;
  source: 'manual' | 'sync';
};

type AtRiskCampaign = AdEntry & { profit: number };

type WebAdPlan = {
  dailyBudget: string;
  expectedCpc: string;
  expectedConversionRate: string;
  averageOrderValue: string;
  productCost: string;
  landingPage: string;
};

type WebAdProjection = {
  clicks: number;
  orders: number;
  revenue: number;
  goodsCost: number;
  profit: number;
  roas: number;
  margin: number;
  breakEvenOrders: number;
  breakEvenRoas: number;
  breakEvenCpa: number;
  maxCpc: number;
  thirtyDayRevenue: number;
  thirtyDayProfit: number;
  warningLevel: 'loss' | 'watch' | 'healthy';
};

type ProductPreset = {
  id: string;
  name: string;
  createdAt: string;
  data: Record<string, unknown>;
};

type StopRuleConfig = {
  consecutiveDays: number;
  lossThreshold: number;
  testBudgetMultiple: number;
  roasBuffer: number;
};

type DailyAdPerformance = {
  date: string;
  spend: number;
  revenue: number;
  roas: number;
};

type CampaignComparison = {
  campaignName: string;
  platform: string;
  spend: number;
  revenue: number;
  profit: number;
  roas: number;
  conversions: number;
};

type AdLaunchFormState = {
  campaignName: string;
  objective: string;
  optimizationEvent: string;
  creativeAngle: string;
  totalDailyBudget: string;
  startDate: string;
  endDate: string;
  landingUrl: string;
  audienceNotes: string;
  creativeMessage: string;
  creativeHook: string;
  trackingPixels: string;
  launchNotes: string;
};

const adPlatformOptions = [
  { value: 'facebook_ads', label: 'Facebook Ads' },
  { value: 'tiktok_ads', label: 'TikTok Ads' },
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'lazada_ads', label: 'Lazada Sponsored Ads' },
  { value: 'custom', label: 'Custom / Other' },
];

const orderPlatformOptions = [
  { value: 'facebook_shop', label: 'Facebook Shop' },
  { value: 'tiktok_shop', label: 'TikTok Shop' },
  { value: 'lazada_shop', label: 'Lazada Shop' },
  { value: 'shopee', label: 'Shopee' },
  { value: 'own_website', label: 'Own Website' },
];

type PlatformIntegrationStatus = 'connected' | 'disconnected' | 'error';

type PlatformIntegrationState = {
  endpoint: string;
  accountId: string;
  accessToken: string;
  pixelId: string;
  autoSync: boolean;
  status: PlatformIntegrationStatus;
  lastSyncedAt: string | null;
  notes: string;
};

type LaunchPayloadItem = {
  platform: string;
  platformName: string;
  endpoint: string;
  readyToSend: boolean;
  accountId: string;
  dailyBudget: number;
  objective: string;
  optimizationEvent: string;
  startDate: string;
  endDate: string | null;
  landingUrl: string;
  creative: {
    primaryText: string;
    hook: string;
  };
  audience: string;
  trackingPixel: string;
  autoSync: boolean;
  notes: string;
};

type MultiChannelPlatform = {
  key: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  defaultEndpoint: string;
  recommendedSplit: number;
  defaultNotes: string;
};

type QuickNavConfig = {
  key: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: { tone: 'ready' | 'warning' | 'info'; label: string };
};

const multiChannelPlatforms: MultiChannelPlatform[] = [
  {
    key: 'facebook_ads',
    name: 'Facebook Ads',
    description: 'ยิงแคมเปญไปยัง Facebook & Instagram ผ่าน Meta Ads Manager',
    icon: Facebook,
    accent: 'text-[#1877F2]',
    defaultEndpoint: '/api/integrations/facebook/ads',
    recommendedSplit: 0.4,
    defaultNotes: 'ต้องมี Access Token และ Ad Account ID (รูปแบบ act_XXXXXXXXX)',
  },
  {
    key: 'tiktok_ads',
    name: 'TikTok Ads',
    description: 'ยิงวิดีโอสั้นดึงลูกค้าใหม่ พร้อม Tracking ผ่าน Pixel',
    icon: Music,
    accent: 'text-[#010101]',
    defaultEndpoint: '/api/integrations/tiktok/ads',
    recommendedSplit: 0.3,
    defaultNotes: 'ใช้ TikTok Business Center พร้อม Advertising ID',
  },
  {
    key: 'google_ads',
    name: 'Google Ads',
    description: 'ส่งแคมเปญไปยัง Search/Performance Max เพื่อเร่งคนที่กำลังหาเรา',
    icon: Globe,
    accent: 'text-[#4285F4]',
    defaultEndpoint: '/api/integrations/google/ads',
    recommendedSplit: 0.2,
    defaultNotes: 'ต้องการ Google Ads Customer ID และ Refresh Token',
  },
  {
    key: 'lazada_ads',
    name: 'Lazada Sponsored Ads',
    description: 'กระตุ้นการมองเห็นสินค้าบนหน้าร้าน Lazada ของเรา',
    icon: ShoppingBag,
    accent: 'text-[#E1251B]',
    defaultEndpoint: '/api/integrations/lazada/ads',
    recommendedSplit: 0.1,
    defaultNotes: 'เตรียม Seller Center API Key และ Sponsored Solutions Token',
  },
];

const adObjectives = [
  { value: 'sales', label: 'ยอดขาย (Sales)' },
  { value: 'leads', label: 'เก็บลูกค้าเป้าหมาย (Leads)' },
  { value: 'traffic', label: 'พาคนเข้าเว็บ (Traffic)' },
  { value: 'awareness', label: 'เพิ่มการรับรู้ (Awareness)' },
];

const optimizationEvents = [
  { value: 'purchase', label: 'Purchase / Complete Payment' },
  { value: 'add_to_cart', label: 'Add to Cart' },
  { value: 'lead', label: 'Submit Lead Form' },
  { value: 'view_content', label: 'View Content' },
];

const creativeAngles = [
  { value: 'value', label: 'Value Offer / ส่วนลด' },
  { value: 'urgency', label: 'เร่งตัดสินใจ / ด่วน' },
  { value: 'social', label: 'รีวิว / Social Proof' },
  { value: 'education', label: 'ให้ความรู้ / How-to' },
];

const defaultTotalDailyBudget = 3500;

const defaultSelectedPlatforms = multiChannelPlatforms
  .slice(0, 3)
  .map(platform => platform.key);

const computeBudgetSplit = (platformKeys: string[], totalBudget: number) => {
  const sanitizedBudget = Number.isFinite(totalBudget) ? Math.max(totalBudget, 0) : 0;
  const split: Record<string, string> = {};

  multiChannelPlatforms.forEach(platform => {
    split[platform.key] = '0.00';
  });

  const activePlatforms = multiChannelPlatforms.filter(platform => platformKeys.includes(platform.key));

  if (!activePlatforms.length || sanitizedBudget <= 0) {
    return split;
  }

  const totalWeight = activePlatforms.reduce((sum, platform) => sum + (platform.recommendedSplit || 1), 0);
  let allocated = 0;

  activePlatforms.forEach((platform, index) => {
    const weight = platform.recommendedSplit || 1;
    const rawAmount = (sanitizedBudget * weight) / totalWeight;
    const preciseAmount = index === activePlatforms.length - 1
      ? sanitizedBudget - allocated
      : Math.round(rawAmount * 100) / 100;

    split[platform.key] = preciseAmount.toFixed(2);
    allocated += preciseAmount;
  });

  return split;
};

const defaultPlatformBudgets = computeBudgetSplit(defaultSelectedPlatforms, defaultTotalDailyBudget);

const integrationStatusLabels: Record<PlatformIntegrationStatus, string> = {
  connected: 'เชื่อมต่อแล้ว',
  disconnected: 'ยังไม่เชื่อม',
  error: 'ข้อมูลไม่ครบ',
};

const integrationStatusVariants: Record<PlatformIntegrationStatus, 'default' | 'outline' | 'destructive'> = {
  connected: 'default',
  disconnected: 'outline',
  error: 'destructive',
};

export function ProfitPilotPage() {
  const [isClient, setIsClient] = useState(false);
  const [inputs, setInputs] = useState(initialInputs);
  const [calculated, setCalculated] = useState({
    grossProfitUnit: 0,
    breakevenRoas: 0,
    breakevenCpa: 0,
    breakevenAdCostPercent: 0,
    maxCpc: 0,
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
    ltvContribution: 0,
    returnImpact: 0,
    expectedConversionRate: 0,
    monthlyProfitProjection: 0,
    monthlyRevenueProjection: 0,
    expectedReturnRate: 0,
    codFeePercent: 0,
    extraHandlingCost: 0,
  });
  const [automationRules, setAutomationRules] = useState([]);
  const [uiTitles, setUiTitles] = useState({ productInfoTitle: 'ข้อมูลสินค้า', costCalculationTitle: 'คำนวณต้นทุน', goalsAndResultsTitle: 'เป้าหมายและผลลัพธ์', advancedPlanningTitle: 'Advanced Planning' });
  const [activeTab, setActiveTab] = useState('home');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [renameHistoryState, setRenameHistoryState] = useState<{ isOpen: boolean; id: number | null; name: string }>({
    isOpen: false,
    id: null,
    name: '',
  });
  const [history, setHistory] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: () => {} });
  const [n8nWorkflow, setN8nWorkflow] = useState({ json: null, loading: false });
  const [n8nWorkflowName, setN8nWorkflowName] = useState('Profit Pilot Workflow');
  const [n8nPrimaryGoal, setN8nPrimaryGoal] = useState('Scale Revenue & Optimize CPA');
  const [theme, setTheme] = useState('dark');
  const [funnelStageFilter, setFunnelStageFilter] = useState('all');
  const [aiAdvice, setAiAdvice] = useState({ recommendations: '', insights: '', loading: false });
  const [adEntries, setAdEntries] = useState<AdEntry[]>([]);
  const [orderEntries, setOrderEntries] = useState<OrderEntry[]>([]);
  const [adForm, setAdForm] = useState(() => ({
    platform: adPlatformOptions[0].value,
    campaignName: '',
    spend: '',
    revenue: '',
    conversions: '',
    date: new Date().toISOString().slice(0, 10),
  }));
  const [orderForm, setOrderForm] = useState(() => ({
    platform: orderPlatformOptions[0].value,
    orderId: '',
    amount: '',
    cost: '',
    items: '',
    date: new Date().toISOString().slice(0, 10),
  }));
  const [webAdPlan, setWebAdPlan] = useState<WebAdPlan>({
    dailyBudget: '1500',
    expectedCpc: '12',
    expectedConversionRate: '2.5',
    averageOrderValue: '690',
    productCost: '320',
    landingPage: 'https://yourstore.co/launch',
  });
  const [adLaunchForm, setAdLaunchForm] = useState<AdLaunchFormState>({
    campaignName: 'เปิดตัวสินค้าใหม่ Q4',
    objective: adObjectives[0].value,
    optimizationEvent: optimizationEvents[0].value,
    creativeAngle: creativeAngles[0].value,
    totalDailyBudget: String(defaultTotalDailyBudget),
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    landingUrl: 'https://yourstore.co/promotion',
    audienceNotes: 'กลุ่มลูกค้าที่เคยดูสินค้า + Lookalike 3%',
    creativeMessage: 'พร้อมส่งทันที ลดพิเศษเฉพาะสัปดาห์นี้!',
    creativeHook: 'ตอกย้ำว่ามีของพร้อมส่งและรีวิว 5 ดาวจากลูกค้าจริง',
    trackingPixels: '',
    launchNotes: 'ยืนยันงบรวมตามแผนหลักก่อนยิงจริง',
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(defaultSelectedPlatforms);
  const [platformBudgets, setPlatformBudgets] = useState<Record<string, string>>(() => ({
    ...defaultPlatformBudgets,
  }));
  const [autoSplitBudget, setAutoSplitBudget] = useState(true);
  const [platformIntegrations, setPlatformIntegrations] = useState<Record<string, PlatformIntegrationState>>(() =>
    multiChannelPlatforms.reduce((acc, platform) => {
      acc[platform.key] = {
        endpoint: platform.defaultEndpoint,
        accountId: '',
        accessToken: '',
        pixelId: '',
        autoSync: true,
        status: 'disconnected',
        lastSyncedAt: null,
        notes: platform.defaultNotes,
      };
      return acc;
    }, {} as Record<string, PlatformIntegrationState>)
  );
  const [lastLaunchSummary, setLastLaunchSummary] = useState<{ timestamp: string; payload: LaunchPayloadItem[] } | null>(null);
  const [detectionState, setDetectionState] = useState({ nsn: true, nn: false });
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const [summarySection, setSummarySection] = useState('overview');
  const [productPresets, setProductPresets] = useState<ProductPreset[]>([]);
  const [presetDialogOpen, setPresetDialogOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [whatIfState, setWhatIfState] = useState(() => ({
    cpc: F.num(webAdPlan.expectedCpc),
    conversionRate: F.num(webAdPlan.expectedConversionRate),
    orderValue: F.num(webAdPlan.averageOrderValue),
  }));
  const [stopRules, setStopRules] = useState<StopRuleConfig>({
    consecutiveDays: 3,
    lossThreshold: 3000,
    testBudgetMultiple: 3,
    roasBuffer: 0.1,
  });

  const { toast } = useToast();

  const getAdPlatformLabel = useCallback(
    (value: string) => adPlatformOptions.find(option => option.value === value)?.label || value,
    []
  );

  const getOrderPlatformLabel = useCallback(
    (value: string) => orderPlatformOptions.find(option => option.value === value)?.label || value,
    []
  );

  const parseEntryDate = useCallback((value: string) => {
    if (!value) {
      return null;
    }
    try {
      const parsed = parseISO(value);
      if (Number.isNaN(parsed.getTime())) {
        return null;
      }
      return parsed;
    } catch (error) {
      return null;
    }
  }, []);

  const formatPlatformName = useCallback(
    (platformKey: string) => multiChannelPlatforms.find(platform => platform.key === platformKey)?.name || platformKey,
    []
  );

  const formatSyncTimestamp = useCallback((value: string | null) => {
    if (!value) {
      return 'ยังไม่เคยทดสอบ';
    }

    try {
      return format(parseISO(value), 'dd/MM HH:mm');
    } catch (error) {
      return 'ยังไม่เคยทดสอบ';
    }
  }, []);

  const handleAdLaunchFormChange = useCallback(
    (field: keyof AdLaunchFormState, value: string) => {
      setAdLaunchForm(prev => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handlePlatformSelection = useCallback(
    (platformKey: string, checked: boolean) => {
      setSelectedPlatforms(prev => {
        const nextSelection = checked
          ? Array.from(new Set([...prev, platformKey]))
          : prev.filter(key => key !== platformKey);

        if (autoSplitBudget) {
          setPlatformBudgets(computeBudgetSplit(nextSelection, F.num(adLaunchForm.totalDailyBudget)));
        }

        return nextSelection;
      });
    },
    [autoSplitBudget, adLaunchForm.totalDailyBudget]
  );

  const handlePlatformBudgetChange = useCallback(
    (platformKey: string, value: string) => {
      setPlatformBudgets(prev => ({
        ...prev,
        [platformKey]: value,
      }));

      if (autoSplitBudget) {
        setAutoSplitBudget(false);
      }
    },
    [autoSplitBudget]
  );

  const updatePlatformIntegration = useCallback(
    (platformKey: string, updater: (current: PlatformIntegrationState) => PlatformIntegrationState) => {
      setPlatformIntegrations(prev => {
        const current = prev[platformKey];
        if (current) {
          return {
            ...prev,
            [platformKey]: updater(current),
          };
        }

        const platform = multiChannelPlatforms.find(item => item.key === platformKey);
        const fallback: PlatformIntegrationState = {
          endpoint: platform?.defaultEndpoint || '',
          accountId: '',
          accessToken: '',
          pixelId: '',
          autoSync: true,
          status: 'disconnected',
          lastSyncedAt: null,
          notes: platform?.defaultNotes || '',
        };

        return {
          ...prev,
          [platformKey]: updater(fallback),
        };
      });
    },
    []
  );

  const toggleAutoSplit = useCallback(
    (checked: boolean) => {
      setAutoSplitBudget(checked);
      if (checked) {
        setPlatformBudgets(computeBudgetSplit(selectedPlatforms, F.num(adLaunchForm.totalDailyBudget)));
      }
    },
    [selectedPlatforms, adLaunchForm.totalDailyBudget]
  );

  const selectedPlatformDetails = useMemo(
    () => multiChannelPlatforms.filter(platform => selectedPlatforms.includes(platform.key)),
    [selectedPlatforms]
  );

  const platformBudgetTotal = useMemo(
    () =>
      selectedPlatforms.reduce(
        (sum, platformKey) => sum + F.num(platformBudgets[platformKey] ?? '0'),
        0
      ),
    [platformBudgets, selectedPlatforms]
  );

  const totalBudgetDiff = useMemo(
    () => F.num(adLaunchForm.totalDailyBudget) - platformBudgetTotal,
    [adLaunchForm.totalDailyBudget, platformBudgetTotal]
  );

  const budgetDiffAlert = Math.abs(totalBudgetDiff) > 1;

  const missingCredentials = useMemo(
    () =>
      selectedPlatforms.filter(platformKey => {
        const integration = platformIntegrations[platformKey];
        return !(integration && integration.accountId && integration.accessToken);
      }),
    [platformIntegrations, selectedPlatforms]
  );

  const zeroBudgetPlatforms = useMemo(
    () => selectedPlatforms.filter(platformKey => F.num(platformBudgets[platformKey]) <= 0),
    [platformBudgets, selectedPlatforms]
  );

  const launchPayloadPreview = useMemo<LaunchPayloadItem[]>(() =>
    selectedPlatforms.map(platformKey => {
      const integration = platformIntegrations[platformKey];
      const platform = multiChannelPlatforms.find(item => item.key === platformKey);
      const dailyBudget = F.num(platformBudgets[platformKey]);

      return {
        platform: platformKey,
        platformName: platform?.name || platformKey,
        endpoint: integration?.endpoint || '',
        readyToSend: Boolean(integration?.accountId && integration?.accessToken && dailyBudget > 0),
        accountId: integration?.accountId || '',
        dailyBudget,
        objective: adLaunchForm.objective,
        optimizationEvent: adLaunchForm.optimizationEvent,
        startDate: adLaunchForm.startDate,
        endDate: adLaunchForm.endDate || null,
        landingUrl: adLaunchForm.landingUrl,
        creative: {
          primaryText: adLaunchForm.creativeMessage,
          hook: adLaunchForm.creativeHook,
        },
        audience: adLaunchForm.audienceNotes,
        trackingPixel: (integration?.pixelId || adLaunchForm.trackingPixels || '').trim(),
        autoSync: Boolean(integration?.autoSync),
        notes: adLaunchForm.launchNotes,
      };
    }),
    [adLaunchForm, platformBudgets, platformIntegrations, selectedPlatforms]
  );

  const launchReady = useMemo(
    () =>
      launchPayloadPreview.length > 0 &&
      missingCredentials.length === 0 &&
      zeroBudgetPlatforms.length === 0 &&
      Boolean(adLaunchForm.campaignName && adLaunchForm.landingUrl),
    [adLaunchForm.campaignName, adLaunchForm.landingUrl, launchPayloadPreview, missingCredentials, zeroBudgetPlatforms]
  );

  const prettyLaunchPreview = useMemo(() => JSON.stringify(launchPayloadPreview, null, 2), [launchPayloadPreview]);

  const missingCredentialNames = useMemo(
    () => missingCredentials.map(formatPlatformName).join(', '),
    [formatPlatformName, missingCredentials]
  );

  const zeroBudgetNames = useMemo(
    () => zeroBudgetPlatforms.map(formatPlatformName).join(', '),
    [formatPlatformName, zeroBudgetPlatforms]
  );

  const autoSyncEnabledCount = useMemo(
    () => selectedPlatforms.filter(platformKey => platformIntegrations[platformKey]?.autoSync).length,
    [platformIntegrations, selectedPlatforms]
  );

  const connectedPlatformCount = useMemo(
    () => selectedPlatforms.filter(platformKey => platformIntegrations[platformKey]?.status === 'connected').length,
    [platformIntegrations, selectedPlatforms]
  );

  const lastLaunchTimeFormatted = useMemo(
    () => (lastLaunchSummary ? format(parseISO(lastLaunchSummary.timestamp), 'dd MMM yyyy HH:mm') : ''),
    [lastLaunchSummary]
  );

  const lastLaunchPayload = useMemo(
    () => (lastLaunchSummary ? JSON.stringify(lastLaunchSummary.payload, null, 2) : ''),
    [lastLaunchSummary]
  );

  useEffect(() => {
    if (!autoSplitBudget) {
      return;
    }

    const nextBudgets = computeBudgetSplit(selectedPlatforms, F.num(adLaunchForm.totalDailyBudget));

    setPlatformBudgets(prev => {
      const hasChange = multiChannelPlatforms.some(platform => prev[platform.key] !== nextBudgets[platform.key]);
      return hasChange ? nextBudgets : prev;
    });
  }, [adLaunchForm.totalDailyBudget, autoSplitBudget, selectedPlatforms]);

  const handleTestConnection = useCallback(
    (platformKey: string) => {
      const current = platformIntegrations[platformKey];
      const hasCredentials = Boolean(current?.accountId?.trim() && current?.accessToken?.trim());

      setPlatformIntegrations(prev => {
        const integration = prev[platformKey];
        if (!integration) {
          return prev;
        }

        return {
          ...prev,
          [platformKey]: {
            ...integration,
            status: hasCredentials ? 'connected' : 'error',
            lastSyncedAt: hasCredentials ? new Date().toISOString() : integration.lastSyncedAt,
          },
        };
      });

      const platformName = formatPlatformName(platformKey);

      toast({
        title: hasCredentials ? 'พร้อมเชื่อมต่อ' : 'ข้อมูลยังไม่ครบ',
        description: hasCredentials
          ? `${platformName} พร้อมจำลองยิงแอดผ่าน API แล้ว (รอเชื่อมต่อจริงภายหลัง)`
          : `กรอก Access Token และ Account ID ของ ${platformName} ให้ครบก่อน`,
        variant: hasCredentials ? 'default' : 'destructive',
      });
    },
    [formatPlatformName, platformIntegrations, toast]
  );

  const handleResetIntegration = useCallback((platformKey: string) => {
    updatePlatformIntegration(platformKey, current => ({
      ...current,
      accountId: '',
      accessToken: '',
      pixelId: '',
      status: 'disconnected',
      lastSyncedAt: null,
    }));
  }, [updatePlatformIntegration]);

  const handleQueueLaunch = useCallback(() => {
    if (!selectedPlatforms.length) {
      toast({
        title: 'ยังไม่ได้เลือกแพลตฟอร์ม',
        description: 'เลือกอย่างน้อย 1 แพลตฟอร์มเพื่อจำลองยิงโฆษณา',
        variant: 'destructive',
      });
      return;
    }

    if (missingCredentials.length) {
      toast({
        title: 'ข้อมูล API ยังไม่ครบ',
        description: `กรุณากรอก ${missingCredentialNames} ให้พร้อมก่อน`,
        variant: 'destructive',
      });
      return;
    }

    if (zeroBudgetPlatforms.length) {
      toast({
        title: 'ตั้งงบแต่ละแพลตฟอร์มให้ครบ',
        description: `เพิ่มงบของ ${zeroBudgetNames} ให้มากกว่า 0 ก่อน`,
        variant: 'destructive',
      });
      return;
    }

    const payload = launchPayloadPreview;

    setLastLaunchSummary({
      timestamp: new Date().toISOString(),
      payload,
    });

    toast({
      title: 'จัดคิวส่งโฆษณา (จำลอง)',
      description: `เตรียมยิงไปยัง ${payload.length.toLocaleString('th-TH')} แพลตฟอร์มผ่าน API`,
    });
  }, [launchPayloadPreview, missingCredentialNames, missingCredentials, selectedPlatforms, toast, zeroBudgetNames, zeroBudgetPlatforms]);

  const handleCopyLaunchPayload = useCallback(async () => {
    if (!launchPayloadPreview.length) {
      toast({
        title: 'ยังไม่มีข้อมูลแคมเปญ',
        description: 'กรอกข้อมูลและเลือกแพลตฟอร์มก่อนคัดลอก payload',
        variant: 'destructive',
      });
      return;
    }

    const payloadText = JSON.stringify(launchPayloadPreview, null, 2);

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(payloadText);
        toast({
          title: 'คัดลอก Payload แล้ว',
          description: 'พร้อมส่งต่อให้ทีมเทคนิคหรือทดสอบผ่าน Postman',
        });
      } else {
        throw new Error('clipboard-unavailable');
      }
    } catch (error) {
      toast({
        title: 'คัดลอกไม่สำเร็จ',
        description: 'สามารถคัดลอกด้วยตนเองจากช่อง Preview ด้านล่าง',
        variant: 'destructive',
      });
    }
  }, [launchPayloadPreview, toast]);

  const aggregateAdMetrics = useCallback(
    (predicate: (date: Date) => boolean) =>
      adEntries.reduce(
        (acc, entry) => {
          const entryDate = parseEntryDate(entry.date);
          if (!entryDate || !predicate(entryDate)) {
            return acc;
          }
          const spend = F.num(entry.spend);
          const revenue = F.num(entry.revenue);
          const profit = revenue - spend;
          return {
            spend: acc.spend + spend,
            revenue: acc.revenue + revenue,
            profit: acc.profit + profit,
            conversions: acc.conversions + F.num(entry.conversions),
            count: acc.count + 1,
          };
        },
        { spend: 0, revenue: 0, profit: 0, conversions: 0, count: 0 }
      ),
    [adEntries, parseEntryDate]
  );

  const aggregateOrderMetrics = useCallback(
    (predicate: (date: Date) => boolean) =>
      orderEntries.reduce(
        (acc, entry) => {
          const entryDate = parseEntryDate(entry.date);
          if (!entryDate || !predicate(entryDate)) {
            return acc;
          }
          const amount = F.num(entry.amount);
          const cost = F.num(entry.cost);
          const profit = amount - cost;
          return {
            amount: acc.amount + amount,
            cost: acc.cost + cost,
            profit: acc.profit + profit,
            items: acc.items + F.num(entry.items),
            count: acc.count + 1,
          };
        },
        { amount: 0, cost: 0, profit: 0, items: 0, count: 0 }
      ),
    [orderEntries, parseEntryDate]
  );

  const adSummary = useMemo(() => {
    const today = aggregateAdMetrics(date => isToday(date));
    const year = aggregateAdMetrics(date => isThisYear(date));
    const total = aggregateAdMetrics(() => true);
    return { today, year, total };
  }, [aggregateAdMetrics]);

  const orderSummary = useMemo(() => {
    const today = aggregateOrderMetrics(date => isToday(date));
    const year = aggregateOrderMetrics(date => isThisYear(date));
    const total = aggregateOrderMetrics(() => true);
    return { today, year, total };
  }, [aggregateOrderMetrics]);

  const combinedYearProfit = useMemo(
    () => adSummary.year.profit + orderSummary.year.profit,
    [adSummary.year.profit, orderSummary.year.profit]
  );

  const webAdProjection = useMemo<WebAdProjection>(() => {
    const dailyBudget = Math.max(F.num(webAdPlan.dailyBudget), 0);
    const expectedCpc = Math.max(F.num(webAdPlan.expectedCpc), 1);
    const conversionRate = Math.max(F.num(webAdPlan.expectedConversionRate), 0) / 100;
    const averageOrderValue = Math.max(F.num(webAdPlan.averageOrderValue), 0);
    const productCost = Math.max(F.num(webAdPlan.productCost), 0);

    const clicks = expectedCpc > 0 ? dailyBudget / expectedCpc : 0;
    const orders = clicks * conversionRate;
    const revenue = orders * averageOrderValue;
    const goodsCost = orders * productCost;
    const profit = revenue - goodsCost - dailyBudget;
    const roas = dailyBudget > 0 ? revenue / dailyBudget : 0;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const contribution = averageOrderValue - productCost;
    const breakEvenOrders = contribution > 0 ? dailyBudget / contribution : 0;
    const breakEvenCpa = contribution;
    const breakEvenRoas = contribution > 0 ? averageOrderValue / contribution : 0;
    const maxCpc = conversionRate > 0 ? breakEvenCpa * conversionRate : 0;
    const thirtyDayRevenue = revenue * 30;
    const thirtyDayProfit = profit * 30;

    let warningLevel: WebAdProjection['warningLevel'] = 'healthy';
    if (profit < 0) {
      warningLevel = 'loss';
    } else if (margin < 15 || (breakEvenOrders > 0 && orders < breakEvenOrders * 1.1)) {
      warningLevel = 'watch';
    }

    return {
      clicks,
      orders,
      revenue,
      goodsCost,
      profit,
      roas,
      margin,
      breakEvenOrders,
      breakEvenRoas,
      breakEvenCpa,
      maxCpc,
      thirtyDayRevenue,
      thirtyDayProfit,
      warningLevel,
    };
  }, [webAdPlan]);

  const actualRoas = useMemo(
    () => (adSummary.total.spend > 0 ? adSummary.total.revenue / adSummary.total.spend : 0),
    [adSummary.total.revenue, adSummary.total.spend]
  );

  const evaluateRoasStatus = useCallback((actual: number, breakeven: number, buffer = 0.1) => {
    if (!Number.isFinite(actual) || breakeven <= 0) {
      return {
        tone: 'neutral',
        badge: 'outline' as const,
        label: 'รอข้อมูล',
        message: 'กรอกข้อมูลให้ครบเพื่อคำนวณจุดคุ้มทุน',
      };
    }

    if (actual >= breakeven * (1 + buffer)) {
      return {
        tone: 'good',
        badge: 'default' as const,
        label: 'กำไรดี',
        message: 'ROAS สูงกว่าจุดคุ้มทุน สบายใจยิงต่อได้',
      };
    }

    if (actual >= breakeven * (1 - buffer)) {
      return {
        tone: 'watch',
        badge: 'secondary' as const,
        label: 'ใกล้คุ้มทุน',
        message: 'คุมต้นทุนเพิ่มอีกเล็กน้อยเพื่อให้ปลอดภัย',
      };
    }

    return {
      tone: 'risk',
      badge: 'destructive' as const,
      label: 'ต่ำกว่าคุ้มทุน',
      message: 'พิจารณาหยุดหรือปรับแคมเปญก่อนขาดทุนหนัก',
    };
  }, []);

  const roasHealth = useMemo(
    () => evaluateRoasStatus(actualRoas, calculated.breakevenRoas, stopRules.roasBuffer),
    [actualRoas, calculated.breakevenRoas, stopRules.roasBuffer, evaluateRoasStatus]
  );

  const dailyAdPerformance = useMemo<DailyAdPerformance[]>(() => {
    const map = new Map<string, DailyAdPerformance>();

    adEntries.forEach(entry => {
      const date = entry.date || new Date().toISOString().slice(0, 10);
      const existing = map.get(date) || { date, spend: 0, revenue: 0, roas: 0 };
      existing.spend += F.num(entry.spend);
      existing.revenue += F.num(entry.revenue);
      existing.roas = existing.spend > 0 ? existing.revenue / existing.spend : 0;
      map.set(date, existing);
    });

    return Array.from(map.values()).sort((a, b) => (a.date > b.date ? -1 : 1));
  }, [adEntries]);

  const consecutiveBelowBreakeven = useMemo(() => {
    if (!dailyAdPerformance.length || calculated.breakevenRoas <= 0) {
      return 0;
    }

    const threshold = calculated.breakevenRoas * (1 - stopRules.roasBuffer);
    let count = 0;
    for (const day of dailyAdPerformance) {
      if (day.roas > 0 && day.roas < threshold) {
        count += 1;
      } else {
        break;
      }
    }
    return count;
  }, [dailyAdPerformance, calculated.breakevenRoas, stopRules.roasBuffer]);

  const stopAlert = useMemo(() => {
    const reasons: string[] = [];
    const lossExceeded = stopRules.lossThreshold > 0 && adSummary.total.profit < -Math.abs(stopRules.lossThreshold);
    const spendLimit = stopRules.testBudgetMultiple > 0 ? stopRules.testBudgetMultiple * F.num(inputs.sellingPrice) : 0;
    const spendExceeded = spendLimit > 0 && adSummary.total.spend >= spendLimit;

    if (stopRules.consecutiveDays > 0 && consecutiveBelowBreakeven >= stopRules.consecutiveDays) {
      reasons.push(`ROAS ต่ำกว่าจุดคุ้มทุน ${stopRules.consecutiveDays} วันติด`);
    }

    if (lossExceeded) {
      reasons.push(`ขาดทุนสะสมเกิน ${F.formatCurrency(stopRules.lossThreshold)}`);
    }

    if (spendExceeded) {
      reasons.push(`ใช้งบเทสเกิน ${stopRules.testBudgetMultiple.toLocaleString('th-TH')}x ของราคาสินค้า`);
    }

    const nearing =
      stopRules.consecutiveDays > 1 && consecutiveBelowBreakeven === stopRules.consecutiveDays - 1 && reasons.length === 0;

    const status = reasons.length > 0 ? 'stop' : nearing || lossExceeded || spendExceeded ? 'warning' : 'safe';

    return {
      status,
      reasons,
      spendLimit,
      message:
        status === 'stop'
          ? 'ตอนนี้เข้าเงื่อนไข ควรหยุดยิงชั่วคราว'
          : status === 'warning'
          ? 'เริ่มเข้าโซนเสี่ยง คุมต้นทุนเพิ่ม'
          : 'ตัวเลขยังปลอดภัย ยิงต่อได้',
    };
  }, [
    adSummary.total.profit,
    adSummary.total.spend,
    consecutiveBelowBreakeven,
    inputs.sellingPrice,
    stopRules.consecutiveDays,
    stopRules.lossThreshold,
    stopRules.testBudgetMultiple,
  ]);

  const campaignComparison = useMemo<CampaignComparison[]>(() => {
    const map = new Map<string, CampaignComparison>();

    adEntries.forEach(entry => {
      const campaignName = entry.campaignName || 'ไม่ระบุชื่อแคมเปญ';
      const key = `${entry.platform}::${campaignName}`;
      if (!map.has(key)) {
        map.set(key, {
          campaignName,
          platform: entry.platform,
          spend: 0,
          revenue: 0,
          profit: 0,
          roas: 0,
          conversions: 0,
        });
      }

      const current = map.get(key)!;
      current.spend += F.num(entry.spend);
      current.revenue += F.num(entry.revenue);
      current.profit += F.num(entry.revenue) - F.num(entry.spend);
      current.conversions += F.num(entry.conversions);
    });

    return Array.from(map.values()).map(item => ({
      ...item,
      roas: item.spend > 0 ? item.revenue / item.spend : 0,
    }));
  }, [adEntries]);

  const topRoasCampaigns = useMemo(
    () => [...campaignComparison].sort((a, b) => b.roas - a.roas).slice(0, 3),
    [campaignComparison]
  );

  const worstLossCampaigns = useMemo(
    () => [...campaignComparison].sort((a, b) => a.profit - b.profit).slice(0, 3),
    [campaignComparison]
  );

  const whatIfProjection = useMemo(() => {
    const budget = Math.max(F.num(webAdPlan.dailyBudget), 0);
    const cpc = Math.max(whatIfState.cpc, 0.1);
    const conversionRate = Math.max(whatIfState.conversionRate, 0) / 100;
    const orderValue = Math.max(whatIfState.orderValue, 0);
    const clicks = budget / cpc;
    const orders = clicks * conversionRate;
    const revenue = orders * orderValue;
    const goodsCost = orders * F.num(webAdPlan.productCost);
    const profit = revenue - goodsCost - budget;
    const roas = budget > 0 ? revenue / budget : 0;
    const status = evaluateRoasStatus(
      roas,
      webAdProjection.breakEvenRoas || calculated.breakevenRoas,
      stopRules.roasBuffer
    );

    return {
      clicks,
      orders,
      revenue,
      goodsCost,
      profit,
      roas,
      status,
    };
  }, [
    calculated.breakevenRoas,
    evaluateRoasStatus,
    stopRules.roasBuffer,
    webAdPlan.dailyBudget,
    webAdPlan.productCost,
    webAdProjection.breakEvenRoas,
    whatIfState.conversionRate,
    whatIfState.cpc,
    whatIfState.orderValue,
  ]);

  const handleExportReport = useCallback(() => {
    if (campaignComparison.length === 0) {
      toast({ title: 'ยังไม่มีข้อมูลแคมเปญ', description: 'เพิ่มข้อมูลการยิงแอดก่อนจึงจะส่งออกได้' });
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const header = 'Campaign,Platform,Spend,Revenue,Profit,ROAS,Conversions';
    const rows = campaignComparison
      .map(item => [
        `"${item.campaignName.replace(/"/g, '""')}"`,
        item.platform,
        item.spend.toFixed(2),
        item.revenue.toFixed(2),
        item.profit.toFixed(2),
        item.roas.toFixed(2),
        item.conversions.toFixed(0),
      ].join(','))
      .join('\n');

    const csv = `${header}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campaign-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: 'ส่งออกเรียบร้อย', description: 'ดาวน์โหลดไฟล์รายงานแล้ว' });
  }, [campaignComparison, toast]);

  const atRiskCampaigns = useMemo<AtRiskCampaign[]>(
    () =>
      adEntries
        .filter(entry => entry.revenue - entry.spend <= 0 || entry.conversions <= 1)
        .map(entry => ({ ...entry, profit: entry.revenue - entry.spend }))
        .sort((a, b) => a.profit - b.profit)
        .slice(0, 4),
    [adEntries]
  );

  const atRiskSpend = useMemo(
    () => atRiskCampaigns.reduce((acc, entry) => acc + entry.spend, 0),
    [atRiskCampaigns]
  );

  const websiteOrderSnapshot = useMemo(
    () =>
      orderEntries.reduce(
        (acc, entry) => {
          if (entry.platform !== 'own_website') {
            return acc;
          }

          const entryDate = parseEntryDate(entry.date);
          if (!entryDate) {
            return acc;
          }

          if (isToday(entryDate)) {
            acc.todayAmount += F.num(entry.amount);
            acc.todayCount += 1;
          }

          if (isThisMonth(entryDate)) {
            acc.monthAmount += F.num(entry.amount);
            acc.monthCount += 1;
          }

          return acc;
        },
        { todayAmount: 0, todayCount: 0, monthAmount: 0, monthCount: 0 }
      ),
    [orderEntries, parseEntryDate]
  );

  const webAdStatus = useMemo(
    () => {
      switch (webAdProjection.warningLevel) {
        case 'loss':
          return { label: 'ขาดทุน ต้องรีบแก้', variant: 'destructive' as const };
        case 'watch':
          return { label: 'จับตาดูยอดซื้อ', variant: 'secondary' as const };
        default:
          return { label: 'พร้อมทำกำไร', variant: 'default' as const };
      }
    },
    [webAdProjection.warningLevel]
  );

  const formatEntryDate = useCallback(
    (value: string) => {
      const parsed = parseEntryDate(value);
      if (!parsed) {
        return value || '-';
      }
      try {
        return format(parsed, 'dd MMM yyyy');
      } catch (error) {
        return value;
      }
    },
    [parseEntryDate]
  );

  const formatRoas = useCallback((revenue: number, spend: number) => {
    if (spend <= 0) {
      return '—';
    }
    return F.formatNumber(revenue / spend, 2);
  }, []);

  const handleAdFormChange = useCallback((field: string, value: string) => {
    setAdForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleOrderFormChange = useCallback((field: string, value: string) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleWebAdPlanChange = useCallback((field: keyof WebAdPlan, value: string) => {
    setWebAdPlan(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleLaunchWebsiteAd = useCallback(() => {
    toast({
      title: 'สั่งยิงแอดเว็บเรียบร้อย',
      description: `พาเข้าหน้า ${webAdPlan.landingPage} พร้อม ROAS เป้าหมาย ${webAdProjection.roas.toFixed(2)}x และกำไรคาดการณ์ ${F.formatCurrency(webAdProjection.profit)}`,
    });
  }, [toast, webAdPlan.landingPage, webAdProjection.profit, webAdProjection.roas]);

  const handleAddAdEntry = useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      const spend = F.num(adForm.spend);
      const revenue = F.num(adForm.revenue);
      const conversions = F.num(adForm.conversions);
      const campaignName = adForm.campaignName.trim() || 'ไม่ระบุชื่อแคมเปญ';
      const date = adForm.date || new Date().toISOString().slice(0, 10);

      const newEntry: AdEntry = {
        id: Date.now(),
        platform: adForm.platform,
        campaignName,
        spend,
        revenue,
        conversions,
        date,
        source: 'manual',
      };

      setAdEntries(prev => [newEntry, ...prev]);
      setAdForm(prev => ({ ...prev, campaignName: '', spend: '', revenue: '', conversions: '' }));
      toast({ title: 'เพิ่มข้อมูลแคมเปญแล้ว', description: `${campaignName} ถูกบันทึกเรียบร้อย` });
    },
    [adForm, toast]
  );

  const handleAddOrderEntry = useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      const amount = F.num(orderForm.amount);
      const cost = F.num(orderForm.cost);
      const items = Math.max(1, F.num(orderForm.items));
      const orderId = orderForm.orderId.trim() || `ORDER-${Date.now()}`;
      const date = orderForm.date || new Date().toISOString().slice(0, 10);

      const newEntry: OrderEntry = {
        id: Date.now(),
        platform: orderForm.platform,
        orderId,
        amount,
        cost,
        items,
        date,
        source: 'manual',
      };

      setOrderEntries(prev => [newEntry, ...prev]);
      setOrderForm(prev => ({ ...prev, orderId: '', amount: '', cost: '', items: '' }));
      toast({ title: 'เพิ่มคำสั่งซื้อแล้ว', description: `บันทึกคำสั่งซื้อ ${orderId} สำเร็จ` });
    },
    [orderForm, toast]
  );

  const handleRemoveAdEntry = useCallback((id: number) => {
    setAdEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const handleRemoveOrderEntry = useCallback((id: number) => {
    setOrderEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const handlePlatformSync = useCallback(
    (type: 'ad' | 'order', platform: string) => {
      const now = new Date();
      const date = now.toISOString().slice(0, 10);
      if (type === 'ad') {
        const sample: AdEntry = {
          id: Date.now(),
          platform,
          campaignName: 'Imported Campaign',
          spend: 1200,
          revenue: 2450,
          conversions: 32,
          date,
          source: 'sync',
        };
        setAdEntries(prev => [sample, ...prev]);
        toast({
          title: 'ซิงก์ข้อมูลโฆษณา',
          description: `${getAdPlatformLabel(platform)} ดึงข้อมูลล่าสุดสำเร็จ`,
        });
      } else {
        const sample: OrderEntry = {
          id: Date.now(),
          platform,
          orderId: `SYNC-${Date.now()}`,
          amount: 1890,
          cost: 940,
          items: 2,
          date,
          source: 'sync',
        };
        setOrderEntries(prev => [sample, ...prev]);
        toast({
          title: 'ซิงก์คำสั่งซื้อ',
          description: `${getOrderPlatformLabel(platform)} ดึงข้อมูลล่าสุดสำเร็จ`,
        });
      }
    },
    [getAdPlatformLabel, getOrderPlatformLabel, toast]
  );

  const handleDetectionScan = useCallback(() => {
    const enabledSources = [
      detectionState.nsn ? 'NSN' : null,
      detectionState.nn ? 'N&N' : null,
    ].filter(Boolean);
    toast({
      title: 'เริ่มการตรวจจับแคมเปญ',
      description:
        enabledSources.length > 0
          ? `กำลังสแกนด้วย ${enabledSources.join(' & ')} เพื่อหากำไรสูงสุด`
          : 'เปิดใช้งานอย่างน้อยหนึ่งระบบเพื่อตรวจจับการยิงแอด',
    });
  }, [detectionState, toast]);

  const computeMetrics = useCallback((inputData) => {
    const newInputs = { ...inputData };
    const sellingPrice = F.num(newInputs.sellingPrice);
    const vatProduct = F.num(newInputs.vatProduct);
    const cogs = F.num(newInputs.cogs);
    const platformFeePercent = F.num(newInputs.platformFee);
    const paymentFeePercent = F.num(newInputs.paymentFee);
    const kolFeePercent = F.num(newInputs.kolFee);
    const includePackaging = newInputs.includePackaging !== false;
    const includeShipping = newInputs.includeShipping !== false;
    const includePaymentFee = newInputs.includePaymentFee !== false;
    const includeKolFee = Boolean(newInputs.includeKolFee);
    const includeCodFee = Boolean(newInputs.includeCodFee);
    const includeExtraHandling = Boolean(newInputs.includeExtraHandling);
    const includeReturnRate = Boolean(newInputs.includeReturnRate);
    const includeLtv = Boolean(newInputs.includeLtv);
    const packagingCost = includePackaging ? F.num(newInputs.packagingCost) : 0;
    const shippingCost = includeShipping ? F.num(newInputs.shippingCost) : 0;
    const codFeePercent = includeCodFee ? F.num(newInputs.codFeePercent) : 0;
    const extraHandlingCost = includeExtraHandling ? F.num(newInputs.extraHandlingCost) : 0;
    const ltvContribution = includeLtv ? F.num(newInputs.ltvPerCustomer) : 0;
    const expectedConversionRatePercent = Math.max(F.num(newInputs.expectedConversionRate), 0);
    const expectedConversionRate = expectedConversionRatePercent / 100;
    const priceBeforeVat = sellingPrice / (1 + vatProduct / 100);
    const platformFeeCost = priceBeforeVat * (platformFeePercent / 100);
    const paymentFeeCost = includePaymentFee ? sellingPrice * (paymentFeePercent / 100) : 0;
    const kolFeeCost = includeKolFee ? priceBeforeVat * (kolFeePercent / 100) : 0;
    const codFeeCost = includeCodFee ? sellingPrice * (codFeePercent / 100) : 0;
    const totalVariableCost = cogs + platformFeeCost + paymentFeeCost + kolFeeCost + packagingCost + shippingCost + codFeeCost + extraHandlingCost;
    const baseGrossProfitUnit = priceBeforeVat - totalVariableCost + ltvContribution;
    const returnRatePercent = includeReturnRate ? Math.min(Math.max(F.num(newInputs.returnRatePercent), 0), 100) : 0;
    const returnRate = returnRatePercent / 100;
    const returnImpact = baseGrossProfitUnit * returnRate;
    const grossProfitUnit = baseGrossProfitUnit - returnImpact;

    const breakevenRoas = grossProfitUnit > 0 ? priceBeforeVat / grossProfitUnit : 0;
    const breakevenCpa = grossProfitUnit;
    const breakevenAdCostPercent = priceBeforeVat > 0 ? (breakevenCpa / priceBeforeVat) * 100 : 0;
    const maxCpc = expectedConversionRate > 0 ? breakevenCpa * expectedConversionRate : 0;

    let targetRoas = F.num(newInputs.targetRoas);
    let targetCpa = F.num(newInputs.targetCpa);
    let adCostPercent = F.num(newInputs.adCostPercent);

    if (priceBeforeVat > 0) {
      if (newInputs.calcDriver === 'roas') {
        targetCpa = targetRoas > 0 ? priceBeforeVat / targetRoas : 0;
        adCostPercent = priceBeforeVat > 0 ? (targetCpa / priceBeforeVat) * 100 : 0;
      } else if (newInputs.calcDriver === 'cpa') {
        targetRoas = targetCpa > 0 ? priceBeforeVat / targetCpa : 0;
        adCostPercent = priceBeforeVat > 0 ? (targetCpa / priceBeforeVat) * 100 : 0;
      } else {
        targetCpa = priceBeforeVat * (adCostPercent / 100);
        targetRoas = targetCpa > 0 ? priceBeforeVat / targetCpa : 0;
      }
    } else {
      targetRoas = 0;
      targetCpa = 0;
      adCostPercent = 0;
    }

    const netProfitUnit = grossProfitUnit - targetCpa;
    const profitGoal = F.num(newInputs.profitGoal);
    const fixedCosts = F.num(newInputs.fixedCosts);
    const monthlyProfitGoal = newInputs.profitGoalTimeframe === 'daily' ? profitGoal * 30 : profitGoal;
    const totalProfitTarget = monthlyProfitGoal + fixedCosts;
    const targetOrders = netProfitUnit > 0 ? totalProfitTarget / netProfitUnit : 0;
    const targetRevenue = targetOrders * sellingPrice;
    const adBudget = targetOrders * targetCpa;
    const targetOrdersDaily = targetOrders / 30;
    const adBudgetWithVat = adBudget * (1 + (vatProduct / 100));
    const monthlyProfitProjection = netProfitUnit * targetOrders;
    const monthlyRevenueProjection = sellingPrice * targetOrders;

    const funnelPlan = funnelPlans[newInputs.funnelPlan] || funnelPlans.launch;
    const tofuBudget = adBudget * (funnelPlan.tofu / 100);
    const mofuBudget = adBudget * (funnelPlan.mofu / 100);
    const bofuBudget = adBudget * (funnelPlan.bofu / 100);

    const numAccounts = F.num(newInputs.numberOfAccounts) || 1;
    const tofuBudgetPerAccountMonthly = tofuBudget / numAccounts;
    const mofuBudgetPerAccountMonthly = mofuBudget / numAccounts;
    const bofuBudgetPerAccountMonthly = bofuBudget / numAccounts;
    const tofuBudgetPerAccountDaily = tofuBudgetPerAccountMonthly / 30;
    const mofuBudgetPerAccountDaily = mofuBudgetPerAccountMonthly / 30;
    const bofuBudgetPerAccountDaily = bofuBudgetPerAccountMonthly / 30;

    const metrics = {
      grossProfitUnit,
      breakevenRoas,
      breakevenCpa,
      breakevenAdCostPercent,
      maxCpc,
      targetOrders,
      targetOrdersDaily,
      targetRevenue,
      adBudget,
      adBudgetWithVat,
      tofuBudget,
      mofuBudget,
      bofuBudget,
      tofuBudgetPerAccountMonthly,
      mofuBudgetPerAccountMonthly,
      bofuBudgetPerAccountMonthly,
      tofuBudgetPerAccountDaily,
      mofuBudgetPerAccountDaily,
      bofuBudgetPerAccountDaily,
      netProfitUnit,
      targetRoas,
      targetCpa,
      adCostPercent,
      priceBeforeVat,
      ltvContribution,
      returnImpact,
      expectedConversionRate: expectedConversionRatePercent,
      monthlyProfitProjection,
      monthlyRevenueProjection,
      expectedReturnRate: returnRatePercent,
      codFeePercent,
      extraHandlingCost,
    };

    const updatedInputs = { ...newInputs };
    let shouldUpdateInputs = false;

    if (newInputs.calcDriver !== 'roas' && isFinite(targetRoas) && F.num(newInputs.targetRoas).toFixed(2) !== targetRoas.toFixed(2)) {
      updatedInputs.targetRoas = targetRoas > 0 ? targetRoas.toFixed(2) : '';
      shouldUpdateInputs = true;
    }
    if (newInputs.calcDriver !== 'cpa' && isFinite(targetCpa) && F.num(newInputs.targetCpa).toFixed(2) !== targetCpa.toFixed(2)) {
      updatedInputs.targetCpa = targetCpa > 0 ? targetCpa.toFixed(2) : '';
      shouldUpdateInputs = true;
    }
    if (newInputs.calcDriver !== 'adcost' && isFinite(adCostPercent) && F.num(newInputs.adCostPercent).toFixed(1) !== adCostPercent.toFixed(1)) {
      updatedInputs.adCostPercent = adCostPercent > 0 ? adCostPercent.toFixed(1) : '';
      shouldUpdateInputs = true;
    }

    return {
      metrics,
      updatedInputs,
      shouldUpdateInputs,
      warnings: {
        roasBelowBreakeven:
          newInputs.calcDriver === 'roas' && targetRoas > 0 && breakevenRoas > 0 && targetRoas < breakevenRoas,
      },
    };
  }, []);

  const handleInputChange = useCallback((key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleStopRuleChange = useCallback((field: keyof StopRuleConfig, value: number | string) => {
    setStopRules(prev => ({
      ...prev,
      [field]: Number(value),
    }));
  }, []);

  const handleWhatIfChange = useCallback((field: 'cpc' | 'conversionRate' | 'orderValue', value: number) => {
    setWhatIfState(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const platformReport = useMemo(() => {
    const baseInputs = { ...inputs };
    return Object.entries(platformFees).map(([key, fees]) => {
      const platformInputs = {
        ...baseInputs,
        salesPlatform: key,
        platformFee: key === 'other' ? baseInputs.platformFee : fees.platform.toString(),
        paymentFee: key === 'other' ? baseInputs.paymentFee : fees.payment.toString(),
      };

      const { metrics } = computeMetrics(platformInputs);

      return {
        key,
        name: platformFeeLabels[key] || key,
        fees: {
          platform: key === 'other' ? F.num(platformInputs.platformFee) : fees.platform,
          payment: key === 'other' ? F.num(platformInputs.paymentFee) : fees.payment,
        },
        metrics,
      };
    });
  }, [inputs, computeMetrics]);

  const platformReportTotals = useMemo(() => {
    const aggregate = platformReport.reduce(
      (acc, item) => {
        acc.totalRevenue += item.metrics.targetRevenue || 0;
        acc.totalAdBudget += item.metrics.adBudget || 0;
        acc.totalOrders += item.metrics.targetOrders || 0;
        acc.netProfitSum += item.metrics.netProfitUnit || 0;
        return acc;
      },
      { totalRevenue: 0, totalAdBudget: 0, totalOrders: 0, netProfitSum: 0 }
    );

    const platformCount = platformReport.length;

    return {
      totalRevenue: aggregate.totalRevenue,
      totalAdBudget: aggregate.totalAdBudget,
      totalOrders: aggregate.totalOrders,
      averageNetProfitUnit: platformCount > 0 ? aggregate.netProfitSum / platformCount : 0,
    };
  }, [platformReport]);

  const handleSavePreset = useCallback(() => {
    const name = (newPresetName || inputs.productName || 'Preset ใหม่').trim();
    if (!name) {
      toast({
        title: 'กรุณาตั้งชื่อ Preset',
        description: 'ตั้งชื่อสั้นๆ เพื่อจำง่ายเวลาหยิบมาใช้',
        variant: 'destructive',
      });
      return;
    }

    const preset: ProductPreset = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      data: { ...inputs },
    };

    setProductPresets(prev => [...prev, preset]);
    setNewPresetName('');
    toast({ title: 'บันทึก Preset แล้ว', description: `เลือก ${name} เพื่อเติมข้อมูลอัตโนมัติได้เลย` });
  }, [inputs, newPresetName, toast]);

  const handleApplyPreset = useCallback((presetId: string) => {
    const preset = productPresets.find(item => item.id === presetId);
    if (!preset) {
      return;
    }

    setInputs(prev => ({
      ...prev,
      ...preset.data,
    }));

    toast({ title: `โหลด ${preset.name} แล้ว`, description: 'ข้อมูลสินค้าและต้นทุนถูกเติมให้ครบ' });
  }, [productPresets, toast]);

  const handleDeletePreset = useCallback((presetId: string) => {
    setProductPresets(prev => prev.filter(item => item.id !== presetId));
  }, []);

  const calculateAll = useCallback(() => {
    const { metrics, updatedInputs, shouldUpdateInputs, warnings } = computeMetrics(inputs);
    setCalculated(metrics);

    if (shouldUpdateInputs) {
      setInputs(updatedInputs);
    }

    if (warnings.roasBelowBreakeven) {
      toast({
        variant: "destructive",
        title: "Warning",
        description: "เป้าหมาย ROAS ต่ำกว่าจุดคุ้มทุน อาจทำให้ขาดทุนได้",
      });
    }
  }, [inputs, computeMetrics, toast]);


  const handleViewSummary = useCallback(() => {
    calculateAll();
    setActiveTab('summary');
  }, [calculateAll]);

  const handleConfirmPlan = useCallback(() => {
    handleViewSummary();
    toast({
      title: 'พร้อมดูผลสรุปแล้ว',
      description: 'แสดงหน้าสรุปตามข้อมูลล่าสุดเรียบร้อย',
    });
  }, [handleViewSummary, toast]);


  useEffect(() => {
    calculateAll();
  }, [
    inputs.sellingPrice,
    inputs.vatProduct,
    inputs.cogs,
    inputs.platformFee,
    inputs.paymentFee,
    inputs.kolFee,
    inputs.packagingCost,
    inputs.shippingCost,
    inputs.includePackaging,
    inputs.includeShipping,
    inputs.includePaymentFee,
    inputs.includeKolFee,
    inputs.includeCodFee,
    inputs.codFeePercent,
    inputs.includeExtraHandling,
    inputs.extraHandlingCost,
    inputs.includeReturnRate,
    inputs.returnRatePercent,
    inputs.includeLtv,
    inputs.ltvPerCustomer,
    inputs.expectedConversionRate,
    inputs.profitGoal,
    inputs.profitGoalTimeframe,
    inputs.fixedCosts,
    inputs.targetRoas,
    inputs.targetCpa,
    inputs.adCostPercent,
    inputs.calcDriver,
    inputs.funnelPlan,
    inputs.numberOfAccounts,
    inputs.budgetingStrategy,
    calculateAll,
  ]);

  useEffect(() => {
    if (activeTab === 'summary') {
      requestAnimationFrame(() => {
        summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [activeTab]);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
        try {
            const savedHistory = JSON.parse(localStorage.getItem('profitPlannerHistory') || '[]');
            setHistory(savedHistory);

            const savedTheme = localStorage.getItem('profitPlannerTheme') || 'dark';
            setTheme(savedTheme);

            const savedAds = JSON.parse(localStorage.getItem('profitPlannerAds') || '[]');
            if (Array.isArray(savedAds)) {
              setAdEntries(savedAds);
            }

            const savedOrders = JSON.parse(localStorage.getItem('profitPlannerOrders') || '[]');
            if (Array.isArray(savedOrders)) {
              setOrderEntries(savedOrders);
            }

            const savedPresets = JSON.parse(localStorage.getItem('profitPlannerPresets') || '[]');
            if (Array.isArray(savedPresets)) {
              setProductPresets(savedPresets);
            }
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

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem('profitPlannerAds', JSON.stringify(adEntries));
    } catch (error) {
      console.error('Could not persist ad entries:', error);
    }
  }, [adEntries, isClient]);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem('profitPlannerOrders', JSON.stringify(orderEntries));
    } catch (error) {
      console.error('Could not persist order entries:', error);
    }
  }, [orderEntries, isClient]);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem('profitPlannerPresets', JSON.stringify(productPresets));
    } catch (error) {
      console.error('Could not persist presets:', error);
    }
  }, [productPresets, isClient]);
  
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

  useEffect(() => {
    setWhatIfState({
      cpc: F.num(webAdPlan.expectedCpc),
      conversionRate: F.num(webAdPlan.expectedConversionRate),
      orderValue: F.num(webAdPlan.averageOrderValue),
    });
  }, [webAdPlan.expectedCpc, webAdPlan.expectedConversionRate, webAdPlan.averageOrderValue]);

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

  const requestRenameHistoryItem = (item) => {
    setRenameHistoryState({ isOpen: true, id: item.id, name: item.name || '' });
  };

  const handleRenameHistoryNameChange = (value) => {
    setRenameHistoryState(prev => ({ ...prev, name: value }));
  };

  const closeRenameHistoryDialog = () => {
    setRenameHistoryState({ isOpen: false, id: null, name: '' });
  };

  const handleRenameHistorySubmit = () => {
    if (typeof window === 'undefined') return;
    if (!renameHistoryState.id) {
      closeRenameHistoryDialog();
      return;
    }
    const trimmedName = (renameHistoryState.name || '').trim() || 'แผนที่ไม่ได้ตั้งชื่อ';
    const updatedHistory = history.map(item =>
      item.id === renameHistoryState.id ? { ...item, name: trimmedName } : item,
    );
    setHistory(updatedHistory);
    localStorage.setItem('profitPlannerHistory', JSON.stringify(updatedHistory));
    toast({ title: 'Success', description: `เปลี่ยนชื่อแผนเป็น "${trimmedName}" แล้ว` });
    closeRenameHistoryDialog();
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
      toast({ variant: 'destructive', title: 'No Rules', description: 'Please add at least one automation rule.' });
      return;
    }

    const workflowName = (n8nWorkflowName || '').trim() || 'Profit Pilot Workflow';
    const primaryGoal = (n8nPrimaryGoal || '').trim() || 'Scale Revenue & Optimize CPA';

    setN8nWorkflow({ json: null, loading: true });

    try {
      const { generateAutomationWorkflow } = await import('./actions');
      const result = await generateAutomationWorkflow({
        workflowName,
        primaryGoal,
        platforms: [inputs.automationTool],
        features: automationRules.map(r => r.action),
        rules: automationRules,
      });
      setN8nWorkflow({ json: result.workflowJson, loading: false });
      setN8nWorkflowName(workflowName);
      setN8nPrimaryGoal(primaryGoal);
      toast({ title: 'Success', description: 'n8n Workflow JSON generated successfully!' });
    } catch (error) {
      setN8nWorkflow({ json: null, loading: false });
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate workflow.' });
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
  
  const funnelLabels = useMemo(() => {
    const plan = funnelPlans[inputs.funnelPlan] || { tofu: 0, mofu: 0, bofu: 0 };
    return {
      TOFU: { title: `TOFU ${plan.tofu}%`, lines: [`งบ/วัน: ${F.formatCurrency(calculated.tofuBudgetPerAccountDaily)}`] },
      MOFU: { title: `MOFU ${plan.mofu}%`, lines: [`งบ/วัน: ${F.formatCurrency(calculated.mofuBudgetPerAccountDaily)}`] },
      BOFU: { title: `BOFU ${plan.bofu}%`, lines: [`งบ/วัน: ${F.formatCurrency(calculated.bofuBudgetPerAccountDaily)}`] },
    };
  }, [inputs.funnelPlan, calculated]);

  const defaultFunnelLabels = useMemo(() => {
    return {
      TOFU: { title: 'TOFU', lines: ['Top of Funnel:', 'VDOs / Social Media'] },
      MOFU: { title: 'MOFU', lines: ['Middle of Funnel:', 'White Papers / Case Studies'] },
      BOFU: { title: 'BOFU', lines: ['Bottom of Funnel', 'Incentives and Offers / Sales'] },
    };
  }, []);

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
                {/* Main vertical connector for Ad Groups */}
                <line
                  x1={adGroupX}
                  y1={adGroupYPositions[0] + 25}
                  x2={adGroupX}
                  y2={adGroupYPositions[adGroupYPositions.length - 1] + 25}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                />

                {/* Line from Campaign to the middle of the Ad Group vertical connector */}
                <line
                  x1={campaignX + campaignBoxWidth}
                  y1={campaignY + 48}
                  x2={adGroupX}
                  y2={(adGroupYPositions[0] + 25 + adGroupYPositions[adGroupYPositions.length - 1] + 25) / 2}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                />

                {/* Lines from vertical to each Ad Group */}
                {adGroupYPositions.map((y, i) => (
                  <g key={`adgroup-lines-${i}`}>
                    <line
                      x1={adGroupX}
                      y1={y + 25}
                      x2={adGroupX + adGroupBoxWidth}
                      y2={y + 25}
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                    />
                    {/* Connection from Ad Group to corresponding Ad */}
                    <line
                      x1={adGroupX + adGroupBoxWidth}
                      y1={y + 25}
                      x2={adX}
                      y2={adYPositions[i] ? adYPositions[i] + 20 : y + 25} // Fallback if ad position is missing
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                    />
                  </g>
                ))}
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
              <div className="absolute" style={{ left: adGroupX, top: 0, height: '100%' }}>
                  {funnel.adGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="absolute neumorphic-card flex flex-col items-center justify-center p-2 h-[50px] w-full text-xs text-center" style={{ width: adGroupBoxWidth, top: adGroupYPositions[groupIndex] }}>
                      <p className="font-bold">{group.title}</p>
                      {group.subtitle && <p>{group.subtitle}</p>}
                    </div>
                  ))}
              </div>
  
              {/* Ad Boxes */}
               <div className="absolute" style={{ left: adX, top: 0, height: '100%' }}>
                  {funnel.ads.map((ad, adIndex) => (
                    <div key={adIndex} className={cn("absolute neumorphic-card p-2 h-[40px] text-sm text-center flex items-center justify-center font-bold")} style={{ width: adBoxWidth, top: adYPositions[adIndex] }}>
                      {ad}
                    </div>
                  ))}
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
        budget: `งบ/วัน: ${F.formatCurrency(calculated.tofuBudgetPerAccountDaily)}`,
        accounts: `${F.formatInt(numAccounts)} บัญชี`,
      },
      adGroups: [
        { title: 'Demographic', subtitle: '(ประชากรศาสตร์)' },
        { title: 'Interest', subtitle: '(ความสนใจ)' },
        { title: 'Behavior', subtitle: '(พฤติกรรม)' },
        { title: 'Lookalike' },
      ],
      ads: ['VDO 1', 'VDO 2', 'รูปภาพ', 'ข้อความ'],
    },
    {
      stage: 'Retarget',
      campaign: {
        title: 'CBO / ABO',
        budget: `งบ/วัน: ${F.formatCurrency(calculated.bofuBudgetPerAccountDaily)}`,
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


  const ReportMetric = ({ label, value, helper }) => (
    <div className="p-4 rounded-lg bg-background/60 border border-primary/20 shadow-inner">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-lg font-bold mt-1">{value}</p>
      {helper && <p className="text-xs text-muted-foreground mt-1">{helper}</p>}
    </div>
  );

  const SummaryStat = ({ label, value, helper }) => (
    <div className="rounded-2xl border bg-card/70 p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
      {helper && <p className="mt-1 text-xs text-muted-foreground">{helper}</p>}
    </div>
  );

  const SummaryInfoCard = ({ title, value, subValue, icon: Icon }) => (
    <Card className="rounded-2xl border bg-card/80 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
      </CardContent>
    </Card>
  );

  const summaryTabsConfig = useMemo(
    () => [
      {
        value: 'overview',
        label: 'ภาพรวม',
        icon: LayoutDashboard,
        helper: `ROAS ปัจจุบัน ${F.formatNumber(actualRoas, 2)}x`,
      },
      {
        value: 'profitability',
        label: 'กำไร & ROAS',
        icon: Gauge,
        helper: `BE ROAS ${F.formatNumber(calculated.breakevenRoas || 0, 2)}x`,
      },
      {
        value: 'budget',
        label: 'เป้าหมาย & งบ',
        icon: Target,
        helper: `งบ/เดือน ${F.formatCurrency(calculated.adBudget || 0)}`,
      },
      {
        value: 'advisor',
        label: 'แจ้งเตือน & AI',
        icon: BrainCircuit,
        helper: roasHealth.label,
      },
    ],
    [actualRoas, calculated.adBudget, calculated.breakevenRoas, roasHealth.label],
  );

  const StopAlertCard = () => (
    <Card className="rounded-3xl border bg-card/80 shadow-sm">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <AlertCircle
            className={cn(
              'h-5 w-5',
              stopAlert.status === 'stop'
                ? 'text-destructive'
                : stopAlert.status === 'warning'
                ? 'text-amber-500'
                : 'text-primary',
            )}
          />
          ระบบเตือนควรหยุดยิงแอด
        </CardTitle>
        <CardDescription>ตั้งเงื่อนไขหยุดเทสเมื่อ ROAS ต่ำหรือใช้งบเกิน</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={cn(
            'rounded-2xl border p-4',
            stopAlert.status === 'stop'
              ? 'border-destructive/40 bg-destructive/10'
              : stopAlert.status === 'warning'
              ? 'border-amber-400/40 bg-amber-400/10'
              : 'border-emerald-400/40 bg-emerald-400/10',
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{stopAlert.message}</p>
              {stopAlert.reasons.length > 0 ? (
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {stopAlert.reasons.map(reason => (
                    <li key={reason}>• {reason}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">ROAS ยังสูงกว่าจุดคุ้มทุน และงบยังไม่เกินขอบเขต</p>
              )}
            </div>
            <Badge variant={stopAlert.status === 'stop' ? 'destructive' : stopAlert.status === 'warning' ? 'default' : 'secondary'}>
              {stopAlert.status === 'stop' ? 'ควรหยุด' : stopAlert.status === 'warning' ? 'เริ่มเสี่ยง' : 'ปลอดภัย'}
            </Badge>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <Label htmlFor="rule-consecutive" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              ROAS ต่ำกว่าคุ้มทุน (วัน)
            </Label>
            <Input
              id="rule-consecutive"
              type="number"
              min={1}
              value={stopRules.consecutiveDays}
              onChange={event => handleStopRuleChange('consecutiveDays', event.target.value)}
              className="neumorphic-input mt-1"
            />
          </div>
          <div>
            <Label htmlFor="rule-loss" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              ขาดทุนสะสม (฿)
            </Label>
            <Input
              id="rule-loss"
              type="number"
              min={0}
              value={stopRules.lossThreshold}
              onChange={event => handleStopRuleChange('lossThreshold', event.target.value)}
              className="neumorphic-input mt-1"
            />
          </div>
          <div>
            <Label htmlFor="rule-budget" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              งบเทสสูงสุด (x ราคาสินค้า)
            </Label>
            <Input
              id="rule-budget"
              type="number"
              min={1}
              step={0.5}
              value={stopRules.testBudgetMultiple}
              onChange={event => handleStopRuleChange('testBudgetMultiple', event.target.value)}
              className="neumorphic-input mt-1"
            />
            {stopAlert.spendLimit > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">งบเทสสูงสุดตอนนี้ {F.formatCurrency(stopAlert.spendLimit)}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const quickStatusToneClass: Record<'ready' | 'warning' | 'info', string> = {
    ready: 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
    warning: 'border border-amber-500/30 bg-amber-500/10 text-amber-500',
    info: 'border border-primary/30 bg-primary/10 text-primary',
  };

  const quickNavigationSections = useMemo((): { primary: QuickNavConfig[]; tools: QuickNavConfig[] } => {
    const summaryProjection = calculated.monthlyProfitProjection || 0;
    const summaryStatus =
      summaryProjection > 0
        ? { tone: 'ready', label: `กำไรจำลอง 30 วัน ${F.formatCurrency(summaryProjection)}` }
        : summaryProjection < 0
        ? { tone: 'warning', label: `ขาดทุนจำลอง 30 วัน ${F.formatCurrency(summaryProjection)}` }
        : { tone: 'info', label: 'ยังไม่คำนวณกำไร' };

    const platformRevenue = platformReportTotals.totalRevenue || 0;
    const platformStatus =
      platformRevenue > 0
        ? { tone: 'info', label: `ยอดขายรวม ${F.formatCurrency(platformRevenue)}` }
        : { tone: 'warning', label: 'ยังไม่มีข้อมูลแพลตฟอร์ม' };

    const adLaunchStatus =
      launchReady
        ? { tone: 'ready', label: 'พร้อมจำลองยิงแล้ว' }
        : missingCredentials.length > 0 || zeroBudgetPlatforms.length > 0
        ? { tone: 'warning', label: 'กรอก API / งบให้ครบ' }
        : { tone: 'info', label: 'เติมรายละเอียดการยิงแอด' };

    const automationStatus =
      automationRules.length > 0
        ? { tone: 'info', label: `${automationRules.length.toLocaleString('th-TH')} กฎพร้อมใช้` }
        : { tone: 'warning', label: 'ยังไม่มีกฎอัตโนมัติ' };

    const workflowStatus =
      automationRules.length > 0
        ? { tone: 'info', label: 'สร้าง Workflow จาก Rule ที่มีได้เลย' }
        : { tone: 'warning', label: 'เพิ่ม Rule ก่อนใช้งาน' };

    const historyStatus =
      history.length > 0
        ? { tone: 'info', label: `${history.length.toLocaleString('th-TH')} แผนที่บันทึกไว้` }
        : { tone: 'warning', label: 'ยังไม่มีประวัติ' };

    return {
      primary: [
        {
          key: 'planning',
          title: 'ตั้งค่าต้นทุน & เป้าหมาย',
          description: 'กรอกต้นทุนจริง คำนวณ Break-even ROAS, CPA และ Max CPC',
          icon: GanttChartSquare,
          status: { tone: 'ready', label: 'พร้อมใช้งาน' },
        },
        {
          key: 'ad-launch',
          title: 'จำลองยิงแอดหลายแพลตฟอร์ม',
          description: 'แบ่งงบ ยิง API ไปยัง Facebook, TikTok, Google และ Lazada',
          icon: Send,
          status: adLaunchStatus,
        },
        {
          key: 'summary',
          title: 'ดูสรุปกำไร 30 วัน',
          description: 'รวม ROAS, CPA, Margin และระบบเตือนหยุดยิง',
          icon: FileText,
          status: summaryStatus,
        },
      ],
      tools: [
        {
          key: 'metrics',
          title: 'Metrics แนะนำ',
          description: 'เกณฑ์วัดผลสำคัญของแต่ละช่องทาง',
          icon: CalendarCheck,
          status: { tone: 'info', label: 'เปรียบเทียบตัวชี้วัด' },
        },
        {
          key: 'funnel',
          title: 'กลยุทธ์ Funnel',
          description: 'ไอเดีย TOFU / MOFU / BOFU พร้อมใช้งาน',
          icon: Filter,
          status: { tone: 'info', label: 'พร้อมใช้งาน' },
        },
        {
          key: 'automation',
          title: 'สร้าง Rule อัตโนมัติ',
          description: 'ตั้งเงื่อนไขหยุด/บูสต์เหมือน Revealbot',
          icon: Bot,
          status: automationStatus,
        },
        {
          key: 'workflow',
          title: 'n8n Workflow Generator',
          description: 'สร้าง JSON Workflow จาก Rule ที่ตั้งไว้',
          icon: Zap,
          status: workflowStatus,
        },
        {
          key: 'platform-report',
          title: 'รายงานแพลตฟอร์ม',
          description: 'รวมยอดขาย งบ และกำไรทุกแพลตฟอร์ม',
          icon: LayoutDashboard,
          status: platformStatus,
        },
        {
          key: 'history',
          title: 'ประวัติการวางแผน',
          description: 'โหลดแผนที่เคยบันทึกไว้อย่างรวดเร็ว',
          icon: History,
          status: historyStatus,
        },
      ],
    };
  }, [
    automationRules.length,
    calculated.monthlyProfitProjection,
    history.length,
    launchReady,
    missingCredentials.length,
    platformReportTotals.totalRevenue,
    zeroBudgetPlatforms.length,
  ]);

  const totalAdCpa = useMemo(
    () => (adSummary.total.conversions > 0 ? adSummary.total.spend / adSummary.total.conversions : 0),
    [adSummary.total.conversions, adSummary.total.spend],
  );

  const totalAdMargin = useMemo(
    () => (adSummary.total.revenue > 0 ? adSummary.total.profit / adSummary.total.revenue : 0),
    [adSummary.total.profit, adSummary.total.revenue],
  );

  const mainTabGroups = useMemo(
    () => [
      {
        key: 'overview',
        title: 'ภาพรวม & สรุป',
        description: 'ดูตัวเลขสำคัญและประวัติล่าสุด',
        items: [
          {
            value: 'home',
            label: 'ภาพรวม & ทางลัด',
            helper: `ROAS ปัจจุบัน ${F.formatNumber(actualRoas, 2)}x`,
            icon: Home,
          },
          {
            value: 'summary',
            label: 'สรุปแผน',
            helper: `จำลองกำไร 30 วัน ${F.formatCurrency(calculated.monthlyProfitProjection)}`,
            icon: FileText,
          },
          {
            value: 'history',
            label: 'ประวัติ',
            helper: history.length > 0 ? `${history.length.toLocaleString('th-TH')} รายการล่าสุด` : 'ยังไม่มีบันทึก',
            icon: History,
          },
        ],
      },
      {
        key: 'execution',
        title: 'การยิงแอด & การวางแผน',
        description: 'ตั้งค่าและจำลองก่อนปล่อยโฆษณาจริง',
        items: [
          {
            value: 'ad-launch',
            label: 'ยิงแอดหลายแพลตฟอร์ม',
            helper: launchReady ? 'พร้อมยิงจริง' : 'เติมข้อมูลให้ครบก่อน',
            icon: Send,
          },
          {
            value: 'metrics',
            label: 'Metrics แนะนำ',
            helper: 'กำหนดตัวเลขที่ต้องตาม',
            icon: CalendarCheck,
          },
          {
            value: 'planning',
            label: 'การวางแผน',
            helper: 'จัดงบและเป้าหมายรายวัน',
            icon: GanttChartSquare,
          },
          {
            value: 'funnel',
            label: 'กลยุทธ์ Funnel',
            helper: 'ไอเดียคอนเทนต์ตามแต่ละเฟส',
            icon: Filter,
          },
        ],
      },
      {
        key: 'automation',
        title: 'ระบบอัตโนมัติ & รายงาน',
        description: 'ต่อยอดการทำงานและตรวจสอบผลแบบละเอียด',
        items: [
          {
            value: 'automation',
            label: 'สร้าง Rule',
            helper:
              automationRules.length > 0
                ? `${automationRules.length.toLocaleString('th-TH')} Rule พร้อมใช้งาน`
                : 'ตั้งค่าเงื่อนไขหยุดยิง',
            icon: Bot,
          },
          {
            value: 'workflow',
            label: 'Workflow Generator',
            helper: missingCredentials.length > 0 ? 'รอตรวจสอบ API' : 'พร้อมคัดลอก Payload',
            icon: Zap,
          },
          {
            value: 'platform-report',
            label: 'รายงานแพลตฟอร์ม',
            helper:
              platformReportTotals.totalRevenue > 0
                ? `ยอดขายรวม ${F.formatCurrency(platformReportTotals.totalRevenue)}`
                : 'รอซิงค์ข้อมูลแพลตฟอร์ม',
            icon: LayoutDashboard,
          },
        ],
      },
    ],
    [
      actualRoas,
      automationRules.length,
      calculated.monthlyProfitProjection,
      history.length,
      launchReady,
      missingCredentials.length,
      platformReportTotals.totalRevenue,
    ],
  );

  const mainTabTriggerClass =
    'flex h-full w-full items-start gap-3 rounded-2xl border border-transparent bg-background/80 p-4 text-left transition hover:border-primary/40 hover:bg-background data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:shadow-md';
  const summaryTabTriggerClass =
    'flex min-h-[72px] w-full flex-col items-start gap-1 rounded-xl px-4 py-3 text-left text-sm font-medium text-muted-foreground transition hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm';

  if (!isClient) {
      return (
        <div className="w-full h-screen flex items-center justify-center bg-background">
          <p className="text-foreground">Loading...</p>
        </div>
      );
  }
  
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-24">
      <Dialog open={presetDialogOpen} onOpenChange={setPresetDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>จัดการ Preset สินค้า</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="preset-name" className="text-sm font-medium text-muted-foreground">
                ตั้งชื่อ Preset ใหม่
              </Label>
              <Input
                id="preset-name"
                value={newPresetName}
                onChange={event => setNewPresetName(event.target.value)}
                placeholder="เช่น ชุดเปิดตัวเดือนนี้"
                className="neumorphic-input"
              />
              <Button onClick={handleSavePreset} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                บันทึก Preset ปัจจุบัน
              </Button>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">รายการ Preset</p>
              {productPresets.length === 0 ? (
                <p className="text-sm text-muted-foreground">ยังไม่มี Preset บันทึกไว้</p>
              ) : (
                <div className="max-h-64 space-y-3 overflow-y-auto pr-2">
                  {productPresets.map(preset => (
                    <div key={preset.id} className="flex items-center justify-between rounded-2xl border bg-muted/40 p-3 text-sm">
                      <div>
                        <p className="font-medium text-foreground">{preset.name}</p>
                        <p className="text-xs text-muted-foreground">บันทึก {format(parseISO(preset.createdAt), 'dd MMM yyyy HH:mm')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            handleApplyPreset(preset.id);
                            setPresetDialogOpen(false);
                          }}
                        >
                          <CheckIcon className="mr-1 h-3.5 w-3.5" /> ใช้ค่า
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeletePreset(preset.id)}>
                          <Trash2 className="mr-1 h-3.5 w-3.5" /> ลบ
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSimulatorOpen} onOpenChange={setIsSimulatorOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>ตัวจำลอง What-if</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">CPC (฿)</Label>
                  <span className="text-sm font-semibold text-primary">{F.formatNumber(whatIfState.cpc, 2)}</span>
                </div>
                <Slider value={[whatIfState.cpc]} min={1} max={50} step={0.5} onValueChange={([value]) => handleWhatIfChange('cpc', value)} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">อัตราแปลง (%)</Label>
                  <span className="text-sm font-semibold text-primary">{F.formatNumber(whatIfState.conversionRate, 2)}%</span>
                </div>
                <Slider value={[whatIfState.conversionRate]} min={0.1} max={10} step={0.1} onValueChange={([value]) => handleWhatIfChange('conversionRate', value)} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">มูลค่าออเดอร์ (฿)</Label>
                  <span className="text-sm font-semibold text-primary">{F.formatCurrency(whatIfState.orderValue)}</span>
                </div>
                <Slider value={[whatIfState.orderValue]} min={100} max={5000} step={10} onValueChange={([value]) => handleWhatIfChange('orderValue', value)} />
              </div>
              <div className="rounded-2xl border bg-muted/40 p-4 text-xs text-muted-foreground">
                ปรับสไลเดอร์เพื่อดูว่าต้องกด CPC หรือเพิ่ม Conversion Rate เท่าไหร่ถึงจะผ่านจุดคุ้มทุน
              </div>
            </div>
            <div className="flex flex-col justify-between gap-4 rounded-3xl border bg-card/70 p-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">ผลคาดการณ์</p>
                <h3 className="mt-1 text-2xl font-bold text-foreground">{F.formatCurrency(whatIfProjection.profit)}</h3>
                <p className="text-xs text-muted-foreground">กำไร/ขาดทุนต่อวัน หลังปรับค่าตามสไลเดอร์</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">ROAS</p>
                  <p className="text-lg font-semibold">{whatIfProjection.roas > 0 ? `${F.formatNumber(whatIfProjection.roas, 2)}x` : '—'}</p>
                </div>
                <div className="rounded-2xl bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">ออเดอร์/วัน</p>
                  <p className="text-lg font-semibold">{F.formatNumber(whatIfProjection.orders, 2)}</p>
                </div>
                <div className="rounded-2xl bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">ยอดขาย/วัน</p>
                  <p className="text-lg font-semibold">{F.formatCurrency(whatIfProjection.revenue)}</p>
                </div>
                <div className="rounded-2xl bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">ต้นทุนสินค้า</p>
                  <p className="text-lg font-semibold">{F.formatCurrency(whatIfProjection.goodsCost)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl border bg-background/70 p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{whatIfProjection.status.label}</p>
                  <p className="text-xs text-muted-foreground">{whatIfProjection.status.message}</p>
                </div>
                {whatIfProjection.status.tone === 'good' && <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
                {whatIfProjection.status.tone === 'watch' && <AlertCircle className="h-6 w-6 text-amber-500" />}
                {whatIfProjection.status.tone === 'risk' && <AlertTriangle className="h-6 w-6 text-destructive" />}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <header className="rounded-3xl bg-gradient-to-r from-primary to-primary/70 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-white/70">
              Profit &amp; Metrics Planner v5.3
            </p>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">Shearer (S1) Profit Pilot</h1>
            <p className="max-w-2xl text-sm md:text-base text-white/80">
              จัดการข้อมูลยิงแอดและคำสั่งซื้อในที่เดียว ดูสรุปสำคัญได้ทันที และย้ายไปยังหน้าผลลัพธ์ได้เพียงคลิกเดียว
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-base">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/70">กำไรสะสมปีนี้</p>
              <p className="text-2xl font-semibold">{F.formatCurrency(combinedYearProfit)}</p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button variant="secondary" className="w-full" onClick={handleViewSummary}>
                ดูสรุปผลทั้งหมด
              </Button>
              <Button className="w-full" onClick={handleConfirmPlan}>
                ยืนยันข้อมูลล่าสุด
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
        <Card className="rounded-3xl border bg-card/80 shadow-sm">
          <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Megaphone className="h-5 w-5 text-primary" />
                แผนยิงแอดเว็บแบบด่วน
              </CardTitle>
              <CardDescription>กรอกงบและต้นทุน ระบบจะประเมินกำไร/ขาดทุนให้ทันที</CardDescription>
            </div>
            <Badge variant={webAdStatus.variant} className="w-fit whitespace-nowrap">
              {webAdStatus.label}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="web-landing" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    หน้าแลนดิ้ง
                  </Label>
                  <Input
                    id="web-landing"
                    value={webAdPlan.landingPage}
                    onChange={event => handleWebAdPlanChange('landingPage', event.target.value)}
                    className="neumorphic-input mt-1"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="web-budget" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    งบยิงแอดต่อวัน (฿)
                  </Label>
                  <Input
                    id="web-budget"
                    type="number"
                    min="0"
                    value={webAdPlan.dailyBudget}
                    onChange={event => handleWebAdPlanChange('dailyBudget', event.target.value)}
                    className="neumorphic-input mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="web-cpc" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      CPC (฿)
                    </Label>
                    <Input
                      id="web-cpc"
                      type="number"
                      min="0"
                      step="0.1"
                      value={webAdPlan.expectedCpc}
                      onChange={event => handleWebAdPlanChange('expectedCpc', event.target.value)}
                      className="neumorphic-input mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="web-cr" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      อัตราแปลง (%)
                    </Label>
                    <Input
                      id="web-cr"
                      type="number"
                      min="0"
                      step="0.1"
                      value={webAdPlan.expectedConversionRate}
                      onChange={event => handleWebAdPlanChange('expectedConversionRate', event.target.value)}
                      className="neumorphic-input mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="web-aov" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      มูลค่าต่อออเดอร์ (฿)
                    </Label>
                    <Input
                      id="web-aov"
                      type="number"
                      min="0"
                      value={webAdPlan.averageOrderValue}
                      onChange={event => handleWebAdPlanChange('averageOrderValue', event.target.value)}
                      className="neumorphic-input mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="web-cogs" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      ต้นทุนสินค้า (฿)
                    </Label>
                    <Input
                      id="web-cogs"
                      type="number"
                      min="0"
                      value={webAdPlan.productCost}
                      onChange={event => handleWebAdPlanChange('productCost', event.target.value)}
                      className="neumorphic-input mt-1"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ReportMetric
                    label="คลิกที่คาดหวัง/วัน"
                    value={`${F.formatNumber(webAdProjection.clicks, 0)} ครั้ง`}
                    helper={`CPC ~ ${F.formatCurrency(webAdPlan.expectedCpc)}`}
                  />
                  <ReportMetric
                    label="ออเดอร์ที่คาดหวัง/วัน"
                    value={`${F.formatNumber(webAdProjection.orders, 1)} ออเดอร์`}
                    helper={`อัตราแปลง ${webAdPlan.expectedConversionRate}%`}
                  />
                  <ReportMetric
                    label="กำไรคาดการณ์"
                    value={
                      <span className={cn(webAdProjection.profit < 0 ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400')}>
                        {F.formatCurrency(webAdProjection.profit)}
                      </span>
                    }
                    helper="หลังหักต้นทุนสินค้าและงบแอด"
                  />
                  <ReportMetric
                    label="ROAS"
                    value={webAdProjection.roas > 0 ? `${F.formatNumber(webAdProjection.roas, 2)}x` : '—'}
                    helper={`มาร์จิ้น ${F.formatNumber(webAdProjection.margin, 1)}%`}
                  />
                  <ReportMetric
                    label="Break-even ROAS"
                    value={webAdProjection.breakEvenRoas > 0 ? `${F.formatNumber(webAdProjection.breakEvenRoas, 2)}x` : '—'}
                    helper={`CPA คุ้มทุน ${F.formatCurrency(webAdProjection.breakEvenCpa)}`}
                  />
                  <ReportMetric
                    label="Max CPC"
                    value={F.formatCurrency(webAdProjection.maxCpc)}
                    helper="สูงสุดที่จ่ายแล้วไม่ขาดทุน"
                  />
                </div>
                <div className="rounded-2xl bg-muted/40 p-3 text-xs text-muted-foreground">
                  ต้องการอย่างน้อย {F.formatNumber(webAdProjection.breakEvenOrders, 1)} ออเดอร์/วัน เพื่อจุดคุ้มทุนของงบนี้ • หากรักษาตัวเลขเดิม 30 วันจะทำยอดขาย {F.formatCurrency(webAdProjection.thirtyDayRevenue)} และกำไร {F.formatCurrency(webAdProjection.thirtyDayProfit)}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                ปรับค่าต่างๆ เพื่อใช้เป็นตัวโชว์และประเมินผลก่อนยิงแอดจริง
              </p>
              <Button onClick={handleLaunchWebsiteAd} className="w-full sm:w-auto">
                ยิงแอดเว็บทันที
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              สัญญาณแคมเปญที่เสี่ยงขาดทุน
            </CardTitle>
            <CardDescription>จับตาแคมเปญที่ยอดซื้อยังน้อยหรือกำลังขาดทุน</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-2xl bg-muted/40 p-4 text-sm">
              <p className="font-semibold">ยอดสั่งซื้อผ่านเว็บวันนี้ {F.formatCurrency(websiteOrderSnapshot.todayAmount)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {websiteOrderSnapshot.todayCount.toLocaleString('th-TH')} ออเดอร์ • เดือนนี้ {websiteOrderSnapshot.monthCount.toLocaleString('th-TH')} ออเดอร์ ({F.formatCurrency(websiteOrderSnapshot.monthAmount)})
              </p>
            </div>
            {atRiskCampaigns.length === 0 ? (
              <p className="text-sm text-muted-foreground">ยอดซื้อกำลังเดินดี ยังไม่มีแคมเปญที่ต้องเร่งแก้</p>
            ) : (
              <div className="space-y-3">
                {atRiskCampaigns.map(campaign => (
                  <div key={campaign.id} className="rounded-2xl border bg-background/60 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{campaign.campaignName}</p>
                        <p className="text-xs text-muted-foreground">
                          {getAdPlatformLabel(campaign.platform)} • {formatEntryDate(campaign.date)}
                        </p>
                      </div>
                      <Badge variant={campaign.profit < 0 ? 'destructive' : 'secondary'}>
                        {campaign.profit < 0 ? 'ขาดทุน' : 'คอนเวอร์ชันต่ำ'}
                      </Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-muted/30 p-2">
                        <p className="text-muted-foreground">รายได้</p>
                        <p className="font-semibold text-foreground">{F.formatCurrency(campaign.revenue)}</p>
                      </div>
                      <div className="rounded-xl bg-muted/30 p-2">
                        <p className="text-muted-foreground">งบใช้ไป</p>
                        <p className="font-semibold text-foreground">{F.formatCurrency(campaign.spend)}</p>
                      </div>
                      <div className="rounded-xl bg-muted/30 p-2">
                        <p className="text-muted-foreground">กำไร / ขาดทุน</p>
                        <p className={cn('font-semibold', campaign.profit < 0 ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400')}>
                          {F.formatCurrency(campaign.profit)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-muted/30 p-2">
                        <p className="text-muted-foreground">ROAS</p>
                        <p className="font-semibold text-foreground">{campaign.spend > 0 ? `${F.formatNumber(campaign.revenue / campaign.spend, 2)}x` : '—'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="rounded-2xl border border-dashed bg-background/40 p-3 text-xs text-muted-foreground">
              งบที่เสี่ยงในตอนนี้ {F.formatCurrency(atRiskSpend)} — เห็นยอดซื้อยังน้อยให้หยุดหรือปรับครีเอทีฟทันที
            </div>
          </CardContent>
        </Card>
        <StopAlertCard />
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="h-full rounded-2xl border bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>สรุปการยิงแอด</CardTitle>
            <CardDescription>แยกโฆษณา Facebook, TikTok, Lazada และอื่นๆ</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="today">วันนี้</TabsTrigger>
                <TabsTrigger value="year">ปีนี้</TabsTrigger>
              </TabsList>
              <TabsContent value="today" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <SummaryStat
                    label="งบโฆษณา"
                    value={F.formatCurrency(adSummary.today.spend)}
                    helper={`${adSummary.today.count.toLocaleString('th-TH')} แคมเปญ`}
                  />
                  <SummaryStat
                    label="รายได้จากแอด"
                    value={F.formatCurrency(adSummary.today.revenue)}
                    helper={`ROAS ${formatRoas(adSummary.today.revenue, adSummary.today.spend)}`}
                  />
                  <SummaryStat
                    label="กำไร/ขาดทุน"
                    value={F.formatCurrency(adSummary.today.profit)}
                    helper={`คอนเวอร์ชัน ${F.formatInt(adSummary.today.conversions)}`}
                  />
                  <SummaryStat
                    label="แคมเปญทั้งหมด"
                    value={adSummary.today.count.toLocaleString('th-TH')}
                    helper="สรุปจากข้อมูลวันนี้"
                  />
                </div>
              </TabsContent>
              <TabsContent value="year" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <SummaryStat
                    label="งบโฆษณาสะสม"
                    value={F.formatCurrency(adSummary.year.spend)}
                    helper={`${adSummary.year.count.toLocaleString('th-TH')} แคมเปญ`}
                  />
                  <SummaryStat
                    label="รายได้สะสม"
                    value={F.formatCurrency(adSummary.year.revenue)}
                    helper={`ROAS ${formatRoas(adSummary.year.revenue, adSummary.year.spend)}`}
                  />
                  <SummaryStat
                    label="กำไรรวม"
                    value={F.formatCurrency(adSummary.year.profit)}
                    helper={`คอนเวอร์ชัน ${F.formatInt(adSummary.year.conversions)}`}
                  />
                  <SummaryStat
                    label="จำนวนแพลตฟอร์ม"
                    value={`${(new Set(adEntries.map(entry => entry.platform)).size || 0).toLocaleString('th-TH')} ช่องทาง`}
                    helper="ข้อมูลรวมตั้งแต่ต้นปี"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          </Card>

          <Card className="h-full rounded-2xl border bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
            <CardDescription>ติดตาม Lazada Shop, Facebook Shop, TikTok Shop และเว็บ</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="today">วันนี้</TabsTrigger>
                <TabsTrigger value="year">ปีนี้</TabsTrigger>
              </TabsList>
              <TabsContent value="today" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <SummaryStat
                    label="ยอดสั่งซื้อ"
                    value={F.formatCurrency(orderSummary.today.amount)}
                    helper={`${orderSummary.today.count.toLocaleString('th-TH')} ออเดอร์`}
                  />
                  <SummaryStat
                    label="ต้นทุน"
                    value={F.formatCurrency(orderSummary.today.cost)}
                    helper={`สินค้า ${F.formatInt(orderSummary.today.items)} ชิ้น`}
                  />
                  <SummaryStat
                    label="กำไรสุทธิ"
                    value={F.formatCurrency(orderSummary.today.profit)}
                    helper="รวมทุกแพลตฟอร์ม"
                  />
                  <SummaryStat
                    label="GP %"
                    value={orderSummary.today.amount > 0 ? `${F.formatNumber((orderSummary.today.profit / orderSummary.today.amount) * 100, 1)}%` : '—'}
                    helper="วันนี้"
                  />
                </div>
              </TabsContent>
              <TabsContent value="year" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <SummaryStat
                    label="ยอดขายสะสม"
                    value={F.formatCurrency(orderSummary.year.amount)}
                    helper={`${orderSummary.year.count.toLocaleString('th-TH')} ออเดอร์`}
                  />
                  <SummaryStat
                    label="ต้นทุนสะสม"
                    value={F.formatCurrency(orderSummary.year.cost)}
                    helper={`สินค้า ${F.formatInt(orderSummary.year.items)} ชิ้น`}
                  />
                  <SummaryStat
                    label="กำไรสะสม"
                    value={F.formatCurrency(orderSummary.year.profit)}
                    helper="รวมทุกช่องทาง"
                  />
                  <SummaryStat
                    label="GP % สะสม"
                    value={orderSummary.year.amount > 0 ? `${F.formatNumber((orderSummary.year.profit / orderSummary.year.amount) * 100, 1)}%` : '—'}
                    helper="ตั้งแต่ต้นปี"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          </Card>
        </div>

        <Card className="h-full rounded-2xl border bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>ศูนย์ควบคุมการตรวจจับแอด</CardTitle>
            <CardDescription>เตรียมพร้อมเชื่อมต่อ NSN &amp; N&amp;N สำหรับอนาคต</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">NSN Intelligence</p>
                <p className="text-xs text-muted-foreground">วิเคราะห์การยิงแอดแบบเรียลไทม์</p>
              </div>
              <Switch
                checked={detectionState.nsn}
                onCheckedChange={value => setDetectionState(prev => ({ ...prev, nsn: value }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">N&amp;N Analytics</p>
                <p className="text-xs text-muted-foreground">ตรวจจับต้นทุนและคำนวณกำไรอัตโนมัติ</p>
              </div>
              <Switch
                checked={detectionState.nn}
                onCheckedChange={value => setDetectionState(prev => ({ ...prev, nn: value }))}
              />
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">กำไรสะสมจากแอด + ออเดอร์</p>
              <p className="text-2xl font-bold mt-1">{F.formatCurrency(combinedYearProfit)}</p>
              <p className="text-xs text-muted-foreground">ใช้เพื่อตั้งเป้าหมายการสแกนในสัปดาห์นี้</p>
            </div>
            <Button className="w-full" onClick={handleDetectionScan}>
              เริ่มสแกนผลลัพธ์โฆษณา
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-2xl border bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>บันทึกและดึงข้อมูลการยิงแอด</CardTitle>
            <CardDescription>แยกค่าใช้จ่ายและผลตอบแทนรายแคมเปญ</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdEntry} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ad-platform" className="text-sm">ช่องทางโฆษณา</Label>
                  <Select value={adForm.platform} onValueChange={value => handleAdFormChange('platform', value)}>
                    <SelectTrigger id="ad-platform" className="neumorphic-select mt-1">
                      <SelectValue placeholder="เลือกแพลตฟอร์ม" />
                    </SelectTrigger>
                    <SelectContent>
                      {adPlatformOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ad-date" className="text-sm">วันที่</Label>
                  <Input
                    id="ad-date"
                    type="date"
                    className="neumorphic-input mt-1"
                    value={adForm.date}
                    onChange={event => handleAdFormChange('date', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ad-campaign" className="text-sm">ชื่อแคมเปญ</Label>
                  <Input
                    id="ad-campaign"
                    className="neumorphic-input mt-1"
                    placeholder="เช่น Retarget TikTok 7 วัน"
                    value={adForm.campaignName}
                    onChange={event => handleAdFormChange('campaignName', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ad-spend" className="text-sm">งบโฆษณา (฿)</Label>
                  <Input
                    id="ad-spend"
                    type="number"
                    min="0"
                    className="neumorphic-input mt-1"
                    value={adForm.spend}
                    onChange={event => handleAdFormChange('spend', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ad-revenue" className="text-sm">รายได้จากแคมเปญ (฿)</Label>
                  <Input
                    id="ad-revenue"
                    type="number"
                    min="0"
                    className="neumorphic-input mt-1"
                    value={adForm.revenue}
                    onChange={event => handleAdFormChange('revenue', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ad-conversions" className="text-sm">จำนวนคอนเวอร์ชัน</Label>
                  <Input
                    id="ad-conversions"
                    type="number"
                    min="0"
                    className="neumorphic-input mt-1"
                    value={adForm.conversions}
                    onChange={event => handleAdFormChange('conversions', event.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => handlePlatformSync('ad', 'facebook_ads')}>
                    ดึง Facebook Ads
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => handlePlatformSync('ad', 'tiktok_ads')}>
                    ดึง TikTok Ads
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => handlePlatformSync('ad', 'lazada_ads')}>
                    ดึง Lazada Ads
                  </Button>
                </div>
                <Button type="submit" className="md:w-auto w-full">
                  บันทึกข้อมูลแอด
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">รายการแคมเปญล่าสุด</h4>
              {adEntries.length === 0 ? (
                <p className="text-xs text-muted-foreground">ยังไม่มีข้อมูลโฆษณาในระบบ กดบันทึกหรือดึงข้อมูลเพื่อเริ่มต้น</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>แพลตฟอร์ม</TableHead>
                        <TableHead>แคมเปญ</TableHead>
                        <TableHead>วันที่</TableHead>
                        <TableHead className="text-right">งบ</TableHead>
                        <TableHead className="text-right">รายได้</TableHead>
                        <TableHead className="text-right">กำไร</TableHead>
                        <TableHead className="text-right">เครื่องมือ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adEntries.map(entry => (
                        <TableRow key={entry.id}>
                          <TableCell>{getAdPlatformLabel(entry.platform)}</TableCell>
                          <TableCell>{entry.campaignName}</TableCell>
                          <TableCell>{formatEntryDate(entry.date)}</TableCell>
                          <TableCell className="text-right">{F.formatCurrency(entry.spend)}</TableCell>
                          <TableCell className="text-right">{F.formatCurrency(entry.revenue)}</TableCell>
                          <TableCell className="text-right">{F.formatCurrency(entry.revenue - entry.spend)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveAdEntry(entry.id)}>
                              ลบ
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="neumorphic-card">
          <CardHeader>
            <CardTitle>บันทึกและดึงข้อมูลคำสั่งซื้อ</CardTitle>
            <CardDescription>ติดตามยอดขายและต้นทุนจากทุกช่องทาง</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddOrderEntry} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order-platform" className="text-sm">ช่องทางการขาย</Label>
                  <Select value={orderForm.platform} onValueChange={value => handleOrderFormChange('platform', value)}>
                    <SelectTrigger id="order-platform" className="neumorphic-select mt-1">
                      <SelectValue placeholder="เลือกแพลตฟอร์ม" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderPlatformOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="order-date" className="text-sm">วันที่</Label>
                  <Input
                    id="order-date"
                    type="date"
                    className="neumorphic-input mt-1"
                    value={orderForm.date}
                    onChange={event => handleOrderFormChange('date', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="order-id" className="text-sm">หมายเลขคำสั่งซื้อ</Label>
                  <Input
                    id="order-id"
                    className="neumorphic-input mt-1"
                    placeholder="เช่น Lazada-001"
                    value={orderForm.orderId}
                    onChange={event => handleOrderFormChange('orderId', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="order-amount" className="text-sm">ยอดขาย (฿)</Label>
                  <Input
                    id="order-amount"
                    type="number"
                    min="0"
                    className="neumorphic-input mt-1"
                    value={orderForm.amount}
                    onChange={event => handleOrderFormChange('amount', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="order-cost" className="text-sm">ต้นทุนรวม (฿)</Label>
                  <Input
                    id="order-cost"
                    type="number"
                    min="0"
                    className="neumorphic-input mt-1"
                    value={orderForm.cost}
                    onChange={event => handleOrderFormChange('cost', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="order-items" className="text-sm">จำนวนสินค้า (ชิ้น)</Label>
                  <Input
                    id="order-items"
                    type="number"
                    min="1"
                    className="neumorphic-input mt-1"
                    value={orderForm.items}
                    onChange={event => handleOrderFormChange('items', event.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => handlePlatformSync('order', 'facebook_shop')}>
                    ดึง Facebook Shop
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => handlePlatformSync('order', 'tiktok_shop')}>
                    ดึง TikTok Shop
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => handlePlatformSync('order', 'lazada_shop')}>
                    ดึง Lazada Shop
                  </Button>
                </div>
                <Button type="submit" className="md:w-auto w-full">
                  บันทึกข้อมูลออเดอร์
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">รายการคำสั่งซื้อล่าสุด</h4>
              {orderEntries.length === 0 ? (
                <p className="text-xs text-muted-foreground">ยังไม่มีข้อมูลคำสั่งซื้อในระบบ กดบันทึกหรือดึงข้อมูลเพื่อเริ่มต้น</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ช่องทาง</TableHead>
                        <TableHead>คำสั่งซื้อ</TableHead>
                        <TableHead>วันที่</TableHead>
                        <TableHead className="text-right">ยอดขาย</TableHead>
                        <TableHead className="text-right">ต้นทุน</TableHead>
                        <TableHead className="text-right">กำไร</TableHead>
                        <TableHead className="text-right">การจัดการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderEntries.map(entry => (
                        <TableRow key={entry.id}>
                          <TableCell>{getOrderPlatformLabel(entry.platform)}</TableCell>
                          <TableCell>{entry.orderId}</TableCell>
                          <TableCell>{formatEntryDate(entry.date)}</TableCell>
                          <TableCell className="text-right">{F.formatCurrency(entry.amount)}</TableCell>
                          <TableCell className="text-right">{F.formatCurrency(entry.cost)}</TableCell>
                          <TableCell className="text-right">{F.formatCurrency(entry.amount - entry.cost)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveOrderEntry(entry.id)}>
                              ลบ
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-3xl border bg-card/80 shadow-sm">
        <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <BarChart className="h-5 w-5 text-primary" />
              เปรียบเทียบแคมเปญทุกช่องทาง
            </CardTitle>
            <CardDescription>ดูว่าแคมเปญไหนกำไรสูง ขาดทุนหนัก หรือ ROAS ดีสุด</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportReport} disabled={campaignComparison.length === 0}>
              <Download className="mr-2 h-4 w-4" /> ส่งออก CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {campaignComparison.length === 0 ? (
            <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูลแคมเปญ ให้เพิ่มข้อมูลเพื่อดูการจัดอันดับ</p>
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>แคมเปญ</TableHead>
                      <TableHead>ช่องทาง</TableHead>
                      <TableHead className="text-right">งบใช้ไป</TableHead>
                      <TableHead className="text-right">รายได้</TableHead>
                      <TableHead className="text-right">กำไร/ขาดทุน</TableHead>
                      <TableHead className="text-right">ROAS</TableHead>
                      <TableHead className="text-right">คอนเวอร์ชัน</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaignComparison.map(item => (
                      <TableRow key={`${item.platform}-${item.campaignName}`}>
                        <TableCell className="font-medium">{item.campaignName}</TableCell>
                        <TableCell>{getAdPlatformLabel(item.platform)}</TableCell>
                        <TableCell className="text-right">{F.formatCurrency(item.spend)}</TableCell>
                        <TableCell className="text-right">{F.formatCurrency(item.revenue)}</TableCell>
                        <TableCell className={cn('text-right font-semibold', item.profit < 0 ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400')}>
                          {F.formatCurrency(item.profit)}
                        </TableCell>
                        <TableCell className="text-right">{item.roas > 0 ? `${F.formatNumber(item.roas, 2)}x` : '—'}</TableCell>
                        <TableCell className="text-right">{F.formatInt(item.conversions)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">ROAS สูงสุด</p>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <ul className="mt-3 space-y-2 text-sm">
                    {topRoasCampaigns.map(item => (
                      <li key={`top-${item.platform}-${item.campaignName}`} className="flex items-center justify-between gap-2">
                        <span className="truncate">{item.campaignName}</span>
                        <span className="font-semibold text-primary">{F.formatNumber(item.roas, 2)}x</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">ขาดทุนหนักสุด</p>
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  </div>
                  <ul className="mt-3 space-y-2 text-sm">
                    {worstLossCampaigns.map(item => (
                      <li key={`loss-${item.platform}-${item.campaignName}`} className="flex items-center justify-between gap-2">
                        <span className="truncate">{item.campaignName}</span>
                        <span className="font-semibold text-destructive">{F.formatCurrency(item.profit)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

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
              {productPresets.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium opacity-80">Preset ล่าสุด</Label>
                  <div className="flex flex-wrap gap-2">
                    {productPresets.map(preset => (
                      <Button
                        key={preset.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleApplyPreset(preset.id)}
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <Button variant="ghost" className="w-full justify-start" onClick={() => setPresetDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> จัดการ Preset สินค้า
              </Button>
              <div className="pt-2">
                <Button onClick={() => setActiveTab('platform-report')} className="neon-button w-full flex items-center justify-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  สรุปรายงานทุกแพลตฟอร์ม
                </Button>
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="paymentFee" className="block text-sm mb-2 font-medium opacity-80">ค่าชำระเงิน (%)</Label>
                      <Switch checked={!!inputs.includePaymentFee} onCheckedChange={value => handleInputChange('includePaymentFee', value)} />
                    </div>
                    <Input id="paymentFee" value={inputs.paymentFee} onChange={(e) => handleInputChange('paymentFee', e.target.value)} type="number" className="neumorphic-input" readOnly={inputs.salesPlatform !== 'other'} disabled={!inputs.includePaymentFee} placeholder="" />
                 </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="kolFee" className="block text-sm mb-2 font-medium opacity-80">ค่าคอมมิชชั่น KOL (%)</Label>
                  <Switch checked={!!inputs.includeKolFee} onCheckedChange={value => handleInputChange('includeKolFee', value)} />
                </div>
                <Input id="kolFee" value={inputs.kolFee} onChange={(e) => handleInputChange('kolFee', e.target.value)} type="number" placeholder="" className="neumorphic-input" disabled={!inputs.includeKolFee} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="packagingCost" className="block text-sm mb-2 font-medium opacity-80">ค่าแพ็ค</Label>
                      <Switch checked={!!inputs.includePackaging} onCheckedChange={value => handleInputChange('includePackaging', value)} />
                    </div>
                    <Input id="packagingCost" value={inputs.packagingCost} onChange={(e) => handleInputChange('packagingCost', e.target.value)} type="number" placeholder="" className="neumorphic-input" disabled={!inputs.includePackaging} />
                 </div>
                 <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="shippingCost" className="block text-sm mb-2 font-medium opacity-80">ค่าส่ง</Label>
                      <Switch checked={!!inputs.includeShipping} onCheckedChange={value => handleInputChange('includeShipping', value)} />
                    </div>
                    <Input id="shippingCost" value={inputs.shippingCost} onChange={(e) => handleInputChange('shippingCost', e.target.value)} type="number" placeholder="" className="neumorphic-input" disabled={!inputs.includeShipping} />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="codFeePercent" className="block text-sm mb-2 font-medium opacity-80">ค่าธรรมเนียม COD (%)</Label>
                    <Switch checked={!!inputs.includeCodFee} onCheckedChange={value => handleInputChange('includeCodFee', value)} />
                  </div>
                  <Input id="codFeePercent" value={inputs.codFeePercent} onChange={event => handleInputChange('codFeePercent', event.target.value)} type="number" placeholder="เช่น 3" className="neumorphic-input" disabled={!inputs.includeCodFee} />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="extraHandlingCost" className="block text-sm mb-2 font-medium opacity-80">ค่าบรรจุ/จัดการ (฿)</Label>
                    <Switch checked={!!inputs.includeExtraHandling} onCheckedChange={value => handleInputChange('includeExtraHandling', value)} />
                  </div>
                  <Input id="extraHandlingCost" value={inputs.extraHandlingCost} onChange={event => handleInputChange('extraHandlingCost', event.target.value)} type="number" placeholder="เช่น 15" className="neumorphic-input" disabled={!inputs.includeExtraHandling} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="returnRatePercent" className="block text-sm mb-2 font-medium opacity-80">อัตรายกเลิก/ตีกลับ (%)</Label>
                    <Switch checked={!!inputs.includeReturnRate} onCheckedChange={value => handleInputChange('includeReturnRate', value)} />
                  </div>
                  <Input id="returnRatePercent" value={inputs.returnRatePercent} onChange={event => handleInputChange('returnRatePercent', event.target.value)} type="number" placeholder="เช่น 5" className="neumorphic-input" disabled={!inputs.includeReturnRate} />
                </div>
                <div>
                  <Label htmlFor="expectedConversionRate" className="block text-sm mb-2 font-medium opacity-80">Conversion Rate เป้าหมาย (%)</Label>
                  <Input id="expectedConversionRate" value={inputs.expectedConversionRate} onChange={event => handleInputChange('expectedConversionRate', event.target.value)} type="number" placeholder="เช่น 2.5" className="neumorphic-input" />
                  <p className="mt-1 text-xs text-muted-foreground">ใช้คำนวณ Max CPC ที่ยังไม่ขาดทุน</p>
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
                  <div className="rounded-2xl border bg-card/70 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">สถานะ ROAS ปัจจุบัน</p>
                        <p className="text-lg font-semibold text-foreground">{roasHealth.label}</p>
                        <p className="text-xs text-muted-foreground">{roasHealth.message}</p>
                      </div>
                      <Badge variant={roasHealth.badge}>{F.formatNumber(actualRoas, 2)}x</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">จุดคุ้มทุน {F.formatNumber(calculated.breakevenRoas, 2)}x</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="neumorphic-card p-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="opacity-80">กำไรขั้นต้น/หน่วย</span>
                        <span className="font-bold text-primary">{F.formatCurrency(calculated.grossProfitUnit)}</span>
                      </div>
                    </div>
                    <div className="neumorphic-card p-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="opacity-80">Break-even CPA</span>
                        <span className="font-bold text-primary">{F.formatCurrency(calculated.breakevenCpa)}</span>
                      </div>
                    </div>
                    <div className="neumorphic-card p-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="opacity-80">Break-even ROAS</span>
                        <span className="font-bold text-primary">{F.formatNumber(calculated.breakevenRoas, 2)}x</span>
                      </div>
                    </div>
                    <div className="neumorphic-card p-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="opacity-80">Max CPC ที่ไหว</span>
                        <span className="font-bold text-primary">{F.formatCurrency(calculated.maxCpc)}</span>
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
                        <span className="opacity-80">งบโฆษณา/เดือน</span>
                        <span className="font-bold text-primary">{F.formatCurrency(calculated.adBudget)}</span>
                      </div>
                    </div>
                    <div className="neumorphic-card p-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="opacity-80">กำไรคาดการณ์ 30 วัน</span>
                        <span className="font-bold text-primary">{F.formatCurrency(calculated.monthlyProfitProjection)}</span>
                      </div>
                    </div>
                    <div className="neumorphic-card p-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="opacity-80">ยอดขายจำลอง 30 วัน</span>
                        <span className="font-bold text-primary">{F.formatCurrency(calculated.monthlyRevenueProjection)}</span>
                      </div>
                    </div>
                    <div className="neumorphic-card p-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="opacity-80">ผลจากยอดยกเลิก</span>
                        <span className="font-bold text-primary">{F.formatCurrency(calculated.returnImpact)}</span>
                      </div>
                    </div>
                    <div className="neumorphic-card p-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="opacity-80">มูลค่า LTV ต่อออเดอร์</span>
                        <span className="font-bold text-primary">{F.formatCurrency(calculated.ltvContribution)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-muted/40 p-4 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">คิด LTV จากลูกค้าซื้อซ้ำ</p>
                        <p className="text-xs text-muted-foreground">เพิ่มกำไรต่อหัวเพื่อผ่อนจุดคุ้มทุน</p>
                      </div>
                      <Switch checked={!!inputs.includeLtv} onCheckedChange={value => handleInputChange('includeLtv', value)} />
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_160px]">
                      <Input
                        value={inputs.ltvPerCustomer}
                        onChange={event => handleInputChange('ltvPerCustomer', event.target.value)}
                        type="number"
                        placeholder="กำไรจากการซื้อซ้ำต่อหัว"
                        className="neumorphic-input"
                        disabled={!inputs.includeLtv}
                      />
                      <Button variant="outline" size="sm" onClick={() => setIsSimulatorOpen(true)} className="w-full">
                        <Gauge className="mr-2 h-4 w-4" /> เปิดตัวจำลอง What-if
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button type="button" onClick={handleConfirmPlan} className="neon-button w-full flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4" />
                      ยืนยันและดูผลลัพธ์สรุปทั้งหมด
                    </Button>
                    <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2" onClick={() => setIsSimulatorOpen(true)}>
                      <LineChart className="w-4 h-4" /> ทดลองตัวเลขเร็ว
                    </Button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="neumorphic-card p-6 mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-6 space-y-6">
            {mainTabGroups.map(group => (
              <section key={group.key} className="space-y-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.title}</p>
                    <p className="text-sm text-muted-foreground sm:text-xs">{group.description}</p>
                  </div>
                </div>
                <TabsList className="grid w-full gap-3 rounded-3xl border bg-card/70 p-3 shadow-sm md:grid-cols-2 xl:grid-cols-3">
                  {group.items.map(item => {
                    const Icon = item.icon;
                    return (
                      <TabsTrigger key={item.value} value={item.value} className={mainTabTriggerClass}>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="space-y-1">
                          <span className="block text-base font-semibold text-foreground">{item.label}</span>
                          <span className="block text-xs font-normal text-muted-foreground">{item.helper}</span>
                        </div>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </section>
            ))}
          </div>

          <TabsContent value="home">
            <div className="space-y-6">
              <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/20 via-background to-background p-6 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1 space-y-5">
                    <div className="flex items-start gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                        <Home className="h-6 w-6" />
                      </span>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">เริ่มต้นจัดการกำไรในที่เดียว</h2>
                        <p className="text-sm text-muted-foreground">ดูสถานะ ROAS, คำแนะนำหยุดยิง และกดไปยังหน้าที่ต้องการได้ทันที</p>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border bg-background/80 p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">สถานะ ROAS</p>
                        <p className="mt-2 text-xl font-bold text-foreground">{roasHealth.label}</p>
                        <p className="text-sm text-muted-foreground">{roasHealth.message}</p>
                        <div className="mt-4 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">ROAS ปัจจุบัน</span>
                          <Badge variant={roasHealth.badge}>{F.formatNumber(actualRoas, 2)}x</Badge>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">ROAS คุ้มทุน {F.formatNumber(calculated.breakevenRoas, 2)}x</p>
                      </div>
                      <div
                        className={cn(
                          'rounded-2xl border p-4 shadow-sm transition',
                          stopAlert.status === 'stop'
                            ? 'border-destructive/50 bg-destructive/10'
                            : stopAlert.status === 'warning'
                            ? 'border-amber-500/50 bg-amber-500/10'
                            : 'border-emerald-500/50 bg-emerald-500/10',
                        )}
                      >
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <AlertCircle
                            className={cn(
                              'h-5 w-5',
                              stopAlert.status === 'stop'
                                ? 'text-destructive'
                                : stopAlert.status === 'warning'
                                ? 'text-amber-500'
                                : 'text-emerald-500',
                            )}
                          />
                          <span>
                            {stopAlert.status === 'stop'
                              ? 'ควรหยุดยิงทันที'
                              : stopAlert.status === 'warning'
                              ? 'เริ่มเข้าโซนเสี่ยง'
                              : 'ยังปลอดภัย'}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-foreground">{stopAlert.message}</p>
                        {stopAlert.reasons.length > 0 && (
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                            {stopAlert.reasons.map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        )}
                        {stopAlert.spendLimit > 0 && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            งบเทสสูงสุด {F.formatCurrency(stopAlert.spendLimit)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={() => setActiveTab('planning')} className="neon-button flex items-center gap-2">
                        <GanttChartSquare className="h-4 w-4" />
                        เปิดตัวคำนวณ
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsSimulatorOpen(true)}
                        className="flex items-center gap-2"
                      >
                        <Gauge className="h-4 w-4" />
                        ทดลอง What-if
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleConfirmPlan}
                        className="flex items-center gap-2 text-primary"
                      >
                        <FileText className="h-4 w-4" />
                        ดูสรุปทันที
                      </Button>
                    </div>
                  </div>
                  <div className="w-full max-w-sm rounded-2xl border border-primary/30 bg-background/90 p-5 shadow-sm">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      ภาพรวมการยิงแอดทั้งหมด
                    </h3>
                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">ยอดใช้จ่ายรวม</span>
                        <span className="font-semibold text-foreground">{F.formatCurrency(adSummary.total.spend)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">ยอดขายรวม</span>
                        <span className="font-semibold text-foreground">{F.formatCurrency(adSummary.total.revenue)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">กำไร / ขาดทุน</span>
                        <span
                          className={cn(
                            'font-semibold',
                            adSummary.total.profit >= 0 ? 'text-emerald-500' : 'text-destructive',
                          )}
                        >
                          {F.formatCurrency(adSummary.total.profit)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">CPA ปัจจุบัน</span>
                        <span className="font-semibold text-foreground">{F.formatCurrency(totalAdCpa)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Margin</span>
                        <span className="font-semibold text-foreground">
                          {F.formatNumber(totalAdMargin * 100 || 0, 1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <SummaryStat
                  label="ROAS ปัจจุบัน"
                  value={`${F.formatNumber(actualRoas, 2)}x`}
                  helper={`ROAS คุ้มทุน ${F.formatNumber(calculated.breakevenRoas, 2)}x`}
                />
                <SummaryStat
                  label="Break-even ROAS"
                  value={`${F.formatNumber(calculated.breakevenRoas, 2)}x`}
                  helper="ROAS ขั้นต่ำที่ต้องได้เพื่อคุ้มทุน"
                />
                <SummaryStat
                  label="Break-even CPA"
                  value={F.formatCurrency(calculated.breakevenCpa)}
                  helper="ค่าแอดสูงสุดต่อ 1 ออเดอร์"
                />
                <SummaryStat
                  label="Max CPC ที่ไหว"
                  value={F.formatCurrency(calculated.maxCpc)}
                  helper={`ตาม CVR ปัจจุบัน ${F.formatNumber(calculated.expectedConversionRate, 1)}%`}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    เครื่องมือหลัก
                  </h3>
                  <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {quickNavigationSections.primary.map(section => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.key}
                          type="button"
                          onClick={() => setActiveTab(section.key)}
                          className="group h-full text-left"
                        >
                          <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card/80 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                  <Icon className="h-5 w-5" />
                                </span>
                                <span
                                  className={cn(
                                    'rounded-full px-3 py-1 text-xs font-medium',
                                    quickStatusToneClass[section.status.tone],
                                  )}
                                >
                                  {section.status.label}
                                </span>
                              </div>
                              <div>
                                <p className="text-base font-semibold text-foreground">{section.title}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary transition group-hover:gap-3">
                              ไปยังหน้าถัดไป
                              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    เครื่องมือเสริม
                  </h3>
                  <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {quickNavigationSections.tools.map(section => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.key}
                          type="button"
                          onClick={() => setActiveTab(section.key)}
                          className="group h-full text-left"
                        >
                          <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card/70 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
                                  <Icon className="h-5 w-5" />
                                </span>
                                <span
                                  className={cn(
                                    'rounded-full px-3 py-1 text-xs font-medium',
                                    quickStatusToneClass[section.status.tone],
                                  )}
                                >
                                  {section.status.label}
                                </span>
                              </div>
                              <div>
                                <p className="text-base font-semibold text-foreground">{section.title}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                              </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary transition group-hover:gap-3">
                              ไปยังหน้าถัดไป
                              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Card className="neumorphic-card">
                <CardHeader className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">แผนล่าสุดที่บันทึกไว้</CardTitle>
                    <CardDescription>เรียกใช้แผนเดิมหรือดูประวัติทั้งหมดได้จากตรงนี้</CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setActiveTab('history')}>
                    ดูทั้งหมด
                  </Button>
                </CardHeader>
                <CardContent>
                  {history.length > 0 ? (
                    <div className="space-y-3">
                      {history.slice(0, 3).map(item => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-2 rounded-2xl border border-border bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="text-sm font-semibold text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.id).toLocaleString('th-TH')}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" className="neon-button" onClick={() => loadHistory(item.id)}>
                              โหลดแผนนี้
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setActiveTab('summary')}
                            >
                              ดูสรุป
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      ยังไม่มีการบันทึกแผน ลองกด “บันทึกแผน” จากเมนูด้านล่างเพื่อเริ่มต้น
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>


          <TabsContent value="ad-launch">
            <div className="space-y-6">
              <Card className="neumorphic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-primary" />
                    สร้างแคมเปญยิงแอดหลายแพลตฟอร์ม
                  </CardTitle>
                  <CardDescription>
                    ตั้งค่ากลางและจำลอง payload สำหรับเชื่อม API ของ Facebook, TikTok, Google และ Lazada ก่อนลงมือจริง
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Label htmlFor="launch-campaign-name" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            ชื่อแคมเปญหลัก
                          </Label>
                          <Input
                            id="launch-campaign-name"
                            value={adLaunchForm.campaignName}
                            onChange={event => handleAdLaunchFormChange('campaignName', event.target.value)}
                            placeholder="Q4 Mega Sale - Meta + TikTok"
                            className="neumorphic-input mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="launch-objective" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Objective หลัก
                          </Label>
                          <Select value={adLaunchForm.objective} onValueChange={value => handleAdLaunchFormChange('objective', value)}>
                            <SelectTrigger id="launch-objective" className="neumorphic-select mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {adObjectives.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="launch-optimization" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Optimization Event
                          </Label>
                          <Select value={adLaunchForm.optimizationEvent} onValueChange={value => handleAdLaunchFormChange('optimizationEvent', value)}>
                            <SelectTrigger id="launch-optimization" className="neumorphic-select mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {optimizationEvents.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="launch-angle" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            แนวคิดครีเอทีฟ
                          </Label>
                          <Select value={adLaunchForm.creativeAngle} onValueChange={value => handleAdLaunchFormChange('creativeAngle', value)}>
                            <SelectTrigger id="launch-angle" className="neumorphic-select mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {creativeAngles.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="launch-landing" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Landing URL
                          </Label>
                          <Input
                            id="launch-landing"
                            value={adLaunchForm.landingUrl}
                            onChange={event => handleAdLaunchFormChange('landingUrl', event.target.value)}
                            placeholder="https://yourstore.co/promotion"
                            className="neumorphic-input mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="launch-tracking" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Tracking Pixel สำรอง
                          </Label>
                          <Input
                            id="launch-tracking"
                            value={adLaunchForm.trackingPixels}
                            onChange={event => handleAdLaunchFormChange('trackingPixels', event.target.value)}
                            placeholder="ระบุ Pixel ID / Measurement ID ที่ใช้ซ้ำ"
                            className="neumorphic-input mt-1"
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="launch-start" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            วันที่เริ่มแคมเปญ
                          </Label>
                          <Input
                            id="launch-start"
                            type="date"
                            value={adLaunchForm.startDate}
                            onChange={event => handleAdLaunchFormChange('startDate', event.target.value)}
                            className="neumorphic-input mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="launch-end" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            วันที่สิ้นสุด (ถ้ามี)
                          </Label>
                          <Input
                            id="launch-end"
                            type="date"
                            value={adLaunchForm.endDate}
                            onChange={event => handleAdLaunchFormChange('endDate', event.target.value)}
                            className="neumorphic-input mt-1"
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">กลุ่มเป้าหมายหลัก</Label>
                          <textarea
                            className="neumorphic-input mt-1 min-h-[96px] resize-y"
                            value={adLaunchForm.audienceNotes}
                            onChange={event => handleAdLaunchFormChange('audienceNotes', event.target.value)}
                            placeholder="เช่น Remarketing 30 วัน + Lookalike 3%"
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">ข้อความหลัก (Primary Text)</Label>
                          <textarea
                            className="neumorphic-input mt-1 min-h-[96px] resize-y"
                            value={adLaunchForm.creativeMessage}
                            onChange={event => handleAdLaunchFormChange('creativeMessage', event.target.value)}
                            placeholder="เล่า offer, โปรโมชั่น, จุดเด่นที่ต้องการสื่อ"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Hook / สิ่งที่ต้องการให้ลูกค้าจำ</Label>
                        <textarea
                          className="neumorphic-input mt-1 min-h-[72px] resize-y"
                          value={adLaunchForm.creativeHook}
                          onChange={event => handleAdLaunchFormChange('creativeHook', event.target.value)}
                          placeholder="เช่น ส่งฟรีภายใน 24 ชม. + รีวิวจริง 5 ดาว"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">บันทึกสำหรับทีมยิงแอด</Label>
                        <textarea
                          className="neumorphic-input mt-1 min-h-[60px] resize-y"
                          value={adLaunchForm.launchNotes}
                          onChange={event => handleAdLaunchFormChange('launchNotes', event.target.value)}
                          placeholder="กำกับงาน, KPI เพิ่มเติม หรือสิ่งที่ต้องตรวจซ้ำ"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="launch-budget" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          งบรวมต่อวัน (บาท)
                        </Label>
                        <Input
                          id="launch-budget"
                          type="number"
                          min="0"
                          value={adLaunchForm.totalDailyBudget}
                          onChange={event => handleAdLaunchFormChange('totalDailyBudget', event.target.value)}
                          className="neumorphic-input mt-1"
                        />
                        <div className="mt-3 flex items-center justify-between rounded-2xl border bg-background/60 p-3">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Auto split งบตามสัดส่วนแนะนำ</p>
                            <p className="text-xs text-muted-foreground">ระบบจะเฉลี่ยให้อัตโนมัติหากเปิดใช้งาน</p>
                          </div>
                          <Switch checked={autoSplitBudget} onCheckedChange={toggleAutoSplit} />
                        </div>
                      </div>
                      <div className="grid gap-3">
                        <ReportMetric
                          label="แพลตฟอร์มที่เลือก"
                          value={`${selectedPlatforms.length.toLocaleString('th-TH')} ช่องทาง`}
                          helper={selectedPlatformDetails.length ? selectedPlatformDetails.map(platform => platform.name).join(' • ') : 'ยังไม่ได้เลือกแพลตฟอร์ม'}
                        />
                        <ReportMetric
                          label="งบที่กระจายแล้ว"
                          value={F.formatCurrency(platformBudgetTotal)}
                          helper={budgetDiffAlert ? `ต่างจากงบรวม ${F.formatCurrency(totalBudgetDiff)}` : 'เท่ากับงบรวมเรียบร้อย'}
                        />
                        <ReportMetric
                          label="Auto Sync ที่เปิดอยู่"
                          value={`${autoSyncEnabledCount.toLocaleString('th-TH')} ช่องทาง`}
                          helper={`เชื่อมต่อพร้อมทดสอบแล้ว ${connectedPlatformCount.toLocaleString('th-TH')} ช่องทาง`}
                        />
                      </div>
                      {(missingCredentials.length > 0 || zeroBudgetPlatforms.length > 0 || budgetDiffAlert) && (
                        <div className="rounded-2xl border border-dashed border-destructive/60 bg-destructive/10 p-3 text-xs text-destructive space-y-1">
                          {missingCredentials.length > 0 && <p>เติมข้อมูล API สำหรับ: {missingCredentialNames}</p>}
                          {zeroBudgetPlatforms.length > 0 && <p>ตั้งงบแพลตฟอร์ม: {zeroBudgetNames}</p>}
                          {budgetDiffAlert && <p>ปรับให้งบรวมตรงกับงบย่อย (ต่างกัน {F.formatCurrency(totalBudgetDiff)})</p>}
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-3">
                        <Button onClick={handleQueueLaunch} disabled={!launchReady} className="flex items-center gap-2">
                          <Plug className="h-4 w-4" />
                          จำลองยิงผ่าน API
                        </Button>
                        <Button variant="outline" onClick={handleCopyLaunchPayload} className="flex items-center gap-2">
                          <ClipboardCopy className="h-4 w-4" />
                          คัดลอก Payload
                        </Button>
                      </div>
                      {!launchReady && (
                        <p className="text-xs text-muted-foreground">
                          ตรวจสอบให้กรอกข้อมูลครบทุกแพลตฟอร์มก่อนจำลองยิง (ต้องมีชื่อแคมเปญ, URL และงบมากกว่า 0)
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 xl:grid-cols-[1.7fr,1fr]">
                <Card className="neumorphic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MousePointerClick className="h-5 w-5 text-primary" />
                      เลือกแพลตฟอร์ม &amp; กรอก API Credentials
                    </CardTitle>
                    <CardDescription>เปิด/ปิดช่องทาง และตั้งค่า token ที่ต้องใช้ยิงโฆษณาอัตโนมัติ</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {multiChannelPlatforms.map(platform => {
                      const selected = selectedPlatforms.includes(platform.key);
                      const integration = platformIntegrations[platform.key];
                      const Icon = platform.icon;

                      return (
                        <div key={platform.key} className="rounded-2xl border bg-background/60 p-4 space-y-4 shadow-sm">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id={`platform-${platform.key}`}
                                checked={selected}
                                onCheckedChange={checked => handlePlatformSelection(platform.key, Boolean(checked))}
                              />
                              <div>
                                <p className="flex items-center gap-2 font-semibold text-foreground">
                                  <Icon className={cn('h-5 w-5', platform.accent)} />
                                  {platform.name}
                                </p>
                                <p className="text-xs text-muted-foreground">{platform.description}</p>
                              </div>
                            </div>
                            <Badge variant={integrationStatusVariants[integration.status]} className="w-fit">
                              {integrationStatusLabels[integration.status]}
                            </Badge>
                          </div>

                          <div className="grid gap-4 md:grid-cols-3">
                            <div>
                              <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">งบต่อวัน</Label>
                              <Input
                                type="number"
                                min="0"
                                value={platformBudgets[platform.key] ?? '0'}
                                onChange={event => handlePlatformBudgetChange(platform.key, event.target.value)}
                                className="neumorphic-input mt-1"
                                disabled={!selected || autoSplitBudget}
                              />
                            </div>
                            <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
                              <div>
                                <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Account / Customer ID</Label>
                                <Input
                                  value={integration.accountId}
                                  onChange={event => updatePlatformIntegration(platform.key, current => ({
                                    ...current,
                                    accountId: event.target.value,
                                  }))}
                                  placeholder="act_123... / 123-456-7890"
                                  className="neumorphic-input mt-1"
                                  disabled={!selected}
                                />
                              </div>
                              <div>
                                <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Access Token / API Key</Label>
                                <Input
                                  value={integration.accessToken}
                                  onChange={event => updatePlatformIntegration(platform.key, current => ({
                                    ...current,
                                    accessToken: event.target.value,
                                  }))}
                                  placeholder="วาง Access Token หรือ API Key"
                                  className="neumorphic-input mt-1"
                                  disabled={!selected}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-3">
                            <div>
                              <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pixel / Tracking ID</Label>
                              <Input
                                value={integration.pixelId}
                                onChange={event => updatePlatformIntegration(platform.key, current => ({
                                  ...current,
                                  pixelId: event.target.value,
                                }))}
                                placeholder="ใส่ Pixel / Measurement ID (ถ้ามี)"
                                className="neumorphic-input mt-1"
                                disabled={!selected}
                              />
                            </div>
                            <div className="md:col-span-2 flex items-center justify-between rounded-2xl border bg-background/50 p-3">
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Auto Sync</p>
                                <p className="text-xs text-muted-foreground">เปิดเพื่อให้ระบบยิงแอดซ้ำอัตโนมัติทุกวัน</p>
                              </div>
                              <Switch
                                checked={integration.autoSync}
                                onCheckedChange={checked => updatePlatformIntegration(platform.key, current => ({
                                  ...current,
                                  autoSync: Boolean(checked),
                                }))}
                                disabled={!selected}
                              />
                            </div>
                          </div>

                          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-end">
                            <div>
                              <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">บันทึกเพิ่มเติม</Label>
                              <textarea
                                className="neumorphic-input mt-1 min-h-[60px] resize-y"
                                value={integration.notes}
                                onChange={event => updatePlatformIntegration(platform.key, current => ({
                                  ...current,
                                  notes: event.target.value,
                                }))}
                                placeholder={platform.defaultNotes}
                                disabled={!selected}
                              />
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleTestConnection(platform.key)}
                              className="flex items-center gap-2"
                              disabled={!selected}
                            >
                              <Plug className="h-3 w-3" />
                              ทดสอบเชื่อมต่อ
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleResetIntegration(platform.key)}
                              className="flex items-center gap-2"
                            >
                              <RotateCcw className="h-3 w-3" />
                              รีเซ็ต
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">อัปเดตล่าสุด: {formatSyncTimestamp(integration.lastSyncedAt)}</p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="neumorphic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LayoutDashboard className="h-5 w-5 text-primary" />
                      ภาพรวมการเชื่อมต่อ API
                    </CardTitle>
                    <CardDescription>สรุปความพร้อมก่อนส่ง payload เข้าระบบจริง</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      <ReportMetric
                        label="แพลตฟอร์มพร้อมยิง"
                        value={`${connectedPlatformCount.toLocaleString('th-TH')} / ${selectedPlatforms.length.toLocaleString('th-TH')}`}
                        helper="ทดสอบเชื่อมต่อแล้ว (สถานะ Connected)"
                      />
                      <ReportMetric
                        label="Auto Sync ที่เปิดอยู่"
                        value={`${autoSyncEnabledCount.toLocaleString('th-TH')} ช่องทาง`}
                        helper="ระบบจะยิงซ้ำให้อัตโนมัติ"
                      />
                      <ReportMetric
                        label="งบรวมตั้งต้น"
                        value={F.formatCurrency(F.num(adLaunchForm.totalDailyBudget))}
                        helper={`งบที่แจกจ่ายแล้ว ${F.formatCurrency(platformBudgetTotal)}`}
                      />
                    </div>
                    <div className="rounded-2xl border bg-background/60 p-4 text-xs text-muted-foreground space-y-2">
                      <p className="font-medium text-foreground">Checklist ก่อนเชื่อมต่อจริง</p>
                      <ul className="list-disc space-y-1 pl-4">
                        <li>ตรวจว่า Access Token / API Key ยังไม่หมดอายุ</li>
                        <li>ยืนยันสิทธิ์ของบัญชีโฆษณาในแต่ละแพลตฟอร์ม</li>
                        <li>นำ Payload ที่คัดลอกไปทดสอบผ่าน Postman หรือ Workflow (NSN / N&amp;N) ได้ทันที</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="neumorphic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSliders className="h-5 w-5 text-primary" />
                    API Payload Preview &amp; Log
                  </CardTitle>
                  <CardDescription>สำรวจข้อมูลที่จะส่งไปยัง API ของแต่ละแพลตฟอร์ม (จำลอง)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge variant="secondary">Objective: {adObjectives.find(item => item.value === adLaunchForm.objective)?.label || adLaunchForm.objective}</Badge>
                    <Badge variant="secondary">Optimization: {optimizationEvents.find(item => item.value === adLaunchForm.optimizationEvent)?.label || adLaunchForm.optimizationEvent}</Badge>
                    <Badge variant={launchReady ? 'default' : 'outline'}>
                      {launchReady ? 'พร้อมจำลองยิงแล้ว' : 'ข้อมูลยังไม่ครบ'}
                    </Badge>
                  </div>
                  <div className="rounded-2xl border bg-background/70 p-4 text-xs">
                    <pre className="max-h-80 overflow-auto whitespace-pre-wrap text-left">{prettyLaunchPreview}</pre>
                  </div>
                  {lastLaunchSummary && (
                    <div className="rounded-2xl border border-dashed bg-background/40 p-4 text-xs space-y-2">
                      <p className="font-medium text-foreground">จำลองยิงล่าสุด: {lastLaunchTimeFormatted || '—'}</p>
                      <pre className="max-h-48 overflow-auto whitespace-pre-wrap text-left">{lastLaunchPayload}</pre>
                    </div>
                  )}
                  {!lastLaunchSummary && (
                    <p className="text-xs text-muted-foreground">ยังไม่เคยจำลองยิง API — กดปุ่ม "จำลองยิงผ่าน API" เพื่อสร้างบันทึกล่าสุด</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="platform-report">
            <div className="space-y-6">
              <Card className="neumorphic-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-primary"/>สรุปภาพรวมทุกแพลตฟอร์ม</CardTitle>
                  <CardDescription>รวมยอดสำคัญจากแพลตฟอร์มทั้งหมดที่ตั้งค่าไว้ในระบบ</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <ReportMetric label="ยอดขายรวมต่อเดือน" value={F.formatCurrency(platformReportTotals.totalRevenue)} helper="รวมรายได้เป้าหมายจากทุกแพลตฟอร์ม" />
                    <ReportMetric label="งบโฆษณารวมต่อเดือน" value={F.formatCurrency(platformReportTotals.totalAdBudget)} helper="คำนวณรวมทุกแพลตฟอร์ม" />
                    <ReportMetric label="จำนวนออเดอร์รวมต่อเดือน" value={F.formatInt(platformReportTotals.totalOrders)} helper={`เฉลี่ย ${F.formatNumber(platformReportTotals.totalOrders / 30 || 0, 1)} ออเดอร์/วัน`} />
                    <ReportMetric label="กำไรสุทธิต่อหน่วย (เฉลี่ย)" value={F.formatCurrency(platformReportTotals.averageNetProfitUnit)} helper="ค่าเฉลี่ยกำไรสุทธิต่อหน่วยของทุกแพลตฟอร์ม" />
                  </div>
                </CardContent>
              </Card>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {platformReport.map((platform) => (
                  <Card key={platform.key} className="neumorphic-card">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{platform.name}</span>
                        <Badge variant="outline" className="uppercase tracking-wide">{platform.key}</Badge>
                      </CardTitle>
                      <CardDescription>
                        ค่าธรรมเนียมแพลตฟอร์ม {platform.fees.platform}% | ค่าชำระเงิน {platform.fees.payment}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ReportMetric label="ราคาขาย (ไม่รวม VAT)" value={F.formatCurrency(platform.metrics.priceBeforeVat)} helper={`รวม VAT: ${F.formatCurrency(inputs.sellingPrice)}`} />
                        <ReportMetric label="กำไรขั้นต้นต่อหน่วย" value={F.formatCurrency(platform.metrics.grossProfitUnit)} />
                        <ReportMetric label="กำไรสุทธิต่อหน่วย" value={F.formatCurrency(platform.metrics.netProfitUnit)} />
                        <ReportMetric label="ROAS เป้าหมาย" value={F.formatNumber(platform.metrics.targetRoas)} helper={`ROAS คุ้มทุน ${F.formatNumber(platform.metrics.breakevenRoas)}`} />
                        <ReportMetric label="CPA เป้าหมาย" value={F.formatCurrency(platform.metrics.targetCpa)} helper={`CPA คุ้มทุน ${F.formatCurrency(platform.metrics.breakevenCpa)}`} />
                        <ReportMetric label="งบโฆษณา/เดือน" value={F.formatCurrency(platform.metrics.adBudget)} helper={`รวม VAT: ${F.formatCurrency(platform.metrics.adBudgetWithVat)}`} />
                        <ReportMetric label="ยอดขายเป้าหมาย/เดือน" value={F.formatCurrency(platform.metrics.targetRevenue)} helper={`จำนวนออเดอร์ ${F.formatInt(platform.metrics.targetOrders)}`} />
                        <ReportMetric label="งบ TOFU / เดือน" value={F.formatCurrency(platform.metrics.tofuBudget)} helper={`เฉลี่ยบัญชีละ ${F.formatCurrency(platform.metrics.tofuBudgetPerAccountMonthly)}`} />
                        <ReportMetric label="งบ MOFU / เดือน" value={F.formatCurrency(platform.metrics.mofuBudget)} helper={`เฉลี่ยบัญชีละ ${F.formatCurrency(platform.metrics.mofuBudgetPerAccountMonthly)}`} />
                        <ReportMetric label="งบ BOFU / เดือน" value={F.formatCurrency(platform.metrics.bofuBudget)} helper={`เฉลี่ยบัญชีละ ${F.formatCurrency(platform.metrics.bofuBudgetPerAccountMonthly)}`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <div ref={summaryRef} className="space-y-6">
              <Tabs value={summarySection} onValueChange={setSummarySection} className="w-full">
                <TabsList className="grid grid-cols-2 gap-2 rounded-2xl border bg-card/60 p-2 md:grid-cols-4">
                  {summaryTabsConfig.map(section => {
                    const Icon = section.icon;
                    return (
                      <TabsTrigger key={section.value} value={section.value} className={summaryTabTriggerClass}>
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-semibold text-foreground md:text-base">{section.label}</span>
                        </div>
                        <p className="text-xs font-normal text-muted-foreground md:text-sm">{section.helper}</p>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6">
                  <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="neumorphic-card lg:col-span-3">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Info className="h-6 w-6 text-primary" /> ภาพรวมแผน
                        </CardTitle>
                        <CardDescription>สรุปข้อมูลหลักและเป้าหมายของแผนที่คุณวางไว้</CardDescription>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="flex items-center gap-4 rounded-lg bg-background/50 p-4">
                          <Briefcase className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">สินค้า/ธุรกิจ</p>
                            <p className="font-bold">{inputs.productName || 'N/A'}</p>
                            <p className="text-xs text-muted-foreground">{funnelObjectivesData[inputs.businessType]?.name || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg bg-background/50 p-4">
                          <Target className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">เป้าหมายกำไร</p>
                            <p className="font-bold">{F.formatCurrency(inputs.profitGoal)}</p>
                            <p className="text-xs text-muted-foreground">{inputs.profitGoalTimeframe === 'monthly' ? 'ต่อเดือน' : 'ต่อวัน'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg bg-background/50 p-4">
                          <Scaling className="h-8 w-8 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">ค่าใช้จ่ายคงที่</p>
                            <p className="font-bold">{F.formatCurrency(inputs.fixedCosts)}</p>
                            <p className="text-xs text-muted-foreground">ต่อเดือน</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 lg:col-span-3">
                      <SummaryStat label="ROAS ปัจจุบัน" value={`${F.formatNumber(actualRoas, 2)}x`} helper={`ROAS คุ้มทุน ${F.formatNumber(calculated.breakevenRoas, 2)}x`} />
                      <SummaryStat label="Break-even ROAS" value={`${F.formatNumber(calculated.breakevenRoas, 2)}x`} helper="ROAS ขั้นต่ำที่ต้องได้เพื่อคุ้มทุน" />
                      <SummaryStat label="Break-even CPA" value={F.formatCurrency(calculated.breakevenCpa)} helper="ค่าแอดสูงสุดต่อ 1 ออเดอร์" />
                      <SummaryStat label="Max CPC ที่ไหว" value={F.formatCurrency(calculated.maxCpc)} helper={`ตาม CVR ปัจจุบัน ${F.formatNumber(calculated.expectedConversionRate || inputs.expectedConversionRate, 1)}%`} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="profitability" className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <SummaryInfoCard title="ราคาขาย (ต่อหน่วย)" value={F.formatCurrency(calculated.priceBeforeVat)} subValue={`รวม VAT: ${F.formatCurrency(inputs.sellingPrice)}`} icon={DollarSign} />
                    <SummaryInfoCard title="กำไรขั้นต้น (ต่อหน่วย)" value={F.formatCurrency(calculated.grossProfitUnit)} subValue="ราคาขาย(ไม่รวม VAT) - ต้นทุนแปรผันทั้งหมด" icon={BarChart} />
                    <SummaryInfoCard title="กำไรสุทธิ (ต่อหน่วย)" value={F.formatCurrency(calculated.netProfitUnit)} subValue="กำไรขั้นต้น - ค่าโฆษณาต่อหน่วย (CPA)" icon={LineChart} />
                    <SummaryInfoCard title="Target CPA" value={F.formatCurrency(calculated.targetCpa)} subValue="Target CPA ที่คำนวณได้" icon={Megaphone} />
                    <SummaryInfoCard title="Break-even ROAS" value={`${F.formatNumber(calculated.breakevenRoas, 2)}x`} subValue={`CPA คุ้มทุน ${F.formatCurrency(calculated.breakevenCpa)}`} icon={Gauge} />
                    <SummaryInfoCard title="Max CPC" value={F.formatCurrency(calculated.maxCpc)} subValue={`Conversion เป้าหมาย ${F.formatNumber(inputs.expectedConversionRate, 2)}%`} icon={MousePointerClick} />
                  </div>
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-lg font-bold">
                      <Target className="h-5 w-5 text-primary" /> ตัวชี้วัด (KPIs)
                    </h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="neumorphic-card border-red-500/50 bg-red-900/20 p-4 text-center">
                        <p className="font-bold text-red-400">BE ROAS</p>
                        <p className="text-2xl font-bold text-red-400">{F.formatNumber(calculated.breakevenRoas)}</p>
                        <p className="text-xs text-red-200/70">ROAS คุ้มทุน</p>
                      </div>
                      <div className="neumorphic-card border-red-500/50 bg-red-900/20 p-4 text-center">
                        <p className="font-bold text-red-400">BE CPA</p>
                        <p className="text-2xl font-bold text-red-400">{F.formatCurrency(calculated.breakevenCpa)}</p>
                        <p className="text-xs text-red-200/70">CPA คุ้มทุน</p>
                      </div>
                      <div className="neumorphic-card border-green-500/50 bg-green-900/20 p-4 text-center">
                        <p className="font-bold text-green-400">Target ROAS</p>
                        <p className="text-2xl font-bold text-green-400">{F.formatNumber(calculated.targetRoas)}</p>
                        <p className="text-xs text-green-200/70">ROAS เป้าหมาย</p>
                      </div>
                      <div className="neumorphic-card border-green-500/50 bg-green-900/20 p-4 text-center">
                        <p className="font-bold text-green-400">Target CPA</p>
                        <p className="text-2xl font-bold text-green-400">{F.formatCurrency(calculated.targetCpa)}</p>
                        <p className="text-xs text-green-200/70">CPA เป้าหมาย</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="budget" className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <SummaryInfoCard title="ยอดขายเป้าหมาย (ต่อเดือน)" value={F.formatCurrency(calculated.targetRevenue)} subValue="ตั้งจากเป้ากำไรที่ระบุ" icon={Users} />
                    <SummaryInfoCard title="จำนวนออเดอร์ (ต่อเดือน)" value={F.formatInt(calculated.targetOrders)} subValue={`เฉลี่ย ${F.formatNumber(calculated.targetOrdersDaily, 1)} ออเดอร์/วัน`} icon={ThumbsUp} />
                    <SummaryInfoCard title="งบโฆษณารวม (ต่อเดือน)" value={F.formatCurrency(calculated.adBudget)} subValue="ไม่รวม VAT" icon={Percent} />
                    <SummaryInfoCard title="งบโฆษณา + VAT" value={F.formatCurrency(calculated.adBudgetWithVat)} subValue={`VAT ${inputs.vatProduct}%`} icon={Hash} />
                    <SummaryInfoCard title="ยอดขายจำลอง 30 วัน" value={F.formatCurrency(calculated.monthlyRevenueProjection)} subValue="ประเมินจาก Conversion และงบปัจจุบัน" icon={BarChart} />
                    <SummaryInfoCard title="กำไรจำลอง 30 วัน" value={F.formatCurrency(calculated.monthlyProfitProjection)} subValue="ใช้ตัวเลขจำลองในแผนล่าสุด" icon={TrendingUp} />
                    <SummaryInfoCard title="ผลกระทบจากออเดอร์ยกเลิก" value={F.formatCurrency(calculated.returnImpact)} subValue={`อัตรายกเลิก ${F.formatNumber(calculated.expectedReturnRate, 1)}%`} icon={AlertTriangle} />
                    <SummaryInfoCard title="LTV ต่อออเดอร์" value={F.formatCurrency(calculated.ltvContribution)} subValue="ค่าที่เพิ่มจากลูกค้าซื้อซ้ำ" icon={Heart} />
                  </div>
                  <div className="rounded-2xl border bg-muted/40 p-4 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">คิด LTV จากลูกค้าซื้อซ้ำ</p>
                        <p className="text-xs text-muted-foreground">เพิ่มกำไรต่อหัวเพื่อผ่อนจุดคุ้มทุน</p>
                      </div>
                      <Switch checked={!!inputs.includeLtv} onCheckedChange={value => handleInputChange('includeLtv', value)} />
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_160px]">
                      <Input
                        value={inputs.ltvPerCustomer}
                        onChange={event => handleInputChange('ltvPerCustomer', event.target.value)}
                        type="number"
                        placeholder="กำไรจากการซื้อซ้ำต่อหัว"
                        className="neumorphic-input"
                        disabled={!inputs.includeLtv}
                      />
                      <Button variant="outline" size="sm" onClick={() => setIsSimulatorOpen(true)} className="w-full">
                        <Gauge className="mr-2 h-4 w-4" /> เปิดตัวจำลอง What-if
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button type="button" onClick={handleConfirmPlan} className="neon-button flex w-full items-center justify-center gap-2">
                      <FileText className="h-4 w-4" />
                      ยืนยันและดูผลลัพธ์สรุปทั้งหมด
                    </Button>
                    <Button type="button" variant="outline" className="flex w-full items-center justify-center gap-2" onClick={() => setIsSimulatorOpen(true)}>
                      <LineChart className="h-4 w-4" /> ทดลองตัวเลขเร็ว
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="advisor" className="mt-6 space-y-6">
                  <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                    <StopAlertCard />
                    <Card className="neumorphic-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BrainCircuit className="h-6 w-6 text-primary" /> AI Advisor
                        </CardTitle>
                        <CardDescription>รับคำแนะนำและข้อมูลเชิงลึกจาก AI เพื่อปรับปรุงแผนของคุณ</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button onClick={fetchAiAdvice} disabled={aiAdvice.loading} className="w-full neon-button">
                          {aiAdvice.loading ? 'กำลังวิเคราะห์...' : 'ขอคำแนะนำจาก AI'}
                        </Button>
                        {aiAdvice.loading && <Progress value={50} className="mt-4 w-full" />}
                        {!aiAdvice.loading && (aiAdvice.recommendations || aiAdvice.insights) && (
                          <div className="mt-4 space-y-4 text-sm">
                            {aiAdvice.recommendations && (
                              <div>
                                <h4 className="mb-2 font-bold">คำแนะนำ (Recommendations):</h4>
                                <p className="whitespace-pre-wrap rounded-lg bg-background/50 p-4">{aiAdvice.recommendations}</p>
                              </div>
                            )}
                            {aiAdvice.insights && (
                              <div>
                                <h4 className="mb-2 font-bold">ข้อมูลเชิงลึก (Insights):</h4>
                                <p className="whitespace-pre-wrap rounded-lg bg-background/50 p-4">{aiAdvice.insights}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <div className="rounded-2xl border bg-card/70 p-4 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">เคล็ดลับ</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4">
                      <li>ตั้งค่าการเตือนให้ตรงกับความเสี่ยงของสินค้าแต่ละตัว</li>
                      <li>หลังเชื่อม API แล้ว ระบบจะดึง ROAS จริงมาประเมินอัตโนมัติ</li>
                      <li>บันทึกแผนเพื่อเก็บผลการปรับปรุงในแต่ละเดือน</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
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
                  <ProFunnel
                    labels={funnelLabels}
                  />
                </div>
                 <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Funnel</TableHead>
                          <TableHead className="text-right">เปอร์เซ็นต์</TableHead>
                          <TableHead className="text-right">งบประมาณ/เดือน</TableHead>
                          <TableHead className="text-right">งบประมาณ/วัน</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-bold">TOFU</TableCell>
                          <TableCell className="text-right">{currentFunnelPlan.tofu}%</TableCell>
                          <TableCell className="text-right">{F.formatCurrency(calculated.tofuBudgetPerAccountMonthly)}</TableCell>
                          <TableCell className="text-right">{F.formatCurrency(calculated.tofuBudgetPerAccountDaily)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold">MOFU</TableCell>
                          <TableCell className="text-right">{currentFunnelPlan.mofu}%</TableCell>
                          <TableCell className="text-right">{F.formatCurrency(calculated.mofuBudgetPerAccountMonthly)}</TableCell>
                          <TableCell className="text-right">{F.formatCurrency(calculated.mofuBudgetPerAccountDaily)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-bold">BOFU</TableCell>
                          <TableCell className="text-right">{currentFunnelPlan.bofu}%</TableCell>
                           <TableCell className="text-right">{F.formatCurrency(calculated.bofuBudgetPerAccountMonthly)}</TableCell>
                          <TableCell className="text-right">{F.formatCurrency(calculated.bofuBudgetPerAccountDaily)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
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
                  <h5 className="font-bold mb-3" style={{ color: "#2FA4FF" }}>TOFU (Top of Funnel)</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                    {funnelObjectives.tofu.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold mb-3" style={{ color: "#22C7C1" }}>MOFU (Middle of Funnel)</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                    {funnelObjectives.mofu.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold mb-3" style={{ color: "#1D8C91" }}>BOFU (Bottom of Funnel)</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                    {funnelObjectives.bofu.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="automation">
            <AutomationRuleBuilder />
          </TabsContent>
           <TabsContent value="workflow">
             <div className="neumorphic-card mt-6 p-6">
                  <h3 className="text-xl font-bold mb-4 gradient-text">n8n Workflow Generator</h3>
                  <p className="text-sm opacity-80 mb-6">สร้าง Workflow JSON สำหรับ n8n โดยอัตโนมัติตามกฎที่คุณสร้างไว้</p>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="n8nWorkflowName" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        ชื่อ Workflow
                      </Label>
                      <Input
                        id="n8nWorkflowName"
                        value={n8nWorkflowName}
                        onChange={event => setN8nWorkflowName(event.target.value)}
                        placeholder="ชื่อ Workflow (เช่น 'Profit Pilot Automation')"
                        className="neumorphic-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="n8nPrimaryGoal" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        เป้าหมายหลักของ Automation
                      </Label>
                      <Input
                        id="n8nPrimaryGoal"
                        value={n8nPrimaryGoal}
                        onChange={event => setN8nPrimaryGoal(event.target.value)}
                        placeholder="เป้าหมายหลัก (เช่น 'Scale Revenue & Optimize CPA')"
                        className="neumorphic-input"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleGenerateN8nWorkflow} className="neon-button w-full" disabled={n8nWorkflow.loading || automationRules.length === 0}>
                    {n8nWorkflow.loading ? "กำลังสร้าง..." : (automationRules.length === 0 ? "โปรดสร้าง Rule ก่อน" : "สร้าง n8n Workflow JSON")}
                  </Button>

                  {n8nWorkflow.loading && <Progress value={50} className="w-full mt-4" />}
                  
                  {n8nWorkflow.json && (
                    <div className="mt-6 relative">
                      <h4 className="font-bold mb-2">Generated Workflow JSON</h4>
                       <div className="p-4 bg-background rounded-lg max-h-96 overflow-auto relative">
                        <Button
                          size="sm"
                          onClick={() => {
                            if (!n8nWorkflow.json) return;
                            navigator.clipboard.writeText(n8nWorkflow.json);
                            toast({ title: 'Copied!', description: 'คัดลอก Workflow JSON แล้ว' });
                          }}
                          className="absolute top-2 right-2 z-10 neon-button secondary"
                        >
                          <ClipboardCopy className="w-4 h-4" />คัดลอก
                        </Button>
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
                    <Button variant="outline" onClick={() => requestRenameHistoryItem(item)}>
                      <PencilLine className="w-4 h-4 mr-1" /> แก้ชื่อ
                    </Button>
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
        <div className="container mx-auto flex flex-wrap justify-center items-center gap-3">
          <Button onClick={handleConfirmPlan} className="neon-button">
            <FileText className="w-4 h-4"/> ยืนยันและดูผลสรุป
          </Button>
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
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => requestRenameHistoryItem(item)}>
                    <PencilLine className="w-4 h-4 mr-1" /> แก้ชื่อ
                  </Button>
                  <Button onClick={() => loadHistory(item.id)}>Load</Button>
                  <Button variant="destructive" onClick={() => deleteHistoryItem(item.id)}><Trash2 className="w-4 h-4"/></Button>
                </div>
              </div>
            )) : <p className="text-center opacity-60">ยังไม่มีประวัติการวางแผน</p>}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={renameHistoryState.isOpen}
        onOpenChange={isOpen => {
          if (!isOpen) {
            closeRenameHistoryDialog();
          }
        }}
      >
        <DialogContent className="neumorphic-card max-w-md">
          <DialogHeader>
            <DialogTitle className="gradient-text">เปลี่ยนชื่อแผน</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm opacity-80">
              ตั้งชื่อใหม่ให้แผนของคุณเพื่อค้นหาได้ง่ายขึ้นในภายหลัง
            </p>
            <Input
              autoFocus
              placeholder="ตั้งชื่อแผน"
              value={renameHistoryState.name}
              onChange={event => handleRenameHistoryNameChange(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleRenameHistorySubmit();
                }
              }}
            />
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={closeRenameHistoryDialog}>
              ยกเลิก
            </Button>
            <Button onClick={handleRenameHistorySubmit} className="neon-button">
              บันทึกชื่อใหม่
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
