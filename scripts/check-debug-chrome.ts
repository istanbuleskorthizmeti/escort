import axios from 'axios';

async function check() {
  try {
    const res = await axios.get('http://127.0.0.1:9222/json/version', { timeout: 2000 });
    console.log('✅ Debug Chrome is running!');
    console.log(res.data);
  } catch (err: any) {
    console.log('❌ Debug Chrome is not running:', err.message);
  }
}

check();
