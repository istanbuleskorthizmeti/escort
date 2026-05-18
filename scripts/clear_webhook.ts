import axios from 'axios';

const token = '8656705130:AAFJr9QsnYASOQgIoAEEw_V8EzobjXH7nBc';

async function clearWebhook() {
  try {
    const res = await axios.get(`https://api.telegram.org/bot${token}/deleteWebhook?drop_pending_updates=true`);
    console.log('✅ Webhook deleted successfully:', res.data);
  } catch (err: any) {
    console.error('❌ Failed to delete webhook:', err.response?.data || err.message);
  }
}

clearWebhook();
