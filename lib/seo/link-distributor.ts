import { prisma } from "@/lib/prisma";

interface PageContentWithSite {
  slug: string;
  title: string | null;
  site: {
    domain: string;
  } | null;
}

export class LinkDistributor {
  /**
   * Googlebot log verilerini analiz ederek en son taranan veya hiç taranmayan
   * sayfaları tespit eder ve bunlara öncelikli iç link çıkışı sağlar.
   */
  public static async getDynamicLinks(limit: number = 5): Promise<string> {
    try {
      // 1. Son 7 günde Googlebot tarafından taranmış sayfaları ve zamanlarını al
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const botLogs = await prisma.googlebotLog.findMany({
        where: {
          timestamp: { gte: sevenDaysAgo },
          userAgent: { contains: "Googlebot" }
        },
        select: {
          pathname: true,
          timestamp: true
        },
        orderBy: {
          timestamp: "desc"
        }
      });

      // Taranan yolların (pathnames) benzersiz listesini çıkart
      const crawledPaths = Array.from(new Set(botLogs.map((log: { pathname: string; timestamp: Date }) => log.pathname)));

      // 2. Veritabanındaki tüm sayfa rotalarımızı çek
      const allPagesRaw = await prisma.pageContent.findMany({
        select: {
          slug: true,
          title: true,
          site: {
            select: {
              domain: true
            }
          }
        }
      });

      const allPages: PageContentWithSite[] = allPagesRaw;

      // 3. Tarananlar listesinde yer ALMAYAN (hiç taranmamış veya son 7 gündür uğranmamış) sayfaları ayır
      const unindexedOrColdPages = allPages.filter((page: PageContentWithSite) => {
        const fullPath = `/${page.slug}`;
        return !crawledPaths.includes(fullPath);
      });

      // Eğer soğuk/taranmamış sayfa yoksa, en eski güncellenenleri referans al
      const targets = unindexedOrColdPages.length > 0 
        ? unindexedOrColdPages.sort(() => 0.5 - Math.random()).slice(0, limit)
        : allPages.sort(() => 0.5 - Math.random()).slice(0, limit);

      if (targets.length === 0) return "";

      const links = targets
        .filter((p: PageContentWithSite) => p.site?.domain)
        .map((p: PageContentWithSite) => {
          const url = `https://${p.site!.domain}/${p.slug}`;
          const anchor = p.title || `${p.slug} VIP Partner`;
          return `<a href="${url}" title="${anchor}" style="color: #e11d48; text-decoration: underline; font-weight: 500;">${anchor}</a>`;
        });

      return links.join(", ");
    } catch (error) {
      console.error("❌ [LINK-DISTRIBUTOR] Error generating dynamic links:", error);
      return "";
    }
  }
}
