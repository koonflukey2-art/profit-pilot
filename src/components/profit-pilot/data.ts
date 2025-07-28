export const platformFees = {
  own_website: { platform: 0, payment: 3.0 },
  facebook_shop: { platform: 0, payment: 2.5 },
  tiktok_shop: { platform: 4.0, payment: 3.0 },
  shopee: { platform: 5.0, payment: 3.0 },
  lazada: { platform: 5.0, payment: 3.0 },
  other: { platform: 0, payment: 0 },
};

export const funnelPlans = {
  super_launch: { name: "เปิดตัวครั้งใหญ่ (TOFU 90%)", tofu: 90, mofu: 10, bofu: 0 },
  brand_building: { name: "สร้างแบรนด์จริงจัง (TOFU 80%)", tofu: 80, mofu: 15, bofu: 5 },
  awareness_focus: { name: "เน้นการรับรู้ (TOFU 70%)", tofu: 70, mofu: 20, bofu: 10 },
  launch: { name: "เปิดตัวแบรนด์ (TOFU 60%)", tofu: 60, mofu: 30, bofu: 10 },
  aggressive: { name: "หาลูกค้าใหม่ (TOFU 50%)", tofu: 50, mofu: 30, bofu: 20 },
  balanced: { name: "สมดุล (TOFU 30%)", tofu: 30, mofu: 40, bofu: 30 },
  nurture: { name: "ดูแลลูกค้า (TOFU 20%)", tofu: 20, mofu: 50, bofu: 30 },
  profit: { name: "ทำกำไรสูงสุด (TOFU 10%)", tofu: 10, mofu: 30, bofu: 60 },
};

export const businessTypeKeywords = {
  ecommerce_fashion: ['เสื้อ', 'กางเกง', 'เดรส', 'กระโปรง', 'ชุด', 'รองเท้า', 'กระเป๋า', 'เครื่องประดับ', 'fashion'],
  ecommerce_cosmetic: ['ลิป', 'แป้ง', 'รองพื้น', 'เซรั่ม', 'ครีม', 'สกินแคร์', 'เมคอัพ', 'cosmetic', 'skincare', 'กันแดด'],
  ecommerce_supplement: ['อาหารเสริม', 'วิตามิน', 'คอลลาเจน', 'โปรตีน', 'supplement', 'collagen', 'vitamin'],
  ecommerce_gadget: ['แก็ดเจ็ต', 'gadget', 'หูฟัง', 'มือถือ', 'คอม', 'อิเล็กทรอนิกส์'],
  ecommerce_homedecor: ['ของตกแต่งบ้าน', 'เฟอร์นิเจอร์', 'โคมไฟ', 'พรม', 'ของใช้ในบ้าน'],
  leadgen_high_ticket: ['อสังหา', 'บ้าน', 'คอนโด', 'ประกัน', 'รถยนต์', 'คอร์สราคาแพง'],
  ecommerce_digital: ['คอร์สออนไลน์', 'e-book', 'template', 'สัมมนาออนไลน์', 'webinar'],
};

