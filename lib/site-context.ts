import prisma from './prisma';

/**
 * SITE CONTEXT SERVICE
 * Resolves the siteId for the current domain host.
 * Implements auto-enrollment for new domains in the Hydra network.
 */

const siteCache = new Map<string, string>();

export async function getSiteId(host: string): Promise<string> {
  // Normalize host (remove port and www. if present)
  let domain = host.split(':')[0].toLowerCase();
  if (domain.startsWith('www.')) {
    domain = domain.substring(4);
  }
  
  // 🛡️ SECURITY & MIGRATION: Prevent localhost leaks and map the server IP/local addresses to the main site domain.
  if (domain === 'localhost' || domain === '127.0.0.1' || domain === '213.232.235.181' || domain === '187.77.111.203' || domain === '45.93.137.164') {
    domain = 'vipescorthizmeti.com';
  }

  if (siteCache.has(domain)) {
    return siteCache.get(domain)!;
  }

  try {
    // 🛡️ [OPTIMIZATION] Avoid DB writes on every read. Use findUnique first.
    let site = await prisma.site.findUnique({
      where: { domain }
    });

    if (!site) {
      site = await prisma.site.create({
        data: {
          domain,
          status: 'ACTIVE',
          healthScore: 100
        }
      });
    }

    if (site) {
      siteCache.set(domain, site.id);
      return site.id;
    }
  } catch (e) {
    console.error(`❌ [HYDRA] Critical failure resolving site context for ${domain}:`, e);
  }

  // Final fallback: Try to find any active site or use a static ID
  return 'default-site-id';
}
