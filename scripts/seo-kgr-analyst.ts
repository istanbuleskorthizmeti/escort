/**
 * ⚜️ DRKCNAY ELITE KEYWORD GOLDEN RATIO (KGR) ANALYST (v1.0)
 * Data-driven engine to identify underserved, ultra-fast ranking search terms.
 * Formulates KGR = (Allintitle Results) / (Monthly Search Volume) [Volume <= 250]
 */

import fs from 'fs';
import path from 'path';

interface KeywordData {
  keyword: string;
  volume: number;
  allintitle: number;
  kgr?: number;
  status?: 'GOLDEN' | 'VIABLE' | 'COMPETITIVE' | 'INVALID_VOLUME';
}

// Seed data representing typical long-tail keywords in the target niche
const SEED_KEYWORDS: KeywordData[] = [
  { keyword: "sisli vip rus escort bayan", volume: 150, allintitle: 18 },
  { keyword: "kadikoy kaporasiz escort bayan", volume: 210, allintitle: 32 },
  { keyword: "beylikduzu ogrenci escort sitesi", volume: 90, allintitle: 8 },
  { keyword: "atasehir guvenilir vip escort", volume: 120, allintitle: 45 },
  { keyword: "esenyurt turbanli eskort bayanlar", volume: 180, allintitle: 15 },
  { keyword: "besiktas evine gelen escort", volume: 70, allintitle: 5 },
  { keyword: "bakirkoy olgun escort bayan", volume: 110, allintitle: 28 },
  { keyword: "istanbul gizli vip escort randevu", volume: 80, allintitle: 4 },
  { keyword: "avcilar universite ogrencisi eskort", volume: 130, allintitle: 48 },
  { keyword: "kartal luks escort bayanlar", volume: 60, allintitle: 2 },
  // High volume keywords that violate the KGR < 250 constraint
  { keyword: "istanbul escort", volume: 12000, allintitle: 1450 },
  { keyword: "sisli escort", volume: 2400, allintitle: 410 },
  { keyword: "kadikoy eskort", volume: 1800, allintitle: 320 }
];

function calculateKGR(item: KeywordData): KeywordData {
  const { volume, allintitle } = item;
  
  if (volume > 250) {
    return {
      ...item,
      kgr: Number((allintitle / volume).toFixed(4)),
      status: 'INVALID_VOLUME'
    };
  }

  const kgr = Number((allintitle / volume).toFixed(4));
  let status: 'GOLDEN' | 'VIABLE' | 'COMPETITIVE';

  if (kgr < 0.25) {
    status = 'GOLDEN';
  } else if (kgr <= 1.00) {
    status = 'VIABLE';
  } else {
    status = 'COMPETITIVE';
  }

  return {
    ...item,
    kgr,
    status
  };
}

function printReport(analyzed: KeywordData[]) {
  console.log("\n\x1b[1m\x1b[36m============================================================\x1b[0m");
  console.log("\x1b[1m\x1b[33m ⚜️  DRKCNAY ELITE KEYWORD GOLDEN RATIO (KGR) ANALYSIS REPORT\x1b[0m");
  console.log("\x1b[1m\x1b[36m============================================================\x1b[0m\n");

  console.log(
    ` ${"KEYWORD".padEnd(35)} | ${"VOL".padStart(5)} | ${"TITLE".padStart(5)} | ${"KGR".padStart(6)} | ${"STATUS"}`
  );
  console.log("-".repeat(70));

  const sorted = [...analyzed].sort((a, b) => {
    if (a.status === 'GOLDEN' && b.status !== 'GOLDEN') return -1;
    if (a.status !== 'GOLDEN' && b.status === 'GOLDEN') return 1;
    if (a.status === 'VIABLE' && b.status === 'COMPETITIVE') return -1;
    if (a.status === 'COMPETITIVE' && b.status === 'VIABLE') return 1;
    return (a.kgr || 0) - (b.kgr || 0);
  });

  for (const item of sorted) {
    const kw = item.keyword.padEnd(35);
    const vol = String(item.volume).padStart(5);
    const title = String(item.allintitle).padStart(5);
    const ratio = String(item.kgr?.toFixed(3) || 'N/A').padStart(6);
    
    let statusFormatted = '';
    if (item.status === 'GOLDEN') {
      statusFormatted = `\x1b[1m\x1b[32m★ GOLDEN (Rank in 48h)\x1b[0m`;
    } else if (item.status === 'VIABLE') {
      statusFormatted = `\x1b[33m✔ VIABLE (Rank fast)\x1b[0m`;
    } else if (item.status === 'COMPETITIVE') {
      statusFormatted = `\x1b[31m✘ COMPETITIVE\x1b[0m`;
    } else {
      statusFormatted = `\x1b[90m⚠ VOL > 250 (Skip KGR)\x1b[0m`;
    }

    console.log(` ${kw} | ${vol} | ${title} | ${ratio} | ${statusFormatted}`);
  }

  console.log("\n\x1b[1m\x1b[36m============================================================\x1b[0m\n");
}

