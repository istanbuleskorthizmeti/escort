import * as fs from 'fs';
import * as path from 'path';

function run() {
  const appData = process.env.APPDATA;
  if (!appData) return;
  const historyPath = path.join(appData, 'Microsoft', 'Windows', 'PowerShell', 'PSReadLine', 'ConsoleHost_history.txt');
  if (fs.existsSync(historyPath)) {
    const content = fs.readFileSync(historyPath, 'utf8');
    console.log(content);
  }
}

run();
