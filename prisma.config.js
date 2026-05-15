/**
 * 🛡️ PRISMA 7 STABLE CONFIG
 * Resolves P1012 by explicitly mapping the datasource for the environment CLI.
 */
module.exports = {
  datasource: {
    url: process.env.DATABASE_URL
  }
};
