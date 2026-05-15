import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function deepSearch() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Deep Search: Docker & SQLite...');
    
    // 1. Thorough Docker check
    const docker = await ssh.execCommand('which docker && docker ps -a');
    console.log('--- DOCKER STATUS ---');
    console.log(docker.stdout || 'Docker not found.');

    // 2. SQLite file search (limited to common areas)
    console.log('\n--- SEARCHING FOR SQLITE FILES ---');
    const sqlite = await ssh.execCommand('find /var/www /root -name "*.sqlite" -o -name "*.db" 2>/dev/null');
    console.log(sqlite.stdout || 'No SQLite files found.');

    // 3. Process check for other DBs (MySQL, MongoDB?)
    console.log('\n--- CHECKING FOR OTHER DB PROCESSES ---');
    const procs = await ssh.execCommand('ps aux | grep -iE "mysql|mongodb|redis|mariadb" | grep -v grep');
    console.log(procs.stdout || 'No other DB processes found.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

deepSearch();
