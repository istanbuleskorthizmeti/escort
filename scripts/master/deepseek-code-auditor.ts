import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { omniAI } from '../../lib/ai-provider';

// Define core files to audit
const CORE_FILES = [
  'app/page.tsx',
  'app/profile/[slug]/page.tsx',
  'app/ansiklopedi/[slug]/page.tsx',
  'components/SEO/DorukVitrin.tsx',
  'components/SEO/SEOContentEngine.tsx',
  'lib/ai-provider.ts',
  'lib/google-auth.ts',
  'app/amp/route.ts'
];

async function auditFile(filePath: string): Promise<string> {
  const absolutePath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) {
    return `### ❌ File Not Found: ${filePath}\n\n`;
  }

  const code = fs.readFileSync(absolutePath, 'utf8');
  console.log(`📡 [DEEPSEEK AUDIT] Analyzing ${filePath} (${code.length} bytes)...`);

  const prompt = `
    You are an Elite DeepSeek-Reasoner Code Architect. 
    Analyze the following source code from the file "${filePath}" for:
    1. Performance bottlenecks (unoptimized database queries, rendering bottlenecks, memory leaks).
    2. Strict TypeScript safety (avoiding 'any', missing null/undefined boundary checks).
    3. Security vulnerabilities (XSS, injection, token exposure, unsafe crypto).
    4. Code duplication & DRY compliance.

    Source Code of ${filePath}:
    \`\`\`typescript
    ${code}
    \`\`\`

    Provide a professional, clear, and actionable audit report in markdown format. 
    Focus on code optimization, safety, and modern Next.js/Tailwind conventions.
  `;

  const systemPrompt = `
    You are a principal software engineer specialized in Next.js, TypeScript, PostgreSQL, and high-performance Web systems.
    Provide a precise, constructive, and highly technical code review. Do not use generic filler words.
  `;

  try {
    const analysis = await omniAI.generate(prompt, {
      model: 'deepseek-chat',
      systemPrompt,
      temperature: 0.2,
      max_tokens: 3000
    });
    return analysis;
  } catch (err: any) {
    console.error(`❌ [DEEPSEEK AUDIT] Failed for ${filePath}:`, err.message);
    return `### ⚠️ Audit Failed for ${filePath}\nError: ${err.message}\n\n`;
  }
}

async function runAuditor() {
  console.log('⚡ [DEEPSEEK MASTER AUDITOR] Initializing codebase scan...');
  
  let reportContent = `# ⚡ DEEPSEEK CODEBASE AUDIT REPORT\n\n`;
  reportContent += `**Date:** ${new Date().toLocaleString('tr-TR')}\n`;
  reportContent += `**Target Files:** ${CORE_FILES.length} core components\n\n`;
  reportContent += `This report outlines the code quality, security posture, and performance optimizations for the Hydra SEO fleet project.\n\n`;
  reportContent += `--- \n\n`;

  for (const file of CORE_FILES) {
    const fileReport = await auditFile(file);
    reportContent += `## 📄 Analysis of \`${file}\`\n\n`;
    reportContent += `${fileReport}\n\n`;
    reportContent += `--- \n\n`;
    
    // Sleep to prevent API rate-limiting
    await new Promise(r => setTimeout(r, 3000));
  }

  const outputPath = path.resolve(process.cwd(), 'artifacts/deepseek_audit_report.md');
  const dirPath = path.dirname(outputPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(outputPath, reportContent, 'utf8');
  console.log(`🏆 [AUDIT COMPLETE] DeepSeek report written to: ${outputPath}`);
}

runAuditor().catch(console.error);
