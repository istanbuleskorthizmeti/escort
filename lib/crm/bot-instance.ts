import { Telegraf } from 'telegraf';

// Exported bot instance (with error handling to prevent main process crash)
const botToken = process.env.TELEGRAM_BOT_TOKEN;
export const bot = botToken ? new Telegraf(botToken) : null;

if (bot) {
  bot.catch((err) => {
    console.error('🔥 [TELEGRAM-BOT] Error caught:', err);
  });
}
