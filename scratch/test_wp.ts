async function testWP() {
  const wpUrl = 'https://escortvip11.wordpress.com/wp-json/wp/v2/posts';
  const username = 'dorukcanay1990'; // Use username, not email
  const appPassword = 'StHece7#10aHfuO4cARRY'by'; // The password provided

  const credentials = Buffer.from(`${username}:${appPassword}`).toString('base64');

  try {
    const response = await fetch(wpUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        title: 'DRKCNAY Test Post',
        content: 'This is a test post from DRKCNAY Engine.',
        status: 'draft' // Create as draft first to be safe
      })
    });

    const text = await response.text();
    console.log(`Status: ${response.status}`);
    
    try {
      const data = JSON.parse(text);
      if (response.ok) {
        console.log('✅ Success' Post ID:', data.id);
        console.log('URL:', data.link);
      } else {
        console.error('❌ Failed:', data);
      }
    } catch(e) {
      console.log('Raw output:', text);
    }

  } catch (err: any) {
    console.error('Network Error:', err.message);
  }
}

testWP();