function writeMarkdownReport(analyzed: KeywordData[], outputPath: string) {
  const sorted = [...analyzed].sort((a, b) => {
    if (a.status === 'GOLDEN' && b.status !== 'GOLDEN') return -1;
    if (a.status !== 'GOLDEN' && b.status === 'GOLDEN') return 1;
    return (a.kgr || 0) - (b.kgr || 0);
  });

  let md = `# ⚜️ DRKCNAY KGR SEO Audit Report\n\n`;
  md += `Generated on: ${new Date().toLocaleString('tr-TR')}\n\n`;
  md += `The **Keyword Golden Ratio (KGR)** is a data-driven method designed to target low-volume, low-competition keywords. When targeting keywords with a KGR of **less than 0.25** and monthly search volume **less than 250**, pages can rank in Google's top 50 (often top 10) within 48 hours of indexing.\n\n`;
  
  md += `## Formula\n`;
  md += `$$\\text{KGR} = \\frac{\\text{Allintitle Results}}{\\text{Monthly Search Volume}}$$ \n`;
  md += `*Rule: Monthly search volume must be $\\le 250$ to qualify for strict KGR speed benefits.*\n\n`;

  md += `## Analysis Summary\n\n`;
  md += `| Keyword | Search Volume | Allintitle Count | KGR | Classification | Action |\n`;
  md += `| :--- | :---: | :---: | :---: | :---: | :--- |\n`;

  for (const item of sorted) {
    let classification = '';
    let action = '';
    if (item.status === 'GOLDEN') {
      classification = `🟢 **GOLDEN**`;
      action = `🚀 **Target Immediately.** Write optimized long-tail post.`;
    } else if (item.status === 'VIABLE') {
      classification = `🟡 **VIABLE**`;
      action = `📝 Write content, monitor rankings.`;
    } else if (item.status === 'COMPETITIVE') {
      classification = `🔴 **COMPETITIVE**`;
      action = `❌ Do not target unless high authority.`;
    } else {
      classification = `⚪ **VOL > 250**`;
      action = `⚠️ Excluded from strict KGR. Target using link-building strategy instead.`;
    }

    md += `| \`${item.keyword}\` | ${item.volume} | ${item.allintitle} | ${item.kgr?.toFixed(3) || 'N/A'} | ${classification} | ${action} |\n`;
  }

  md += `\n\n## ⚡ Integration Strategy for Hydra Fleet Autopilot\n`;
  md += `1. **Hydra Content Warfare**: Integrate KGR keywords directly into the automated generators (\`scripts/elite-blogger-autopilot.ts\`, \`scripts/elite-tumblr-autopilot.ts\`, etc.).\n`;
  md += `2. **Meta Title Tag Exact Match**: Ensure the target KGR term is placed exactly in the H1 tag and meta title tag of generated pages.\n`;
  md += `3. **Keyword Density Guard**: Keep the exact-match KGR keyword to exactly **1 occurrence in the title** and **1-2 occurrences in the content body** to avoid Google keyword stuffing penalties.\n`;

  fs.writeFileSync(outputPath, md);
  console.log(`📝 Markdown report generated at: ${outputPath}`);
}

function run() {
  const analyzed = SEED_KEYWORDS.map(calculateKGR);
  printReport(analyzed);
  
  const reportPath = path.join('c:\\Users\\onurk\\esc\\scratch', 'kgr_audit_report.md');
  writeMarkdownReport(analyzed, reportPath);
}

run();
