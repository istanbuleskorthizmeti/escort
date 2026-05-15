import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function searchSpecificImage() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Searching for a specific vitrin image file...');
    
    const res = await ssh.execCommand('find / -name "seo_0_pinterest_aesthetic_1.jpg" 2>/dev/null');
    console.log('Found at:', res.stdout || 'NOT FOUND ANYWHERE');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

searchSpecificImage();
