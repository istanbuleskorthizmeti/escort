const { exec } = require('child_process');
const path = require('path');

// 🧛‍♂️ HYDRA SIEGE RUNNER v1.0
// This is a JS wrapper to ensure perfect compatibility with PM2 on Windows.

const cmd = 'npx tsx scripts/hydra-sites-siege-engine.ts';
console.log(`[${new Date().toLocaleString()}] 🚀 Starting Hydra Siege Step...`);

const child = exec(cmd, { cwd: __dirname });

child.stdout.on('data', (data) => {
  process.stdout.write(data);
});

child.stderr.on('data', (data) => {
  process.stderr.write(data);
});

child.on('close', (code) => {
  console.log(`[${new Date().toLocaleString()}] 🏁 Step completed with code ${code}`);
  process.exit(code);
});
