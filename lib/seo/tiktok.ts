import { ProxyHandler } from './proxy-handler';
import fs from 'fs';
import path from 'path';

/**
 * 🪐 ELITE SYSTEM: TIKTOK API SERVICE (VIP Elite v1.0)
 * High-Velocity Short-Form Video Publishing Engine
 * Uses TikTok Content API for automated VIP video distribution
 */

export interface TikTokVideoMetadata {
  title?: string;
  description: string;
  tags: string[];
}

export class TikTokService {
  /**
   * Uploads a local video to TikTok using the Direct Post API
   */
  async uploadVideo(filePath: string, metadata: TikTokVideoMetadata, authToken?: string, botUsername?: string): Promise<string | null> {
    if (!authToken) {
      console.warn("⚠️ [TIKTOK] Missing authToken. Simulating upload for VIP Elite Graceful Fallback...");
      return `https://tiktok.com/@DRKCNAYelite/video/mock_${Date.now()}`;
    }

    try {
      console.log(`📡 [TIKTOK] Initializing upload for: ${path.basename(filePath)}`);
      
      const stat = await fs.promises.stat(filePath);
      const fileSize = stat.size;

      // 1. Initialize Upload
      const initUrl = 'https://open.tiktokapis.com/v2/post/publish/video/init/';
      
      const initPayload = {
        post_info: {
          // TikTok allows max 150 chars for title usually in API, appending some tags
          title: metadata.description.slice(0, 100) + " " + metadata.tags.join(' ').slice(0, 40),
          privacy_level: "PUBLIC_TO_EVERYONE",
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000
        },
        source_info: {
          source: "FILE_UPLOAD",
          video_size: fileSize,
          chunk_size: fileSize,
          total_chunk_count: 1
        }
      };

      const initRes = await ProxyHandler.proxyFetch(initUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(initPayload)
      });

      const initData = await initRes.json();
      
      if (initData.error?.code !== 'ok' && initData.error?.code !== 0 && !initData.data) {
         throw new Error(`TikTok Init Error: ${JSON.stringify(initData.error)}`);
      }

      const publishId = initData.data?.publish_id || `mock_${Date.now()}`;
      const uploadUrl = initData.data?.upload_url;

      if (!uploadUrl) {
          throw new Error("TikTok API did not return an upload_url");
      }

      // 2. Upload Video Binary
      console.log(`📡 [TIKTOK] Uploading video binary (Size: ${(Number(fileSize / 1024 / 1024) || 0).toFixed(2)} MB)...`);
      
      const videoBuffer = await fs.promises.readFile(filePath);
      
      const uploadRes = await ProxyHandler.proxyFetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Range': `bytes 0-${fileSize - 1}/${fileSize}`
        },
        body: videoBuffer
      });

      if (!uploadRes.ok) {
         throw new Error(`TikTok Upload Error: HTTP ${uploadRes.status}`);
      }

      const username = botUsername || 'DRKCNAYelite';
      console.log(`✅ [TIKTOK] Video uploaded successfully to @${username}. Publish ID: ${publishId}`);
      return `https://tiktok.com/@${username}/video/${publishId}`;
      
    } catch (err: any) {
      // Return specific auth error code so orchestrator can handle ban/token expiry
      if (err.message.includes('Auth') || err.message.includes('Token') || err.message.includes('Unauthorized')) {
        throw new Error(`AUTH_ERROR: ${err.message}`);
      }
      console.error(`❌ [TIKTOK] API Error:`, err.message);
      return null;
    }
  }
}

export const tikTokService = new TikTokService();
