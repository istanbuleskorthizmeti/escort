const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const scannerScript = `
const net = require('net');
const host = '213.232.235.181';
const ports = [22, 80, 443, 222, 2202, 2222, 2302, 2200, 2211, 2223, 2288, 2299, 10022, 20022, 22222];

async function scan() {
  console.log("Starting targeted port scan from Attack server against " + host + "...");
  
  for (const port of ports) {
    const start = Date.now();
    const result = await new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(4000);
      socket.on('connect', () => {
        socket.destroy();
        resolve('OPEN');
      });
      socket.on('timeout', () => {
        socket.destroy();
        resolve('TIMEOUT');
      });
      socket.on('error', (err) => {
        socket.destroy();
        resolve('CLOSED (' + err.message + ')');
      });
      socket.connect(port, host);
    });
    console.log("Port " + port + ": " + result + " (took " + (Date.now() - start) + "ms)");
  }
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

    console.log('Writing targeted scanner script to /tmp/targeted_scanner.js on Attack...');
    await ssh.execCommand("cat << 'EOF' > /tmp/targeted_scanner.js\n" + scannerScript + "\nEOF");

    console.log('Running targeted scanner on Attack...');
    const scanRes = await ssh.execCommand('node /tmp/targeted_scanner.js');
    console.log('Scan Output:\n', scanRes.stdout || scanRes.stderr);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}
run();