export const metricsPlans = {
  fb_ecommerce_growth: {
      name: "Facebook - E-commerce (Growth Plan)",
      summary: 'แผนการเติบโตสำหรับ E-commerce บน Facebook เน้นการเข้าถึง (Reach) และการสร้าง Traffic (CTR) เพื่อขยายฐานลูกค้าใหม่เป็นหลัก',
      kpis: [
          { stage: 'TOFU', metric: 'CPM', benchmark: '150-300 ฿', importance: 'กลาง' },
          { stage: 'TOFU', metric: 'CTR (Link Click)', benchmark: '> 1.5%', importance: 'สูง' },
          { stage: 'MOFU', metric: 'Cost per View Content (CPVC)', benchmark: '< 15 ฿', importance: 'สูง' },
          { stage: 'BOFU', metric: 'Cost per Purchase (CPA)', benchmark: 'เป้าหมายที่คำนวณ', importance: 'สูงมาก' },
          { stage: 'BOFU', metric: 'ROAS', benchmark: '> 3.5x', importance: 'สูงมาก' },
      ]
  },
  fb_ecommerce_profit: {
      name: "Facebook - E-commerce (Profit Plan)",
      summary: 'แผนทำกำไรสำหรับ E-commerce บน Facebook เน้นการ Optimize Conversion และ ROAS จากกลุ่มเป้าหมายที่มีคุณภาพสูง (High-Intent) และลูกค้าเก่า',
      kpis: [
          { stage: 'TOFU', metric: 'Frequency', benchmark: '< 2.5', importance: 'กลาง' },
          { stage: 'MOFU', metric: 'Cost per Add to Cart (CPATC)', benchmark: '< 120 ฿', importance: 'สูง' },
          { stage: 'BOFU', metric: 'CVR (Conversion Rate)', benchmark: '> 2.0%', importance: 'สูงมาก' },
          { stage: 'BOFU', metric: 'ROAS', benchmark: '> 5x', importance: 'สูงมาก' },
          { stage: 'BOFU', metric: 'AOV (Average Order Value)', benchmark: 'ติดตาม', importance: 'สูง' },
      ]
  },
  fb_message_campaign: {
      name: "Facebook - แคมเปญข้อความ",
      summary: 'แผนสำหรับแคมเปญข้อความ (Inbox) เน้นการสร้างปฏิสัมพันธ์และปิดการขายในแชท วัดผลจากต้นทุนต่อการเริ่มสนทนา (CPP) และอัตราการปิดการขายของแอดมินเป็นหลัก',
      kpis: [
          { stage: 'MOFU', metric: 'ต้นทุนต่อการส่งข้อความเพื่อเริ่มการสนทนา', benchmark: '< 100 ฿', importance: 'สูงมาก' },
          { stage: 'BOFU', metric: '% ปิดการขาย', benchmark: '> 20%', importance: 'สูงมาก' },
          { stage: 'BOFU', metric: 'Roas Meta', benchmark: '> 3x', importance: 'สูงมาก' },
      ]
  },
  fb_lead_gen: {
      name: "Facebook - Lead Generation",
      summary: 'แผนหา Lead คุณภาพบน Facebook เน้นการลดต้นทุนต่อ Lead (CPL) และเพิ่มอัตราการเปลี่ยนเป็นลูกค้า (Lead to Close Rate)',
      kpis: [
          { stage: 'MOFU', metric: 'Cost Per Lead (CPL)', benchmark: '< 250 ฿', importance: 'สูงมาก' },
          { stage: 'MOFU', metric: 'Lead Form Conversion Rate', benchmark: '> 15%', importance: 'สูง' },
          { stage: 'BOFU', metric: 'Appointment Rate', benchmark: '> 10%', importance: 'สูงมาก' },
      ]
  },
  tiktok_ecommerce_growth: {
      name: "TikTok - E-commerce (Growth Plan)",
      summary: 'แผนการเติบโตสำหรับ TikTok Shop เน้นการสร้าง Viral และการมีส่วนร่วม (Engagement) เพื่อเพิ่มยอดเข้าชมร้านค้าและผู้ติดตามใหม่',
      kpis: [
          { stage: 'TOFU', metric: 'CPM', benchmark: '30-80 ฿', importance: 'สูง' },
          { stage: 'MOFU', metric: 'Cost per Click (CPC)', benchmark: '< 5 ฿', importance: 'สูง' },
          { stage: 'BOFU', metric: 'ROAS', benchmark: '> 3x', importance: 'สูงมาก' },
      ]
  },
  tiktok_brand_awareness: {
      name: "TikTok - Brand Awareness",
      summary: 'แผนสร้างการรับรู้แบรนด์บน TikTok เน้นการเข้าถึงกลุ่มเป้าหมายในวงกว้างด้วยต้นทุนที่ต่ำ และวัดผลจากการดูวิดีโอและการมีส่วนร่วม',
      kpis: [
          { stage: 'TOFU', metric: 'CPM', benchmark: '< 50 ฿', importance: 'สูงมาก' },
          { stage: 'MOFU', metric: 'Engagement Rate', benchmark: '> 5%', importance: 'สูง' },
      ]
  }
};

