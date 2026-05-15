
const { spawn } = require('child_process');
const path = require('path');

console.log("🧛‍♂️ [HYDRA_BOOT] Starting Infinite Sites Factory...");

const child = spawn('npx', ['tsx', 'scripts/infinite-sites-engine.ts'], {
  cwd: path.join(__dirname, '..'),
  shell: true,
  stdio: 'inherit'
});

child.on('exit', (code) => {
  console.log(`⚠️ [HYDRA_BOOT] Factory exited with code ${code}. Restarting...`);
  process.exit(code); // PM2 will handle the restart
});
