/**
 * ⚡ HYDRA GCP ORCHESTRATION ENGINE (v1.0.0)
 * Ultra-robust, type-safe utilities for scale-heavy Cloud operations, rate limiting, and automation pipelines.
 */

import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import puppeteer, { Browser } from 'puppeteer';

// ==========================================
// 1. EXPONENTIAL BACKOFF & RATE LIMITER
// ==========================================
export interface BackoffOptions {
  maxRetries: number;
  initialDelayMs: number;
  factor: number;
  jitter: boolean;
}

const DEFAULT_BACKOFF: BackoffOptions = {
  maxRetries: 5,
  initialDelayMs: 1000,
  factor: 2,
  jitter: true,
};

/**
 * Executes an async task with strict rate limiting, retries, and randomized jittered backoff.
 */
export async function executeWithBackoff<T>(
  task: () => Promise<T>,
  options: Partial<BackoffOptions> = {}
): Promise<T> {
  const opt = { ...DEFAULT_BACKOFF, ...options };
  let attempt = 0;
  let delay = opt.initialDelayMs;

  while (attempt < opt.maxRetries) {
    try {
      return await task();
    } catch (error: any) {
      attempt++;
      if (attempt >= opt.maxRetries) {
        console.error(`❌ [BACKOFF] Maximum retries reached (${opt.maxRetries}). Operation aborted.`);
        throw error;
      }

      // Detect Rate Limit (429) or Quota limits (403/Quota Exceeded)
      const isRateLimit =
        error.code === 429 ||
        error.status === 429 ||
        error.message?.toLowerCase().includes('quota exceeded') ||
        error.message?.toLowerCase().includes('too many requests');

      if (!isRateLimit) {
        // If it's a structural error (e.g. 401 Unauthorized, 404), fail immediately
        console.error(`💥 [FATAL ERROR] Non-retryable error occurred: ${error.message}`);
        throw error;
      }

      // Apply Jitter to avoid thundering herd problem
      const currentJitter = opt.jitter ? Math.random() * 200 : 0;
      const actualDelay = delay + currentJitter;

      console.warn(
        `⚠️ [RATE LIMIT] Attempt ${attempt} failed. Backing off for ${actualDelay.toFixed(0)}ms... (Error: ${error.message})`
      );

      await new Promise((resolve) => setTimeout(resolve, actualDelay));
      delay *= opt.factor;
    }
  }
  throw new Error('[BACKOFF] Unreachable state in retry loop.');
}

// ==========================================
// 2. MULTI-PROJECT GCP AUTHENTICATOR
// ==========================================
export interface GcpCredentials {
  client_email: string;
  private_key: string;
  project_id?: string;
}

export class MultiProjectAuthenticator {
  private clients: Map<string, JWT> = new Map();

  /**
   * Registers credentials for a specific GCP Project ID or label
   */
  public registerProject(projectId: string, creds: GcpCredentials, scopes: string[]): void {
    try {
      const auth = new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: scopes,
      });
      this.clients.set(projectId, auth);
      console.log(`🔑 [AUTH] Registered JWT Client for project: ${projectId}`);
    } catch (err: any) {
      console.error(`❌ [AUTH] Failed to parse credentials for ${projectId}:`, err.message);
      throw err;
    }
  }

  /**
   * Retrieves the authenticated client for the requested project
   */
  public getClient(projectId: string): JWT {
    const client = this.clients.get(projectId);
    if (!client) {
      throw new Error(`❌ [AUTH] No client registered for project identifier: ${projectId}`);
    }
    return client;
  }
}

// ==========================================
// 3. LIGHTWEIGHT HEADLESS CHROME SCRAPER (SPA compatible)
// ==========================================
export interface ScrapingResult {
  html: string;
  title: string;
  metaDescription: string;
  status: number;
}

/**
 * Dynamic scraper designed for serverless environments (Cloud Functions / lightweight hosts)
 */
export async function scrapeDynamicPage(url: string, timeoutMs = 15000): Promise<ScrapingResult> {
  let browser: Browser | null = null;
  try {
    console.log(`🌐 [SCRAPER] Launching headless browser to render SPA target: ${url}`);
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    
    // Stealth user agent to bypass basic anti-scraping filters
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    const response = await page.goto(url, {
      waitUntil: 'networkidle2', // Wait until there are no more than 2 network connections for 500ms
      timeout: timeoutMs,
    });

    const status = response ? response.status() : 500;
    
    // Extract fully rendered DOM metrics
    const payload = await page.evaluate(() => {
      const title = document.title;
      const metaDescEl = document.querySelector('meta[name="description"]');
      const metaDescription = metaDescEl ? metaDescEl.getAttribute('content') || '' : '';
      const html = document.documentElement.outerHTML;

      return { title, metaDescription, html };
    });

    console.log(`✅ [SCRAPER] Successfully analyzed target. Status: ${status} | Title length: ${payload.title.length}`);

    return {
      status,
      ...payload,
    };
  } catch (err: any) {
    console.error(`❌ [SCRAPER] Navigation failed on ${url}:`, err.message);
    throw err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// ==========================================
// 4. GOOGLE APPS SCRIPT: SHEETS BRIDGE (Template Concept)
// ==========================================
/**
 * Note: This snippet is written here as a reference/template. 
 * This code should be pasted directly inside Google Apps Script (Editor.gs) 
 * connected to your spreadsheet for bulk execution.
 */
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `
function bulkCheckUrls() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var startRow = 2; // Assuming row 1 is headers
  var numRows = sheet.getLastRow() - 1;
  if (numRows <= 0) return;
  
  var range = sheet.getRange(startRow, 1, numRows, 3); // Columns: A (URL), B (Status), C (Timestamp)
  var values = range.getValues();
  
  for (var i = 0; i < values.length; i++) {
    var url = values[i][0];
    if (!url) continue;
    
    try {
      var response = UrlFetchApp.fetch(url, {
        muteHttpExceptions: true,
        followRedirects: false
      });
      
      values[i][1] = response.getResponseCode();
      values[i][2] = new Date().toISOString();
    } catch(err) {
      values[i][1] = "ERROR: " + err.message;
      values[i][2] = new Date().toISOString();
    }
  }
  
  // Batch write results to conserve spreadsheet write quotas
  range.setValues(values);
}
`;
