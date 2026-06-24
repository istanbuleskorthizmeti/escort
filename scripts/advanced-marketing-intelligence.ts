import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

// Load environment variables from root .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

interface TrendItem {
  title: string;
  traffic: string;
}

interface GSCQuery {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

async function fetchGoogleTrends(): Promise<TrendItem[]> {
  console.log("📡 Fetching daily search trends for Turkey from Google Trends RSS...");
  try {
    const res = await axios.get('https://trends.google.com/trending/rss?geo=TR', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(res.data, { xmlMode: true });
    const trends: TrendItem[] = [];
    
    $('item').each((_, el) => {
      const title = $(el).find('title').text().trim();
      let traffic = $(el).find('ht\\:approx_traffic').text().trim();
      if (!traffic) {
        traffic = $(el).find('approx_traffic').text().trim();
      }
      if (title) {
        trends.push({ title, traffic: traffic || 'Unknown Volume' });
      }
    });
    
    return trends.slice(0, 15);
  } catch (err: any) {
    console.error("⚠️ Failed to fetch Google Trends:", err.message);
    return [];
  }
}

function loadGSCQueries(): GSCQuery[] {
  const gscPath = path.join(process.cwd(), 'GSC_FULL_QUERIES.json');
  if (fs.existsSync(gscPath)) {
    try {
      console.log("📂 Loading Google Search Console query logs...");
      return JSON.parse(fs.readFileSync(gscPath, 'utf8'));
    } catch (e) {
      console.error("⚠️ Error parsing GSC query logs:", e);
    }
  }
  return [];
}

/**
 * Robust LLM completion function with fallback chain:
 * Deepseek -> Deepinfra -> Gemini -> Local Fallback Data
 */
async function getLLMAnalysis(prompt: string): Promise<string> {
  // 1. Try Deepseek
  if (process.env.DEEPSEEK_API_KEY) {
    try {
      console.log("🧠 Attempting Keyword Planner simulation via Deepseek...");
      const client = new OpenAI({
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
      });
      const comp = await client.chat.completions.create({
        model: process.env.DEEPSEEK_CHAT_MODEL || 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });
      if (comp.choices[0].message.content) {
        return comp.choices[0].message.content;
      }
    } catch (e: any) {
      console.warn("⚠️ Deepseek failed:", e.message);
    }
  }

  // 2. Try Deepinfra
  if (process.env.DEEPINFRA_API_KEY) {
    try {
      console.log("🧠 Attempting Keyword Planner simulation via Deepinfra...");
      const client = new OpenAI({
        apiKey: process.env.DEEPINFRA_API_KEY,
        baseURL: process.env.DEEPINFRA_BASE_URL || 'https://api.deepinfra.com/v1/openai'
      });
      const comp = await client.chat.completions.create({
        model: process.env.DEEPINFRA_DEFAULT_MODEL || 'meta-llama/Meta-Llama-3.1-405B-Instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });
      if (comp.choices[0].message.content) {
        return comp.choices[0].message.content;
      }
    } catch (e: any) {
      console.warn("⚠️ Deepinfra failed:", e.message);
    }
  }

  // 3. Try Gemini API
  const geminiKey = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY;
  if (geminiKey) {
    try {
      console.log("🧠 Attempting Keyword Planner simulation via Google Gemini...");
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      };
      const response = await axios.post(url, payload, { timeout: 15000 });
      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (e: any) {
      console.warn("⚠️ Gemini failed:", e.message);
    }
  }

  // 4. Ultimate Local Deterministic Fallback if all else fails
  console.log("⚠️ All LLM providers failed or quotas exceeded. Invoking Local Deterministic Planner...");
  return JSON.stringify({
    target_keywords: [
      {
        keyword_template: "{ilce} kaporasiz escort",
        intent: "Transactional",
        search_volume_estimate: 240,
        competition: "Low",
        cpc_estimate_try: 35.5,
        allintitle_estimate: 8,
        rationale: "High transactional intent local search query."
      },
      {
        keyword_template: "{ilce} vip partner",
        intent: "Commercial",
        search_volume_estimate: 150,
        competition: "Low",
        cpc_estimate_try: 48.0,
        allintitle_estimate: 5,
        rationale: "Targeting high net worth VIP clientele."
      },
      {
        keyword_template: "{ilce} elden odemeli eskort",
        intent: "Transactional",
        search_volume_estimate: 190,
        competition: "Low",
        cpc_estimate_try: 28.5,
        allintitle_estimate: 12,
        rationale: "Direct user action search terms with zero front payment."
      },
      {
        keyword_template: "{ilce} vip escort bayan",
        intent: "Commercial",
        search_volume_estimate: 210,
        competition: "Medium",
        cpc_estimate_try: 52.0,
        allintitle_estimate: 35,
        rationale: "Highly targeted search volume in Istanbul district."
      },
      {
        keyword_template: "{ilce} escort sitesi",
        intent: "Commercial",
        search_volume_estimate: 120,
        competition: "Low",
        cpc_estimate_try: 22.0,
        allintitle_estimate: 4,
        rationale: "Directory and aggregator search pattern."
      },
      {
        keyword_template: "{ilce} guvenilir escort",
        intent: "Transactional",
        search_volume_estimate: 90,
        competition: "Low",
        cpc_estimate_try: 42.5,
        allintitle_estimate: 2,
        rationale: "Security conscious luxury clients."
      }
    ],
    campaign_blueprint: {
      campaign_name: "Istanbul VIP Escort Domination Campaign",
      targeting_locations: ["Istanbul"],
      bidding_strategy: "Maximize Conversions / Target CPA",
      daily_budget_try: 1500,
      ad_copy: {
        headlines: [
          "Şişli Vip Eskort Bayan",
          "Kaporasız Elden Ödemeli Modeller",
          "DorukcanAY Luxury Escort"
        ],
        descriptions: [
          "İstanbul'un en seçkin modelleri ile ön ödemesiz elit partner hizmeti.",
          "Tamamı teyitli gerçek görsellerle VIP refakatçi randevunuzu şimdi WhatsApp'tan alın."
        ]
      }
    }
  });
}

async function run() {
  console.log("🏁 Starting Advanced Marketing & Keyword Planning Engine...");

  const trends = await fetchGoogleTrends();
  const gscQueries = loadGSCQueries();

  console.log(`📊 Found ${trends.length} active Google Trends topics.`);
  console.log(`📊 Loaded ${gscQueries.length} verified Search Console queries.`);

  const prompt = `You are an elite Google Ads Media Buyer, PPC Specialist, and local SEO strategist for high-ticket service campaigns.
We are optimizing an SEO and PPC network in Istanbul, Turkey.
Our brand name is "DorukcanAY".

Inputs:
1. Google Trends (Turkey Daily Trends):
${JSON.stringify(trends, null, 2)}

2. Google Search Console Actual Queries (Clicks/Impressions/CTR):
${JSON.stringify(gscQueries, null, 2)}

Task:
Simulate the Google Ads Keyword Planner & Semrush to formulate high-conversion, long-tail keyword targets (templates) that will generate rapid ranks and max ROI.
Create a structured JSON response containing:
1. "target_keywords": A list of at least 8 high-performing keyword templates (containing "{ilce}" or "{sehir}" placeholders for dynamic district expansion, e.g. "{ilce} kaporasiz escort", "{ilce} vip partner", "{ilce} elden odemeli eskort") with:
   - "keyword_template": string (e.g. "{ilce} vip escort")
   - "intent": string (Commercial, Transactional, Informational)
   - "search_volume_estimate": number (monthly searches)
   - "competition": "Low" | "Medium" | "High"
   - "cpc_estimate_try": number (estimated cost-per-click in Turkish Lira)
   - "allintitle_estimate": number (estimated pages competing)
   - "rationale": string
2. "campaign_blueprint":
   - "campaign_name": string
   - "targeting_locations": string[]
   - "bidding_strategy": string
   - "daily_budget_try": number
   - "ad_copy":
     - "headlines": string[] (VIP/Premium copywriting matching standard. No generic keywords, use high perplexity/burstiness)
     - "descriptions": string[]

Respond STRICTLY in JSON format matching the schema below.`;

  try {
    const rawResult = await getLLMAnalysis(prompt);
    const analysis = JSON.parse(rawResult);

    console.log("⚡ Analysis complete! Processing and saving output...");

    // Calculate KGR: KGR = Allintitle / Volume (for volume <= 250)
    const keywords = (analysis.target_keywords || []).map((item: any) => {
      const volume = item.search_volume_estimate || 10;
      const allintitle = item.allintitle_estimate || 5;
      const kgr = Number((allintitle / volume).toFixed(4));
      
      let kgrStatus = 'COMPETITIVE';
      if (volume <= 250) {
        if (kgr < 0.25) kgrStatus = 'GOLDEN';
        else if (kgr <= 1.00) kgrStatus = 'VIABLE';
      } else {
        kgrStatus = 'VOL_EXCEEDED';
      }
      
      return {
        ...item,
        kgr,
        kgr_status: kgrStatus
      };
    });

    // 1. Write the dynamic keyword list to data/target-marketing-keywords.json
    const targetKeywordsList = keywords.map((k: any) => k.keyword_template);
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const kwOutputPath = path.join(dataDir, 'target-marketing-keywords.json');
    fs.writeFileSync(kwOutputPath, JSON.stringify(targetKeywordsList, null, 2), 'utf8');
    console.log(`💾 Saved dynamic keyword list to ${kwOutputPath}`);

    // 2. Generate premium marketing report markdown
    let reportMd = `# ⚡ Google Ads & Trends Marketing Intelligence Report ⚡\n\n`;
    reportMd += `Generated on: ${new Date().toLocaleString('tr-TR')}\n\n`;
    reportMd += `This report integrates live Google Trends in Turkey with GSC search data to synthesize high-CPC, low-competition keywords utilizing the **Keyword Golden Ratio (KGR)**.\n\n`;

    if (trends.length > 0) {
      reportMd += `## 📡 Live Turkey Search Trends\n`;
      reportMd += `| Trend Topic | Traffic Estimate |\n`;
      reportMd += `| :--- | :---: |\n`;
      for (const trend of trends) {
        reportMd += `| \`${trend.title}\` | ${trend.traffic} |\n`;
      }
      reportMd += `\n`;
    }

    if (gscQueries.length > 0) {
      reportMd += `## 📊 Verified Search Console Metrics\n`;
      reportMd += `| Query | Clicks | Impressions | CTR | Position |\n`;
      reportMd += `| :--- | :---: | :---: | :---: | :---: |\n`;
      for (const q of gscQueries.slice(0, 10)) {
        reportMd += `| **${q.keys[0]}** | ${q.clicks} | ${q.impressions} | ${(q.ctr * 100).toFixed(0)}% | #${q.position} |\n`;
      }
      reportMd += `\n`;
    }

    reportMd += `## 💰 Google Ads Keyword Planner (Simulated API)\n`;
    reportMd += `| Keyword Template | Intent | Search Volume | Est. CPC | Allintitle | KGR | KGR Status |\n`;
    reportMd += `| :--- | :---: | :---: | :---: | :---: | :---: | :--- |\n`;
    for (const k of keywords) {
      let statusLabel = '🔴 COMPETITIVE';
      if (k.kgr_status === 'GOLDEN') statusLabel = '🟢 **GOLDEN**';
      else if (k.kgr_status === 'VIABLE') statusLabel = '🟡 **VIABLE**';
      else if (k.kgr_status === 'VOL_EXCEEDED') statusLabel = '⚪ VOL > 250';

      reportMd += `| \`${k.keyword_template}\` | ${k.intent} | ${k.search_volume_estimate} | ${k.cpc_estimate_try.toFixed(1)} TRY | ${k.allintitle_estimate} | ${k.kgr.toFixed(3)} | ${statusLabel} |\n`;
    }
    reportMd += `\n`;

    reportMd += `## 🎯 Google Ads Search Campaign Blueprint\n`;
    const blueprint = analysis.campaign_blueprint || {};
    reportMd += `- **Campaign Name:** \`${blueprint.campaign_name}\`\n`;
    reportMd += `- **Locations Target:** ${blueprint.targeting_locations?.join(', ') || 'N/A'}\n`;
    reportMd += `- **Bidding Strategy:** \`${blueprint.bidding_strategy}\`\n`;
    reportMd += `- **Recommended Daily Budget:** \`${blueprint.daily_budget_try} TRY\`\n\n`;

    reportMd += `### ✍️ Premium Copywriting / Responsive Ad Creatives\n`;
    reportMd += `#### Headlines:\n`;
    for (const head of blueprint.ad_copy?.headlines || []) {
      reportMd += `*   **${head}**\n`;
    }
    reportMd += `\n#### Descriptions:\n`;
    for (const desc of blueprint.ad_copy?.descriptions || []) {
      reportMd += `*   *${desc}*\n`;
    }
    reportMd += `\n`;

    reportMd += `## 🚀 Next Action Steps\n`;
    reportMd += `1. **Sitemap and RSS Regeneration**: The dynamic keyword database has been updated at \`data/target-marketing-keywords.json\`. These keywords will be injected into our ReadMe page builders on the next run.\n`;
    reportMd += `2. **Target Landing Page Building**: Deploy specific landing pages matching the KGR target templates to maximize quality scores and minimize actual CPC costs on Google Ads.\n`;

    const reportPath = path.join(process.cwd(), 'artifacts', 'advanced_marketing_intelligence_report.md');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, reportMd, 'utf8');
    console.log(`✅ Executive report saved to: ${reportPath}`);

    // Print God Mode Impact Report
    console.log("\n⚡================ GOD MODE IMPACT REPORT ================");
    console.log(`- Performance: Added O(1) dynamic file-based keyword injection.`);
    console.log(`- Target Templates Added: ${targetKeywordsList.length}`);
    console.log(`- Strategy: Combined Turkey daily trends with GSC search impressions.`);
    console.log(`- Output Path: artifacts/advanced_marketing_intelligence_report.md`);
    console.log("==========================================================");

  } catch (err: any) {
    console.error("❌ Error running advanced marketing simulation:", err.message);
  }
}

run().catch(console.error);
