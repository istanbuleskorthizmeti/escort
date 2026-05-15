import { prisma } from "../prisma";
import os from "os";

/**
 * DRKCNAY MASTER LOCK (Anti-Conflict Protocol)
 * Ensures only one bot instance is active across multiple servers.
 */
export class MasterLock {
  private static instance: MasterLock;
  private myIp: string = "";
  private pingInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.myIp = this.getNetworkIP();
  }

  public static getInstance(): MasterLock {
    if (!MasterLock.instance) {
      MasterLock.instance = new MasterLock();
    }
    return MasterLock.instance;
  }

  private getNetworkIP() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
      const iface = interfaces[devName];
      if (!iface) continue;
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address;
        }
      }
    }
    return "unknown-ip";
  }

  /**
   * Attempts to acquire the master lock.
   * Returns true if lock acquired or already held.
   */
  async acquire(processName: string): Promise<boolean> {
    console.log(`🔐 [MASTER_LOCK] [${processName}] Attempting to acquire lock for IP: ${this.myIp}`);
    
    try {
      const lock = await prisma.botLock.findUnique({ where: { id: "singleton" } });

      const now = new Date();
      const twoMinutesAgo = new Date(now.getTime() - 120000);

      if (lock) {
        // If someone else has the lock and it's fresh (last ping < 2 mins)
        if (lock.masterIp !== this.myIp && lock.lastPing > twoMinutesAgo && lock.isActive) {
          console.warn(`🛑 [MASTER_LOCK] Conflict! Master already active on IP: ${lock.masterIp} (Last Ping: ${lock.lastPing.toLocaleTimeString()})`);
          return false;
        }
        
        // Hijack or re-confirm lock
        await prisma.botLock.update({
          where: { id: "singleton" },
          data: {
            masterIp: this.myIp,
            lastPing: now,
            isActive: true
          }
        });
      } else {
        // Create initial lock
        await prisma.botLock.create({
          data: {
            id: "singleton",
            masterIp: this.myIp,
            lastPing: now,
            isActive: true
          }
        });
      }

      this.startHeartbeat();
      console.log(`✅ [MASTER_LOCK] Lock acquired successfully.`);
      return true;
    } catch (err) {
      console.error(`❌ [MASTER_LOCK] DB Connectivity Error:`, err);
      return false;
    }
  }

  private startHeartbeat() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    
    this.pingInterval = setInterval(async () => {
      try {
        await prisma.botLock.update({
          where: { id: "singleton" },
          data: { lastPing: new Date(), isActive: true }
        });
      } catch (err) {
        console.error(`⚠️ [MASTER_LOCK] Heartbeat failed:`, err);
      }
    }, 60000); // Heartbeat every 1 minute
  }

  async release() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    try {
      await prisma.botLock.update({
        where: { id: "singleton" },
        data: { isActive: false }
      });
      console.log(`🔓 [MASTER_LOCK] Lock released.`);
    } catch (e) {}
  }
}
