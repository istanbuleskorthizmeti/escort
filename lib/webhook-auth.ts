import crypto from "crypto";

export function isValidTelegramWebhook(request: Request): boolean {
  const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!configuredSecret) return false;

  const headerSecret = request.headers.get("x-telegram-bot-api-secret-token");
  if (!headerSecret) return false;
  if (headerSecret.length !== configuredSecret.length) return false;

  return crypto.timingSafeEqual(Buffer.from(headerSecret), Buffer.from(configuredSecret));
}
