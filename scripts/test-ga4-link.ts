import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function getAuthenticatedClient() {
  let keyPath = path.join(process.cwd(), 'google-key-sovereign.json');
  if (!fs.existsSync(keyPath)) {
    keyPath = path.join(process.cwd(), 'google-key.json');
  }
  if (!fs.existsSync(keyPath)) {
    throw new Error('❌ Missing Service Account credentials.');
  }
  const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  const auth = new JWT({
    email: keys.client_email,
    key: keys.private_key,
    scopes: [
      'https://www.googleapis.com/auth/analytics.edit',
      'https://www.googleapis.com/auth/analytics.provision',
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/analytics.manage.users'
    ],
  });
  return auth;
}

async function run() {
  try {
    const auth = await getAuthenticatedClient();
    const tokenObj = await auth.getAccessToken();
    const accessToken = tokenObj.token;
    const headers = { Authorization: `Bearer ${accessToken}` };

    const propertyId = '531327098'; // from the list earlier

    console.log(`Checking property: ${propertyId}...`);
    try {
      const res = await axios.get(`https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}`, { headers });
      console.log('✅ Property exists:', res.data.displayName);
    } catch (e: any) {
      console.error('❌ Property get failed:', e.response?.data || e.message);
    }

    console.log(`Checking accessBindings list for property...`);
    try {
      const res = await axios.get(`https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/accessBindings`, { headers });
      console.log('✅ Access bindings:', res.data);
    } catch (e: any) {
      console.error('❌ Access bindings list failed:', e.response?.data || e.message);
    }

    console.log(`Trying to create accessBinding with payload 1 (user at root)...`);
    try {
      const res = await axios.post(
        `https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/accessBindings`,
        {
          user: 'info@dorukcanay.digital',
          roles: ['predefinedRoles/admin']
        },
        { headers }
      );
      console.log('✅ Created with payload 1!', res.data);
    } catch (e: any) {
      console.error('❌ Payload 1 failed:', e.response?.data?.error?.message || e.response?.data || e.message);
    }

    console.log(`Trying to create accessBinding with payload 2 (user in accessTarget)...`);
    try {
      const res = await axios.post(
        `https://analyticsadmin.googleapis.com/v1alpha/properties/${propertyId}/accessBindings`,
        {
          accessTarget: {
            user: 'info@dorukcanay.digital'
          },
          roles: ['predefinedRoles/admin']
        },
        { headers }
      );
      console.log('✅ Created with payload 2!', res.data);
    } catch (e: any) {
      console.error('❌ Payload 2 failed:', e.response?.data?.error?.message || e.response?.data || e.message);
    }

  } catch (err: any) {
    console.error('CRITICAL ERROR:', err.message);
  }
}

run();
