import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function setupSecondVPS() {
  console.log(`📡 [HYDRA-VPS] Connecting to new server ${config.host}...`);
  try {
    await ssh.connect(config);
    console.log('✅ SSH Connection established.');

    // 1. Update and install base utilities
    console.log('⚙️ [1/5] Updating packages and installing basic tools...');
    await ssh.execCommand('apt-get update -y && apt-get install -y curl git ufw fail2ban');

    // 2. Install Docker & Docker Compose
    console.log('🐳 [2/5] Installing Docker & Docker Compose...');
    const dockerCheck = await ssh.execCommand('docker --version');
    if (dockerCheck.code !== 0) {
      console.log('📥 Installing Docker Engine...');
      await ssh.execCommand('curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh');
      await ssh.execCommand('rm get-docker.sh');
    } else {
      console.log('✅ Docker is already installed.');
    }

    // Ensure docker-compose is installed
    const composeCheck = await ssh.execCommand('docker compose version');
    if (composeCheck.code !== 0) {
      console.log('📥 Installing docker-compose plugin...');
      await ssh.execCommand('apt-get install -y docker-compose-plugin');
    }

    // 3. Create docker-compose workspace for SEO Suite (Umami + SerpBear)
    console.log('📁 [3/5] Setting up workspace directories for SEO Stack...');
    await ssh.execCommand('mkdir -p /root/seo-stack/umami-db-data');

    const dockerComposeContent = `version: '3.8'

services:
  # --- UMAMI ANALYTICS ---
  umami-db:
    image: postgres:15-alpine
    container_name: umami-db
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami_user
      POSTGRES_PASSWORD: UmamiSecret2026!
    volumes:
      - ./umami-db-data:/var/lib/postgresql/data
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U umami_user -d umami"]
      interval: 5s
      timeout: 5s
      retries: 5

  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    container_name: umami
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://umami_user:UmamiSecret2026!@umami-db:5432/umami
      APP_SECRET: 7e9f3b8c2d1a4e5f6b0c8d9e0f1a2b3c
      TRACKER_SCRIPT_NAME: custom-telemetry
    restart: always
    depends_on:
      umami-db:
        condition: service_healthy

  # --- SERPBEAR (RANK TRACKER) ---
  serpbear:
    image: towfiqi/serpbear:latest
    container_name: serpbear
    ports:
      - "8080:3000"
    environment:
      - USER_NAME=admin
      - PASSWORD=HydraSerpBear2026!
      - SECRET=9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b
    volumes:
      - ./serpbear-data:/app/data
    restart: always
`;

    const composeB64 = Buffer.from(dockerComposeContent).toString('base64');
    await ssh.execCommand(`echo "${composeB64}" | base64 -d > /root/seo-stack/docker-compose.yml`);
    console.log('✅ Created docker-compose.yml in /root/seo-stack/');

    // 4. Start Stack
    console.log('🚀 [4/5] Spinning up Umami & SerpBear containers via Docker Compose...');
    const upCmd = await ssh.execCommand('docker compose up -d', { cwd: '/root/seo-stack' });
    console.log(upCmd.stdout || upCmd.stderr);

    // 5. Setup Firewall (UFW)
    console.log('🔒 [5/5] Hardening firewall (UFW) rules...');
    await ssh.execCommand('ufw default deny incoming');
    await ssh.execCommand('ufw default allow outgoing');
    await ssh.execCommand('ufw allow 22/tcp comment "SSH"');
    await ssh.execCommand('ufw allow 3000/tcp comment "Umami Analytics"');
    await ssh.execCommand('ufw allow 8080/tcp comment "SerpBear Rank Tracker"');
    await ssh.execCommand('ufw --force enable');

    console.log('\n🏆 [SUCCESS] Second VPS provisioning complete!');
    console.log('================================================================');
    console.log(`📊 Umami Analytics is available at: http://${config.host}:3000`);
    console.log(`🔎 SerpBear Rank Tracker is available at: http://${config.host}:8080`);
    console.log('   Default Username: admin');
    console.log('   Default Password: HydraSerpBear2026!');
    console.log('================================================================');
    
    ssh.dispose();
  } catch (err: any) {
    console.error('💥 [PROVISION ERROR]', err.message);
    ssh.dispose();
  }
}

setupSecondVPS();
