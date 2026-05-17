
import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function checkFolders() {
    try {
        await ssh.connect({
            host: '213.232.235.181',
            username: 'root',
            password: '4TVuj7qiHMfh7CxH6K!'
        });
        console.log("Connected.");
        const folders = await ssh.execCommand('ls -F /root /var/www');
        console.log("Folders:\n", folders.stdout);
    } catch (e: any) {
        console.error(e.message);
    } finally {
        ssh.dispose();
    }
}

checkFolders();
