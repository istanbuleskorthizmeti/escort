import axios from 'axios';

const token = '8656705130:AAFJr9QsnYASOQgIoAEEw_V8EzobjXH7nBc';

async function checkToken() {
  try {
    const res = await axios.get(`https://api.telegram.org/bot${token}/getMe`);
    console.log('✅ TOKEN WORKING. BOT INFO:', res.data);
  } catch (err: any) {
    console.error('❌ TOKEN NOT WORKING:', err.response?.data || err.message);
  }
}

checkToken();
