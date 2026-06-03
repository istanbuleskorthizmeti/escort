const net = require('net');

const host = '213.232.235.181';
const maxPort = 10000;
const concurrency = 200;

async function scan() {
  console.log(`Starting fast port scan on ${host} up to port ${maxPort}...`);
  const openPorts = [];

  async function checkPort(port) {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(1500);
      socket.on('connect', () => {
        console.log(`[+] Port ${port} is OPEN`);
        openPorts.push(port);
        socket.destroy();
        resolve();
      });
      socket.on('timeout', () => {
        socket.destroy();
        resolve();
      });
      socket.on('error', () => {
        socket.destroy();
        resolve();
      });
      socket.connect(port, host);
    });
  }

  const queue = Array.from({ length: maxPort }, (_, i) => i + 1);
  const workers = Array(concurrency).fill(null).map(async () => {
    while (queue.length > 0) {
      const port = queue.shift();
      if (port) {
        await checkPort(port);
      }
    }
  });

  await Promise.all(workers);
  console.log(`Scan finished. Open ports: ${openPorts.join(', ')}`);
}

scan();
