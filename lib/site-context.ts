import prisma from './prisma';

/**
 * SITE CONTEXT SERVICE
 * Resolves the siteId for the current domain host.
 * Implements auto-enrollment for new domains in the Hydra network.
 */

const siteCache = new Map<string, string>();

export function getCanonicalHost(host: string): string {
  let domain = host.split(':')[0].toLowerCase();
  if (domain.startsWith('www.')) {
    domain = domain.substring(4);
  }
  // Remove trailing dots that could be injected
  domain = domain.replace(/\.+$/, '');
  
  if (domain === 'localhost' || domain === '127.0.0.1' || domain === '213.232.235.181' || domain === '187.77.111.203' || domain === '45.93.137.164') {
    return 'istanbulescort.blog';
  }
  return domain;
}

export async function getSiteId(host: string): Promise<string> {
  let domain = getCanonicalHost(host);

  const mirrors = ['escortvip.net', 'istanbulescort.blog', 'vipescorthizmeti.shop', 'dorukcanay.digital', 'istanbulescort.blog'];
  if (mirrors.includes(domain)) {
    domain = 'istanbulescort.blog';
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
      try {
        site = await prisma.site.create({
          data: {
            domain,
            status: 'ACTIVE',
            healthScore: 100
          }
        });
      } catch (createErr: any) {
        // If unique constraint failed (code P2002), retrieve the site again
        if (createErr.code === 'P2002') {
          site = await prisma.site.findUnique({
            where: { domain }
          });
        } else {
          throw createErr;
        }
      }
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
