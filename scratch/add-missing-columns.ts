import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const dbUrl = 'postgresql://vuc2026_user:DorukElite2026Secure@localhost:5432/vuc2026?sslmode=disable';

async function addMissingColumns() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🛠️ Adding missing SEO & Social columns to PageContent...');
    
    const sql = `
      ALTER TABLE "PageContent" 
      ADD COLUMN IF NOT EXISTS "isBloggerPosted" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "isTumblrPosted" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "isWordPressPosted" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "isTelegraphPosted" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "isPinterestPosted" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "isTikTokPosted" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "isYouTubePosted" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "isIndexed" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "bloggerPostUrl" text,
      ADD COLUMN IF NOT EXISTS "tumblrPostUrl" text,
      ADD COLUMN IF NOT EXISTS "wordPressPostUrl" text,
      ADD COLUMN IF NOT EXISTS "telegraphPostUrl" text,
      ADD COLUMN IF NOT EXISTS "pinterestPostUrl" text,
      ADD COLUMN IF NOT EXISTS "tikTokPostUrl" text,
      ADD COLUMN IF NOT EXISTS "youTubePostUrl" text,
      ADD COLUMN IF NOT EXISTS "bloggerPostId" text,
      ADD COLUMN IF NOT EXISTS "tumblrPostId" text,
      ADD COLUMN IF NOT EXISTS "wordPressPostId" text,
      ADD COLUMN IF NOT EXISTS "telegraphPostId" text,
      ADD COLUMN IF NOT EXISTS "lastIndexedAt" timestamp(3) without time zone;
    `;

    const res = await ssh.execCommand(`psql "${dbUrl}" -c '${sql}'`);
    console.log(res.stdout || res.stderr);
    console.log('✅ All missing columns added.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

addMissingColumns();
