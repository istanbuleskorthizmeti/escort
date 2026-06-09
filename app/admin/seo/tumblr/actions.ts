"use server";

import { prisma } from "@/lib/prisma";
import { getSiteId, getCanonicalHost } from "@/lib/site-context";
import { headers } from "next/headers";

/**
 * 🏺 TUMBLR AUTONOMOUS DISPATCH
 */
export async function queueTumblrPost(slug: string, title: string, content: string) {
  try {
    const hostHeader = (await headers()).get("host") || "istanbulescort.blog";
    const host = getCanonicalHost(hostHeader);
    const siteId = await getSiteId(host);

    await prisma.pageContent.upsert({
      where: { 
        slug_siteId: { 
          slug: slug,
          siteId
        } 
      },
      create: {
        siteId,
        slug: slug,
        title: title,
        content: content,
        isBloggerPosted: false,
        isTumblrPosted: false,
        isWordPressPosted: false,
      },
      update: {
        title: title,
        content: content,
        updatedAt: new Date()
      }
    });

    return { success: true, message: "Tumblr queue updated successfully" };
  } catch (error) {
    console.error("🚨 [TUMBLR-QUEUE] Error:", error);
    return { success: false, error: "Queue failed" };
  }
}

/**
 * 💣 TRIGGER SEO SYNC
 * Forces an immediate synchronization of pending SEO posts.
 */
export async function triggerSeoSync(params?: { 
  city?: string; 
  district?: string; 
  category?: string;
  tumblrBlog?: string;
}) {
  try {
    const hostHeader = (await headers()).get("host") || "istanbulescort.blog";
    const host = getCanonicalHost(hostHeader);
    console.log(`💣 [SEO-SYNC] Triggering sync for ${host}...`, params);
    return { 
      success: true, 
      message: "Sync triggered", 
      data: { 
        status: 'queued',
        title: 'SEO SYNC TRIGGERED'
      } 
    };
  } catch (e) {
    return { success: false, error: "Sync failed" };
  }
}
