import { googleAuth } from '../lib/google-auth';
import { bloggerService } from '../lib/seo/blogger';

async function testBlogger() {
  const blogId = '3080034604199783992';
  try {
    console.log('Testing Blogger Connection for ID:', blogId);
    
    // First test get blog info
    const auth = await googleAuth.getAuthorizedClient();
    const res = await bloggerService['blogger'].blogs.get({
      auth,
      blogId
    });
    console.log('✅ Success' Blog Name:', res.data.name);
    console.log('Blog URL:', res.data.url);
    
  } catch (err: any) {
    console.error('❌ Failed:', err.message);
  }
}

testBlogger();
