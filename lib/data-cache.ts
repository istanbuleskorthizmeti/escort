import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { getHybridProfiles as getHybridProfilesOriginal } from './ad-service';
import { getActiveProfiles as getVitrinProfilesOriginal } from '@/app/actions/vitrin';
import { prisma } from './prisma';

/**
 * 🧛‍♂️ DRKCNAY PERSISTENT CACHE LAYER (GOD MODE)
 * Uses unstable_cache for cross-request caching and cache tags for granular invalidation.
 * Replaces the weak per-request cache with a nükleer-grade persistent store.
 */

export const getHybridProfiles = cache(async (params: any) => {
  return unstable_cache(
    async () => getHybridProfilesOriginal(params),
    [`profiles-${JSON.stringify(params)}`],
    { revalidate: 3600, tags: ['profiles'] }
  )();
});

export const getVitrinProfiles = cache(async () => {
  return unstable_cache(
    async () => getVitrinProfilesOriginal(),
    ['vitrin-profiles'],
    { revalidate: 3600, tags: ['vitrin'] }
  )();
});

export const getPageContent = cache(async (slug: string, siteId: string | null) => {
  return unstable_cache(
    async () => prisma.pageContent.findFirst({
      where: { 
        slug, 
        OR: [{ siteId }, { siteId: null }]
      },
      orderBy: { siteId: 'desc' }
    }),
    [`page-content-${slug}-${siteId}`],
    { revalidate: 3600, tags: ['content'] }
  )();
});