export const funnelObjectivesData = {
  ecommerce_website_campaign: { objectives: { tofu: ['สร้างการรับรู้แบรนด์', 'เพิ่ม Traffic เข้าเว็บไซต์'], mofu: ['สร้างความน่าเชื่อถือ (Reviews)', 'ให้ข้อมูลเชิงลึก'], bofu: ['กระตุ้นการซื้อ (Promotions)', 'ปิดการขาย'] } },
  ecommerce_message_campaign: { objectives: { tofu: ['เริ่มบทสนทนา', 'สร้างการรับรู้ผ่านแชท'], mofu: ['ให้คำปรึกษา', 'สร้างความสัมพันธ์'], bofu: ['ปิดการขายใน Inbox', 'เสนอดีลพิเศษ'] } },
  ecommerce_fashion: { objectives: { tofu: ['แสดงคอลเลคชั่นใหม่', 'สร้างแรงบันดาลใจ'], mofu: ['Lookbook / Mix & Match', 'รีวิวจาก Influencer'], bofu: ['โปรโมชั่นจำกัดเวลา', 'แจ้งเตือนสินค้า Restock'] } },
  ecommerce_cosmetic: { objectives: { tofu: ['Tutorial การใช้งาน', 'สร้าง Awareness'], mofu: ['รีวิวผลลัพธ์ Before/After', 'แจก Sample'], bofu: ['โปรโมชั่นซื้อ 1 แถม 1', 'สร้าง Loyalty Program'] } },
  ecommerce_supplement: { objectives: { tofu: ['ให้ความรู้ด้านสุขภาพ', 'สร้างความน่าเชื่อถือ'], mofu: ['ผลวิจัยรองรับ', 'รีวิวจากผู้ใช้จริง'], bofu: ['โปรแกรมสมัครสมาชิก', 'โปรโมชั่นพิเศษ'] } },
  ecommerce_gadget: { objectives: { tofu: ['Unboxing & First Impression', 'แสดงนวัตกรรม'], mofu: ['เปรียบเทียบฟีเจอร์', 'วิดีโอสาธิตการใช้งาน'], bofu: ['ส่วนลด Pre-order', 'โปรแกรม Trade-in'] } },
  ecommerce_homedecor: { objectives: { tofu: ['สร้างแรงบันดาลใจในการแต่งบ้าน', 'แสดงสินค้าในบรรยากาศจริง'], mofu: ['แนะนำการจัดวาง', 'รีวิวจากลูกค้า'], bofu: ['ส่วนลดสำหรับ Set สินค้า', 'บริการออกแบบฟรี'] } },
  ecommerce_fmcg: { objectives: { tofu: ['สร้างการจดจำในวงกว้าง', 'โปรโมทโปรโมชั่น'], mofu: ['เน้นย้ำคุณประโยชน์', 'สร้างสูตรอาหาร/การใช้งาน'], bofu: ['ส่วนลดที่จุดขาย', 'สะสมแต้มแลกของรางวัล'] } },
  ecommerce_digital: { objectives: { tofu: ['ให้ความรู้ฟรี (Webinar)', 'สร้าง Community'], mofu: ['แสดงตัวอย่างเนื้อหา', 'Testimonials'], bofu: ['ส่วนลด Early Bird', 'เสนอขายคอร์สเรียนขั้นสูง'] } },
  leadgen_b2b: { objectives: { tofu: ['สร้าง Whitepaper / Case Study', 'สร้าง Thought Leadership'], mofu: ['จัด Webinar ให้ความรู้', 'เสนอ Demo'], bofu: ['เสนอราคาพิเศษ', 'ให้คำปรึกษาฟรี'] } },
  leadgen_service: { objectives: { tofu: ['แสดงผลงาน (Portfolio)', 'สร้างความน่าเชื่อถือ'], mofu: ['ให้คำปรึกษาเบื้องต้น', 'รีวิวจากลูกค้า'], bofu: ['ประเมินราคาฟรี', 'โปรโมชั่นสำหรับลูกค้าใหม่'] } },
  leadgen_high_ticket: { objectives: { tofu: ['สร้างภาพลักษณ์ที่หรูหรา', 'ให้ข้อมูลภาพรวมโครงการ/บริการ'], mofu: ['นัดหมายเข้าชมโครงการ', 'ให้คำปรึกษาทางการเงิน'], bofu: ['เสนอเงื่อนไขพิเศษ', 'ปิดการขาย'] } },
  info_product: { objectives: { tofu: ['ให้ความรู้ฟรี', 'สร้าง Community'], mofu: ['แสดงตัวอย่างเนื้อหา', 'Testimonials'], bofu: ['ส่วนลด Early Bird', 'เสนอขายคอร์สเรียนขั้นสูง'] } },
  saas: { objectives: { tofu: ['ให้ความรู้เกี่ยวกับปัญหาที่แก้ไขได้', 'สร้าง Awareness'], mofu: ['เสนอ Free Trial / Demo', 'Case Studies'], bofu: ['ส่วนลดสำหรับแผนรายปี', 'Onboarding Support'] } },
  agency: { objectives: { tofu: ['แสดงผลงาน (Case Studies)', 'สร้าง Thought Leadership'], mofu: ['ให้คำปรึกษาฟรี', 'Audit เว็บไซต์/แคมเปญ'], bofu: ['เสนอ Proposal', 'แพ็คเกจบริการพิเศษ'] } },
  event: { objectives: { tofu: ['โปรโมทงาน', 'สร้าง Hype'], mofu: ['เปิดเผยรายชื่อ Speaker/ศิลปิน', 'ขายบัตรรอบ Early Bird'], bofu: ['โปรโมชั่นนาทีสุดท้าย', 'ขายสินค้าหน้างาน'] } },
  awareness: { objectives: { tofu: ['สร้างการรับรู้ในวงกว้าง (Reach)', 'สร้างการจดจำแบรนด์ (Ad Recall)'], mofu: ['สร้างการมีส่วนร่วม (Engagement)', 'สื่อสารข้อความหลักของแบรนด์'], bofu: ['กระตุ้นให้เกิดการค้นหาแบรนด์', 'สร้างทัศนคติที่ดีต่อแบรนด์'] } }
};

