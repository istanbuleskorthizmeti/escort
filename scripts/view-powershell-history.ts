import * as fs from 'fs';
import * as path from 'path';

function run() {
  const appData = process.env.APPDATA;
  if (!appData) {
    console.error("APPDATA env variable not found");
    return;
  }

  const historyPath = path.join(appData, 'Microsoft', 'Windows', 'PowerShell', 'PSReadLine', 'ConsoleHost_history.txt');
  console.log(`Checking history path: ${historyPath}`);

  if (fs.existsSync(historyPath)) {
    const content = fs.readFileSync(historyPath, 'utf8');
    const lines = content.split('\n');
    console.log(`Total lines in history: ${lines.length}`);
    
    // Find lines containing "ghp_" or "PAT" or "token"
    const matchingLines = lines.filter(line => line.includes('ghp_') || line.includes('README_API') || line.includes('README_'));
    console.log(`Found ${matchingLines.length} matching lines:`);
    matchingLines.forEach((line, idx) => {
      console.log(`[${idx}] ${line.trim()}`);
    });
  } else {
    console.log("ConsoleHost_history.txt does not exist.");
  }
}

run();
