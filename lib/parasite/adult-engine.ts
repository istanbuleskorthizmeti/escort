
import axios from 'axios';
import { omniAI } from '../ai-provider';
import { prisma } from '../prisma';

export interface AdultVideo {
    title: string;
    url: string;
    embedCode: string;
    thumbUrl: string;
    tags: string[];
    category: string;
    aiDescription?: string;
    aiTitle?: string;
}

export class AdultContentEngine {
    private static PROVIDERS = {
        REDTUBE: 'https://api.redtube.com/?data=redtube.Videos.searchVideos&output=json',
        PORNHUB: 'https://www.pornhub.com/webmasters/search?search=' // Example, needs official or scraped bridge
    };

    /**
     * Categories to conquer
     */
    static CATEGORIES = [
        'amateur', 'anal', 'milf', 'teen', 'ebony', 'interracial', 'mature', 
        'hardcore', 'solo', 'group', 'turk', 'ifsa', 'evli', 'universiteli'
    ];

    /**
     * Aggregates videos and hydrates them with DeepSeek SEO
     */
    static async aggregate(keyword: string, limit = 20): Promise<AdultVideo[]> {
        console.log(`🔞 [HYDRA-ADULT] Harvesting '${keyword}' from the abyss...`);
        
        try {
            // Fetch from RedTube as primary reliable API
            const response = await axios.get(`${this.PROVIDERS.REDTUBE}&search=${encodeURIComponent(keyword)}&size=big`);
            const videos = response.data.videos || [];
            
            const results: AdultVideo[] = [];
            
            for (const v of videos.slice(0, limit)) {
                const videoData = v.video;
                
                // 🔥 DEEPSEEK RE-WRITING: Generate unique, provocative titles and descriptions
                const aiSEO = await omniAI.generate(
                    `Video: ${videoData.title}. Kategoriler: ${videoData.tags.map((t:any) => t.tag_name).join(', ')}. 
                     Bu video için kışkırtıcı, %100 özgün, 150 kelimelik bir Türkçe SEO açıklaması ve 1 adet kışkırtıcı başlık oluştur. 
                     Format: JSON { "title": "...", "description": "..." }`,
                    { temperature: 0.9, provider: 'deepseek', isJson: true }
                );

                const seo = typeof aiSEO === 'string' ? JSON.parse(aiSEO.includes('{') ? aiSEO.substring(aiSEO.indexOf('{'), aiSEO.lastIndexOf('}') + 1) : '{}') : aiSEO;

                results.push({
                    title: videoData.title,
                    aiTitle: seo.title || videoData.title,
                    url: videoData.url,
                    embedCode: this.wrapInGhostPlayer(videoData.video_id),
                    thumbUrl: videoData.default_thumb,
                    tags: videoData.tags.map((t: any) => t.tag_name),
                    category: keyword,
                    aiDescription: seo.description
                });
            }

            return results;
        } catch (err: any) {
            console.error('❌ [HYDRA-ADULT] Aggregation failed:', err.message);
            return [];
        }
    }

    /**
     * 🕵️‍♂️ GHOST PLAYER: Wraps external iframes in a custom UI to look native
     */
    private static wrapInGhostPlayer(videoId: string): string {
        return `
            <div class="ghost-player-wrapper relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl group">
                <iframe 
                    src="https://embed.redtube.com/?id=${videoId}" 
                    frameborder="0" 
                    class="absolute inset-0 w-full h-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" 
                    allowfullscreen
                ></iframe>
                <div class="absolute inset-0 pointer-events-none border-[3px] border-white/5 rounded-3xl"></div>
                <div class="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-[10px] font-black tracking-widest text-red-500">DRKCNAY 4K PLAYER</span>
                </div>
            </div>
        `;
    }

    /**
     * Deploys content to the database
     */
    static async massDeploy(siteId: string, limitPerCategory = 10) {
        for (const cat of this.CATEGORIES) {
            const videos = await this.aggregate(cat, limitPerCategory);
            console.log(`🚀 [HYDRA-ADULT] Deploying ${videos.length} videos for category: ${cat} to Site: ${siteId}`);
            
            for (const v of videos) {
                const slug = `${v.category}-${Math.random().toString(36).substring(7)}`;
                await prisma.pageContent.upsert({
                    where: { slug_siteId: { slug, siteId } },
                    update: {},
                    create: {
                        siteId,
                        slug,
                        title: v.aiTitle || v.title,
                        content: `
                            <div class="adult-video-page space-y-12">
                                ${v.embedCode}
                                <div class="ai-description prose prose-invert max-w-none">
                                    <p class="text-xl leading-relaxed text-zinc-400 font-medium italic">
                                        ${v.aiDescription}
                                    </p>
                                </div>
                                <div class="video-tags flex flex-wrap gap-3">
                                    ${v.tags.map(t => `<span class="bg-zinc-900 border border-white/5 px-4 py-2 rounded-full text-xs font-bold text-zinc-500 uppercase tracking-widest">#${t}</span>`).join('')}
                                </div>
                            </div>
                        `
                    }
                });
            }
        }
    }
}
