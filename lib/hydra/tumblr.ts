import { tumblrService } from '../seo/tumblr';

export async function postToTumblr(data: {
  blogName: string;
  title: string;
  body: string;
  tags: string[];
  imageUrl?: string;
  link?: string;
}) {
  console.log(`🚀 [DRKCNAY HYDRA] Posting to Tumblr: ${data.blogName}`);
  
  try {
    const result = await tumblrService.createPost(data.blogName, {
      title: data.title,
      body: data.body,
      tags: data.tags,
      canonicalUrl: data.link
    });
    return { success: true, platform: 'tumblr', response: result };
  } catch (error: any) {
    console.error(`❌ [TUMBLR ERROR]: ${error.message}`);
    return { success: false, platform: 'tumblr', error: error.message };
  }
}
