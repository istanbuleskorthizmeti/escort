import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '31.97.79.34',
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('✅ Connected.');

    // Fetch the root HTML and inspect style/link tags
    const res = await ssh.execCommand('curl -s http://127.0.0.1:3001/');
    console.log('--- HTML CONTENT (FIRST 1500 CHARS) ---');
    console.log(res.stdout.substring(0, 1500));

    console.log('--- LINK TAGS ---');
    const links = res.stdout.match(/<link[^>]+>/g) || [];
    console.log(links.slice(0, 10).join('\n'));

    console.log('--- STYLE TAGS ---');
    const styles = res.stdout.match(/<style[^>]*>([\s\S]*?)<\/style>/g) || [];
    console.log(styles.slice(0, 5).join('\n\n').substring(0, 2000));

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
