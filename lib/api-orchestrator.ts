import { prisma } from './prisma';
import { TelegramService } from './crm/telegram';

export interface ApiConfig {
    id: string;
    name: string;
    defaultLimit: number;
}

const APIS: ApiConfig[] = [
    { id: 'BLOGGER', name: 'Google Blogger Engine', defaultLimit: 50 },
    { id: 'TELEGRAPH', name: 'Telegraph Ghost Network', defaultLimit: 150 }, // Swapped Tumblr for Telegraph
    { id: 'WORDPRESS', name: 'WordPress PBN', defaultLimit: 200 },
    { id: 'PROXY', name: 'Proxy/Network Engine', defaultLimit: 5000 },
];

export class ApiOrchestrator {
    
    // In-memory circuit breaker status to prevent DB hammering
    private static isBreakerTripped: Record<string, { trippedAt: number, reason: string }> = {};

    static async initialize() {
    }

    /**
     * Checks if an API is healthy and has quota left.
     */
    static async checkStatus(apiId: string): Promise<boolean> {
        const breaker = this.isBreakerTripped[apiId];
        if (breaker) {
            const timeSinceTripped = Date.now() - breaker.trippedAt;
            // 4 Hours cooldown for rate limits
            if (timeSinceTripped < 4 * 60 * 60 * 1000) {
                return false; 
            } else {
                // Reset breaker
                delete this.isBreakerTripped[apiId];
                console.log(`🟢 [CIRCUIT BREAKER] Reset for ${apiId}. Resuming operations.`);
                // Optionally notify Telegram that it's back online
                TelegramService.reportError(`🟢 DEVRE KESİCİ AÇILDI`, `${apiId} API limitleri sıfırlandı, yayınlar tekrar başladı.`);
                return true;
            }
        }
        return true;
    }

    /**
     * Records a successful call.
     */
    static async recordSuccess(apiId: string) {
        // Do nothing for now, but can be used for metric counting
    }

    /**
     * Circuit Breaker: Trips the breaker if a fatal error occurs (e.g. 403, 429).
     * And prevents spamming Telegram.
     */
    static async reportError(apiId: string, errorType: 'RATE_LIMITED' | 'ERROR' | 'QUOTA_EXCEEDED' | 'SUCCESS', message: string) {
        if (errorType === 'SUCCESS') {
            TelegramService.reportError(`🟢 TIER-2 BOMBARDIMANI`, message);
            return;
        }

        if (!this.isBreakerTripped[apiId]) {
            console.error(`🚨 [CIRCUIT BREAKER] Tripped for ${apiId}: ${errorType} - ${message}`);
            
            this.isBreakerTripped[apiId] = {
                trippedAt: Date.now(),
                reason: message
            };

            // Notify Telegram ONLY ONCE when the breaker trips, to prevent group spam.
            TelegramService.reportError(`🔴 DEVRE KESİCİ DEVREDE: ${apiId}`, `API limitleri doldu veya engellendi (${errorType}).\n\nBu servis 4 saatliğine uyku moduna alındı. Sistem diğer çalışır API'ler ile yayına devam edecektir. \n\nLog: ${message}`);
        }
    }
}
