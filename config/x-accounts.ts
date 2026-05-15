import { PrismaClient } from '@prisma/client';
import { checkPrismaConnection } from '../lib/prisma';const prisma = new PrismaClient();

export interface XAccount {
  username: string;
  password?: string;
  email?: string;
  totpSecret?: string;
  authToken: string;
  csrfToken?: string;
}

/**
 * 🚨 DRKCNAY HYDRA: DYNAMIC DB ACCOUNTS 🚨
 * Accounts are pulled directly from PostgreSQL database.
 */

export const getXAccounts = async (): Promise<XAccount[]> => {
  const isDbUp = await checkPrismaConnection();
  if (!isDbUp) {
    console.warn("⚠️ Database unreachable, simulating accounts.");
    return [
      { username: 'DRKCNAYVIP', authToken: 'mock-token-1', csrfToken: '', platform: 'X' } as XAccount,
      { username: 'EliteIstanbul', authToken: 'mock-token-2', csrfToken: '', platform: 'X' } as XAccount
    ];
  }

  try {
    const bots = await prisma.botAccount.findMany({
      where: {
        platform: 'X',
        status: 'ALIVE'
      }
    });

    if (bots.length === 0) {
      console.warn("⚠️ [X-ARMY] Veritabanında ALIVE (Aktif) X hesabı bulunamadı.");
      return [];
    }

    return bots.map(bot => {
      const payload = bot.authPayload ? JSON.parse(bot.authPayload) : {};
      return {
        username: bot.username,
        authToken: payload.authToken || '',
        csrfToken: payload.csrfToken || undefined,
        password: payload.password || undefined,
        email: bot.email || undefined
      };
    });
  } catch (error) {
    console.error("❌ [X-ARMY] DB'den X hesapları çekilirken hata oluştu:", error);
    return [];
  }
};

export async function getRandomXAccount(): Promise<XAccount> {
  const accounts = await getXAccounts();
  if (accounts.length === 0) {
    throw new Error("[OPSEC] No X accounts loaded from DB.");
  }
  return accounts[Math.floor(Math.random() * accounts.length)];
}
