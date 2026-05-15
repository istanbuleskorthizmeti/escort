import { Client } from 'ssh2';
import fs from 'fs';

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec('cat > /var/www/escortvip/deploy.zip', (err, stream) => {
    if (err) throw err;
    const fileStream = fs.createReadStream('./deploy.zip');
    fileStream.pipe(stream);
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    });
    stream.on('data', (data) => {
      console.log('STDOUT: ' + data);
    });
    stream.stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).connect({
  host: '45.93.137.164',
  port: 22,
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
});
