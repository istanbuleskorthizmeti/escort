"use server";

import { cookies } from "next/headers";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import { addSiegeJob, siegeQueue } from "@/lib/queue/bullmq";

const execAsync = promisify(exec);

// Şifre kontrol işlemi
export async function authenticateProtocol(password: string) {
  const requiredPassword = process.env.DRKCNAY_HQ_PASSWORD;
  if (!requiredPassword) {
    return { success: false, error: "HQ password is not configured in environment." };
  }

  if (password === requiredPassword) {
    const cookieStore = await cookies();
    cookieStore.set("Elit_clearance_level", "GRANTED", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 Saatlik geçici süreli yetkilendirme
    });
    return { success: true };
  }
  return { success: false, error: "ACCESS DENIED. INTRUSION DETECTED." };
}

export async function revokeClearance() {
  const cookieStore = await cookies();
  cookieStore.delete("Elit_clearance_level");
}

// PM2 Donanım İstatistikleri & İşlemci Durumu
export async function fetchTelemetry() {
  try {
    // PM2 kurulu değilse (veya yerelde) dummy data verecek, sunucuda gerçek veri basacak.
    const { stdout } = await execAsync("pm2 jlist");
    const parsed = JSON.parse(stdout);
    
    // Escortvip PM2 instancını bul (genelde 0 veya listedeki ilk Node süreci)
    const targetProcess = parsed.find((p: any) => p.name === "escortvip" || p.name === "iqos-backend") || parsed[0];

    if (!targetProcess) {
      return { status: "OFFLINE", cpu: "0.0%", mem: "0 MB", uptime: "0" };
    }

    const cpu = targetProcess.monit?.cpu || 0;
    const mem = targetProcess.monit?.memory ? (targetProcess.monit.memory / 1024 / 1024).toFixed(1) : 0;
    const uptimeMinutes = Math.floor((Date.now() - targetProcess.pm2_env.pm_uptime) / 60000);

    return {
      status: targetProcess.pm2_env.status.toUpperCase(),
      cpu: `${cpu}%`,
      mem: `${mem} MB`,
      uptime: `${uptimeMinutes}m`,
      restarts: targetProcess.pm2_env.restart_time
    };
  } catch (error) {
    // Eğer sunucu dışındaysak (Local) şov amaçlı mock metrikler
    return { status: "MOCK_LIVE", cpu: "2.4%", mem: "142 MB", uptime: "42h", restarts: 0 };
  }
}

// Arka Plandaki Cron Loglarını Okuma
export async function fetchCronLogs() {
  try {
    // Sunucudaki gerçek logu okumayı dener
    const { stdout } = await execAsync("tail -n 20 /var/log/escortvip-cron.log");
    return stdout;
  } catch (err) {
    return "[ERROR_00X] Log file not accessible. System is probably in mock environment.\n[18:31:00] Elit Watchtower standing by...";
  }
}

// Canlı Sitemap Sayısı Tespiti
export async function fetchSEOStats() {
  try {
    // Kaç tane loc/url üretildiğini sitemap xml dosyasından sayar
    const sitemapData = await fs.readFile(process.cwd() + "/public/sitemap.xml", "utf-8");
    const count = (sitemapData.match(/<url>/g) || []).length;
    return {
      indexedURLs: count,
      status: count > 200 ? "OPTIMIZED" : "GENERATING"
    };
  } catch (e) {
    return {
      indexedURLs: 291, // Hardcoded fallback for UI layout testing
      status: "STG_MOCK"
    };
  }
}

// ==========================================
// 🛡️ VIP Elite: SIEGE QUEUE C2 CONTROLS
// ==========================================

export async function fetchQueueStatus() {
  try {
    const waiting = await siegeQueue.getWaitingCount();
    const active = await siegeQueue.getActiveCount();
    const completed = await siegeQueue.getCompletedCount();
    const failed = await siegeQueue.getFailedCount();

    return { waiting, active, completed, failed, isOnline: true };
  } catch (error) {
    // If Redis is not reachable (e.g. local dev without Redis)
    return { waiting: 0, active: 0, completed: 0, failed: 0, isOnline: false };
  }
}

export async function triggerSiegeMode(city: string, district?: string) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get("Elit_clearance_level")?.value !== "GRANTED") {
      throw new Error("UNAUTHORIZED");
    }

    // Add a job to the queue to generate edge content for this target
    await addSiegeJob('generate-edge-content', {
      city: city || 'istanbul',
      district: district || '',
      timestamp: Date.now()
    });

    return { success: true, message: `Siege initialized for ${city} ${district || ''}` };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ==========================================
// 🚀 INTEGRATION CENTER: ACCOUNT MANAGEMENT
// ==========================================

import { prisma } from "@/lib/prisma";

export async function fetchIntegrationAccounts() {
  const cookieStore = await cookies();
  if (cookieStore.get("Elit_clearance_level")?.value !== "GRANTED") return [];
  
  return await prisma.botAccount.findMany({
    orderBy: { updatedAt: 'desc' }
  });
}

export async function saveIntegrationAccount(data: any) {
  const cookieStore = await cookies();
  if (cookieStore.get("Elit_clearance_level")?.value !== "GRANTED") throw new Error("UNAUTHORIZED");

  const { id, username, email, platform, authPayload, proxyUrl, city, district, status, metadata } = data;

  if (id) {
    return await prisma.botAccount.update({
      where: { id },
      data: { username, email, platform, authPayload, proxyUrl, city, district, status, metadata: metadata || {} }
    });
  } else {
    return await prisma.botAccount.create({
      data: { username, email, platform, authPayload, proxyUrl, city, district, status: status || "ALIVE", metadata: metadata || {} }
    });
  }
}

export async function deleteIntegrationAccount(id: string) {
  const cookieStore = await cookies();
  if (cookieStore.get("Elit_clearance_level")?.value !== "GRANTED") throw new Error("UNAUTHORIZED");

  return await prisma.botAccount.delete({
    where: { id }
  });
}

export async function checkAccountStatus(id: string) {
  const cookieStore = await cookies();
  if (cookieStore.get("Elit_clearance_level")?.value !== "GRANTED") throw new Error("UNAUTHORIZED");

  // Mock status check - in reality this would ping the platform API
  return { success: true, status: "ALIVE", lastVerified: new Date().toISOString() };
}

import { DOMAIN_MATRIX } from "@/config/domains";

export async function fetchDomainMatrix() {
  const cookieStore = await cookies();
  if (cookieStore.get("Elit_clearance_level")?.value !== "GRANTED") return [];
  
  // In a real scenario, we could ping each domain here. 
  // For now, we return the static config which is our "Source of Truth".
  return DOMAIN_MATRIX;
}

export async function fetchBotActivity() {
  const cookieStore = await cookies();
  if (cookieStore.get("Elit_clearance_level")?.value !== "GRANTED") return [];

  return await prisma.systemLog.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' }
  });
}
