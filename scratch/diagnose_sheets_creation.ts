import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

async function main() {
  const keyPath = '/root/esc/config/pool-key-3.json';
  if (!fs.existsSync(keyPath)) {
    console.error('Key not found at:', keyPath);
    return;
  }
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

  try {
    console.log(`Attempting to create spreadsheet with service account: ${keyData.client_email}...`);
    const res = await sheets.spreadsheets.create({
      requestBody: {
        properties: { title: 'Hydra Diagnostic Sheet' }
      }
    });
    console.log('Success! Spreadsheet ID:', res.data.spreadsheetId);
  } catch (err: any) {
    console.error('Create failed!');
    console.error('Error Message:', err.message);
    if (err.response) {
      console.error('Response Status:', err.response.status);
      console.error('Response Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('No response object:', err);
    }
  }
}

main();
