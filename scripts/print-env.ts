import { execSync } from 'child_process';

console.log('--- PROCESS.ENV.DATABASE_URL ---');
console.log(process.env.DATABASE_URL || 'Not set in Node process.env');

console.log('\n--- SHELL ENV DATABASE_URL ---');
try {
  console.log(execSync('echo $DATABASE_URL').toString().trim() || 'Not set in shell env');
} catch (e: any) {
  console.log('Error printing shell env:', e.message);
}

console.log('\n--- ROOT .ENV CONTENT ---');
const fs = require('fs');
const path = require('path');
try {
  const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
  console.log(envContent.split('\n').filter((l: string) => l.includes('DATABASE_URL') || l.includes('WORKSPACE')));
} catch (e: any) {
  console.log('Error reading .env file:', e.message);
}
