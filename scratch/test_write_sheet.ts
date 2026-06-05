import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

async function main() {
  const keyPath = path.join(process.cwd(), 'google-key.json');
  const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

  const auth = new google.auth.JWT(
    keyData.client_email,
    undefined,
    keyData.private_key,
    [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive'
    ]
  );

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = '1XycTLWfSZVmVUooPyC1afp14dT_XT10v38UbyTn6KKA';

  try {
    console.log('Reading spreadsheet...');
    const res = await sheets.spreadsheets.get({ spreadsheetId });
    console.log('Success read! Title:', res.data.properties?.title);
  } catch (err: any) {
    console.error('Read failed:', err.message);
  }
}

main();
