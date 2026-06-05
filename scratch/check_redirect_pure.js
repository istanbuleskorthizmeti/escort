import http from 'http';

function testProxy() {
  const proxyHost = 'proxy-eu.proxy-cheap.com';
  const proxyPort = 5959;
  const targetHost = 'vipescorthizmeti.com';
  const targetPort = 443;
  const proxyAuth = Buffer.from('pc9nVy0zY4-res_sc-tr_istanbul_istanbul:PC_95G1byocU9aBTp0TQ').toString('base64');

  console.log(`📡 [CONNECT] Tunneling through proxy to ${targetHost}:${targetPort}...`);

  const req = http.request({
    host: proxyHost,
    port: proxyPort,
    method: 'CONNECT',
    path: `${targetHost}:${targetPort}`,
    headers: {
      'Proxy-Authorization': `Basic ${proxyAuth}`,
      'Host': `${targetHost}:${targetPort}`
    }
  });

  req.on('connect', (res, socket, head) => {
    console.log(`✅ Tunnel Connect Event! Status Code: ${res.statusCode}`);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
    socket.destroy();
  });

  req.on('error', (err) => {
    console.error('Tunnel Connection Error:', err.message);
  });

  req.end();
}

testProxy();
