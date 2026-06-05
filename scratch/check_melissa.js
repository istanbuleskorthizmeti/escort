const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

(async () => {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('Connected.');

    const check1 = await ssh.execCommand('find /var/www/escortvip/public/_media/vitrin/ -iname "*aynur*" -o -iname "*ceren*" -o -iname "*svetlana*" -o -iname "*melissa*"');
    console.log('Special files on server:', check1.stdout || 'None found');

    const check2 = await ssh.execCommand('ls /var/www/escortvip/public/_media/vitrin/ | head -n 30');
    console.log('Sample files in vitrin folder:\n', check2.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
})();