export const automationToolsConfig = {
  facebook: {
      name: 'Facebook Ads',
      metrics: [
          { value: 'cpa', text: 'Cost per Result' },
          { value: 'roas', text: 'Purchase ROAS' },
          { value: 'spend', text: 'Lifetime Spend' },
          { value: 'frequency', text: 'Frequency' },
          { value: 'cpm', text: 'CPM' },
      ],
      operators: [
          { value: '>', text: 'มากกว่า' },
          { value: '<', text: 'น้อยกว่า' },
          { value: '>=', text: 'มากกว่าหรือเท่ากับ' },
          { value: '<=', text: 'น้อยกว่าหรือเท่ากับ' },
      ],
      actions: [
          { value: 'turn_off_adset', text: 'ปิด Ad Set', needsValue: false },
          { value: 'turn_on_adset', text: 'เปิด Ad Set', needsValue: false },
          { value: 'increase_budget_percent', text: 'เพิ่มงบประมาณรายวัน (%)', needsValue: true },
          { value: 'decrease_budget_percent', text: 'ลดงบประมาณรายวัน (%)', needsValue: true },
          { value: 'notify', text: 'ส่งการแจ้งเตือน', needsValue: false },
      ],
      timeframes: [
          { value: 'today', text: 'วันนี้' },
          { value: 'yesterday', text: 'เมื่อวาน' },
          { value: 'last_3_days', text: '3 วันล่าสุด' },
          { value: 'last_7_days', text: '7 วันล่าสุด' },
          { value: 'lifetime', text: 'ตลอดอายุการใช้งาน' },
      ]
  },
  revealbot: {
      name: 'Revealbot',
       metrics: [
          { value: 'roas', text: 'ROAS (Purchase)' },
          { value: 'cpa', text: 'CPA (Purchase)' },
          { value: 'spend', text: 'Spend' },
          { value: 'frequency', text: 'Frequency' },
          { value: 'cpm', text: 'CPM' },
          { value: 'ctr_link', text: 'CTR (Link Click-Through)' },
          { value: 'cpc_link', text: 'CPC (Link)' },
          { value: 'impressions', text: 'Impressions' },
      ],
      operators: [
          { value: '>', text: 'is greater than' },
          { value: '<', text: 'is less than' },
          { value: '>=', text: 'is greater than or equal to' },
          { value: '<=', text: 'is less than or equal to' },
          { value: 'in_range', text: 'is in range' },
          { value: 'not_in_range', text: 'is not in range' },
      ],
      actions: [
          { value: 'pause', text: 'Pause', needsValue: false },
          { value: 'start', text: 'Start', needsValue: false },
          { value: 'increase_budget_percent', text: 'Increase budget by %', needsValue: true },
          { value: 'decrease_budget_percent', text: 'Decrease budget by %', needsValue: true },
          { value: 'set_budget', text: 'Set budget to', needsValue: true },
          { value: 'increase_bid_percent', text: 'Increase bid by %', needsValue: true },
          { value: 'notify_slack', text: 'Notify in Slack', needsValue: false },
      ],
      timeframes: [
          { value: 'last_1_hour', text: 'Last 1 hour' },
          { value: 'last_24_hours', text: 'Last 24 hours' },
          { value: 'today', text: 'Today' },
          { value: 'yesterday', text: 'Yesterday' },
          { value: 'last_3_days_inc', text: 'Last 3 days (including today)' },
          { value: 'last_7_days_exc', text: 'Last 7 days (excluding today)' },
          { value: 'lifetime', text: 'Lifetime' },
      ]
  },
  madgicx: {
      name: 'Madgicx',
       metrics: [
          { value: 'roas', text: 'ROAS' },
          { value: 'cpa', text: 'CPA' },
          { value: 'spend', text: 'Amount Spent' },
          { value: 'ctr', text: 'CTR (All)' },
          { value: 'profit', text: 'Profit' },
      ],
      operators: [
          { value: '>', text: 'is higher than' },
          { value: '<', text: 'is lower than' },
      ],
      actions: [
          { value: 'stop_ad', text: 'Stop Ad', needsValue: false },
          { value: 'increase_budget_by', text: 'Increase Budget By (%)', needsValue: true },
          { value: 'decrease_budget_by', text: 'Decrease Budget By (%)', needsValue: true },
          { value: 'notify', text: 'Send a notification', needsValue: false },
      ],
      timeframes: [
          { value: 'last_24_hours', text: 'in the last 24 hours' },
          { value: 'last_3_days', text: 'in the last 3 days' },
          { value: 'last_7_days', text: 'in the last 7 days' },
          { value: 'last_14_days', text: 'in the last 14 days' },
      ]
  }
};
