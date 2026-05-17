
import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function findChatIds() {
    try {
        await ssh.connect({
            host: '213.232.235.181',
            username: 'root',
            password: '4TVuj7qiHMfh7CxH6K!'
        });
        console.log("Connected.");
        const result = await ssh.execCommand('grep -r "TELEGRAM_CHAT_ID" /root /var/www --exclude-dir=node_modules');
        console.log("Grep Results:\n", result.stdout);
    } catch (e: any) {
        console.error(e.message);
    } finally {
        ssh.dispose();
    }
}

findChatIds();
