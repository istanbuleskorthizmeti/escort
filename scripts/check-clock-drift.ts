import axios from 'axios';

async function run() {
  console.log("Checking system clock drift against google.com...");
  const sysTime = new Date();
  console.log("Local system time:", sysTime.toUTCString(), `(Timestamp: ${sysTime.getTime()})`);
  
  try {
    const res = await axios.head('https://www.google.com');
    const googleTimeStr = res.headers['date'];
    if (!googleTimeStr) {
      console.log("Google response did not return a date header.");
      return;
    }
    const googleTime = new Date(googleTimeStr);
    console.log("Google server time:", googleTime.toUTCString(), `(Timestamp: ${googleTime.getTime()})`);
    
    const diff = sysTime.getTime() - googleTime.getTime();
    console.log(`Difference (Local - Google): ${diff} ms (${(diff / 1000).toFixed(2)} seconds)`);
    
    if (Math.abs(diff) > 300000) {
      console.log("⚠️ CLOCK DRIFT IS GREATER THAN 5 MINUTES! JWT signature will fail.");
    } else {
      console.log("✅ Clock is within acceptable range.");
    }
  } catch (err: any) {
    console.error("Error checking clock:", err.message);
  }
}

run();
