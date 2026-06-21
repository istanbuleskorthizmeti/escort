import dotenv from 'dotenv';
import path from 'path';
import { NodeSSH } from 'node-ssh';

// Resolve directory path to load local .env variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const getSSHConfig = () => {
  return {
    host: process.env.ATTACK_SERVER_IP || '187.77.111.203',
    username: process.env.ATTACK_SERVER_USER || 'root',
    password: process.env.ATTACK_SERVER_PASS || 'Z4-nN8JfiUIh5,;g'
  };
};

export async function connectSSH() {
  const ssh = new NodeSSH();
  const config = getSSHConfig();
  await ssh.connect(config);
  return ssh;
}
