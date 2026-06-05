const net = require('net');

const targetIp = '213.232.235.181';

// Common management ports, alternative SSH ports, and typical web service ports
const commonPorts = [22, 21, 23, 80, 443, 2222, 8022, 2200, 2223, 3389, 5432, 8080, 10022];

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2500);

    socket.on('connect', () => {
      console.log(`📡 Port ${port} is OPEN!`);
      socket.destroy();
      resolve({ port, status: 'open' });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ port, status: 'timeout' });
    });

    socket.on('error', () => {
      socket.destroy();
      resolve({ port, status: 'closed' });
    });

    socket.connect(port, targetIp);
  });
}

async function runScan() {
  console.log(`🔍 Scanning target IP ${targetIp} for potential open SSH/Management ports...`);
  const results = [];
  for (const port of commonPorts) {
    const res = await checkPort(port);
    results.push(res);
  }
  
  const openPorts = results.filter(r => r.status === 'open');
  if (openPorts.length === 0) {
    console.log('❌ All scanned ports are closed. Network is completely unreachable.');
  } else {
    console.log('✅ Found open ports:', openPorts.map(o => o.port));
  }
}

runScan();
