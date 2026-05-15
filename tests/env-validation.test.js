const test = require("node:test");
const assert = require("node:assert/strict");

const { getMissingEnv } = require("../lib/env-validation");

test("getMissingEnv detects missing critical keys in production mode", () => {
  const original = { ...process.env };
  process.env.DATABASE_URL = "";
  process.env.CRM_ENCRYPTION_KEY = "";
  process.env.DRKCNAY_SYSTEM_KEY = "";
  process.env.ADMIN_HQ_KEY = "";
  process.env.TELEGRAM_BOT_TOKEN = "";
  process.env.TELEGRAM_CHAT_ID = "";

  const missing = getMissingEnv(true);
  assert.ok(missing.includes("DATABASE_URL"));
  assert.ok(missing.includes("CRM_ENCRYPTION_KEY"));
  assert.ok(missing.includes("DRKCNAY_SYSTEM_KEY"));
  assert.ok(missing.includes("ADMIN_HQ_KEY"));
  assert.ok(missing.includes("TELEGRAM_BOT_TOKEN"));
  assert.ok(missing.includes("TELEGRAM_CHAT_ID"));

  process.env = original;
});

test("getMissingEnv allows non-production optional keys", () => {
  const original = { ...process.env };
  process.env.DATABASE_URL = "postgres://ok";
  process.env.CRM_ENCRYPTION_KEY = "abc123";
  const missing = getMissingEnv(false);
  assert.equal(missing.length, 0);
  process.env = original;
});
