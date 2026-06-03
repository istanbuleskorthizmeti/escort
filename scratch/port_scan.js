const net = require('net');

const host = '213.232.235.181';
const ports = [22, 80, 443, 2222, 2202, 222, 8080, 3000, 5432, 3389];

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000);
    socket.on('connect', () => {
      console.log(`Port ${port} is OPEN`);
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      console.log(`Port ${port} TIMEOUT`);
      socket.destroy();
      resolve(false);
    });
    socket.on('error', (err) => {
      console.log(`Port ${port} CLOSED (${err.message})`);
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function run() {
  console.log(`Scanning common ports on ${host}...`);
  for (const port of ports) {
    await checkPort(port);
  }
}
run();
