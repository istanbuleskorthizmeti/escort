const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const path = require('path');

(async () => {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('Connected to server.');

    const localDir = path.resolve(__dirname, '../public/_media/vitrin');
    const remoteDir = '/var/www/escortvip/public/_media/vitrin';

    console.log(`Syncing directory from ${localDir} to ${remoteDir}...`);

    // Upload directory using node-ssh putDirectory
    await ssh.putDirectory(localDir, remoteDir, {
      recursive: true,
      concurrency: 10,
      tick: (localPath, remotePath, error) => {
        if (error) {
          console.error(`Failed: ${localPath} -> ${remotePath}`, error);
        } else {
          console.log(`Uploaded: ${path.basename(localPath)}`);
        }
      }
    });

    console.log('Sync completed successfully.');

    // Verify file count on server
    const checkCount = await ssh.execCommand('ls -la /var/www/escortvip/public/_media/vitrin/ | wc -l');
    console.log('New file count on server:', checkCount.stdout.trim());

    ssh.dispose();
  } catch (err) {
    console.error('Error during sync:', err);
    ssh.dispose();
  }
})();
