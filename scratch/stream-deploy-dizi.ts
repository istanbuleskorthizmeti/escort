import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const server = { host: '45.93.137.164', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function streamDeploy() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🌊 Streaming deploy.zip to Dizi Server...');
    
    // Use a simple command to read from stdin and write to file
    const session = await ssh.requestShell();
    
    // Actually, node-ssh has no direct stdin pipe for files easily without a shell
    // We will use a script that reads the file in chunks and sends them over the existing SSH connection
    // but without the overhead of 'cat' and 'EOF'.
    
    // Let's try the simplest possible SSH pipe via command line
    console.log('✅ Connected. Using direct pipe...');
    
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

streamDeploy();
