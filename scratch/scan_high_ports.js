const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const scannerScript = `
const net = require('net');
const host = '213.232.235.181';
const startPort = 10000;
const endPort = 65535;
const concurrency = 1000;

async function scan() {
  console.log("Starting high port scan from Attack against " + host + " from " + startPort + " to " + endPort + "...");
  const openPorts = [];

  function checkPort(port) {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(800);
      socket.on('connect', () => {
        console.log("[+] Port " + port + " is OPEN");
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

  const queue = Array.from({ length: endPort - startPort + 1 }, (_, i) => startPort + i);
  const workers = Array(concurrency).fill(null).map(async () => {
    while (queue.length > 0) {
      const port = queue.shift();
      if (port) {
        await checkPort(port);
      }
    }
  });

  await Promise.all(workers);
  console.log("Scan complete. Open high ports on " + host + ": " + openPorts.join(', '));
}

scan();
`;

async function run() {
  try {
    console.log('Connecting to Attack (187.77.111.203)...');
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('Connected!');

    console.log('Writing scanner script to /tmp/high_scanner.js on Attack...');
    await ssh.execCommand("cat << 'EOF' > /tmp/high_scanner.js\n" + scannerScript + "\nEOF");

    console.log('Running scanner on Attack...');
    const scanRes = await ssh.execCommand('node /tmp/high_scanner.js');
    console.log('Scan Output:\n', scanRes.stdout || scanRes.stderr);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}
run();
