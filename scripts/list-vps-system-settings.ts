import { NodeSSH } from 'node-ssh';
import { getSSHConfig } from './lib/ssh-helper';

const ssh = new NodeSSH();
const config = getSSHConfig();

const jsCodePayload = `
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split(/\\r?\\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const index = trimmed.indexOf('=');
        if (index > 0) {
          const key = trimmed.substring(0, index).trim();
          let val = trimmed.substring(index + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          process.env[key] = val;
        }
      }
    }
  } catch (err) {}
}

loadEnv();

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('213.232.235.181', 'localhost');
}

const prisma = new PrismaClient();

async function run() {
  try {
    const settings = await prisma.systemSetting.findMany();
    console.log('📋 System Settings Keys:');
    if (settings.length === 0) {
      console.log('(Empty table)');
    } else {
      settings.forEach(s => console.log('- ' + s.key + ' (value length: ' + s.value.length + ')'));
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
`;

async function main() {
  try {
    await ssh.connect(config);
    const remotePath = '/root/esc/scripts/list-vps-settings.js';
    await ssh.execCommand(`cat << 'EOF' > ${remotePath}\n${jsCodePayload}\nEOF`);
    const result = await ssh.execCommand('node scripts/list-vps-settings.js', { cwd: '/root/esc' });
    console.log('STDOUT:');
    console.log(result.stdout || 'No stdout.');
    console.log('STDERR:');
    console.log(result.stderr || 'No stderr.');
    ssh.dispose();
  } catch (err: any) {
    console.error('Failed:', err.message);
    ssh.dispose();
  }
}

main();
