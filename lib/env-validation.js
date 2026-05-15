const REQUIRED_ENV_ALWAYS = [
  "DATABASE_URL",
  "CRM_ENCRYPTION_KEY",
];

const REQUIRED_ENV_PRODUCTION = [
  "DRKCNAY_SYSTEM_KEY",
  "ADMIN_HQ_KEY",
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_CHAT_ID",
];

function getMissingEnv(isProduction) {
  const required = [
    ...REQUIRED_ENV_ALWAYS,
    ...(isProduction ? REQUIRED_ENV_PRODUCTION : []),
  ];
  return required.filter((name) => !process.env[name] || !String(process.env[name]).trim());
}

function validateRequiredEnv(isProduction = process.env.NODE_ENV === "production") {
  const missing = getMissingEnv(isProduction);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

module.exports = {
  validateRequiredEnv,
  getMissingEnv,
};
