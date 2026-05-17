
import { NodeSSH } from 'node-ssh';
import * as dotenv from 'dotenv';
dotenv.config();

const ssh = new NodeSSH();

async function checkRemote() {
    console.log("🔗 Connecting to remote server: 213.232.235.181...");
    try {
        await ssh.connect({
            host: '213.232.235.181',
            username: 'root',
            password: '4TVuj7qiHMfh7CxH6K!'
        });

        console.log("✅ Connected!");

        // Find the project folder
        const findCmd = 'find /root /var/www -name ".env" -maxdepth 3';
        const result = await ssh.execCommand(findCmd);
        console.log("📂 Env Files Found:\n", result.stdout);

        const envPaths = result.stdout.split('\n').filter(p => p.trim() !== '');
        
        for (const envPath of envPaths) {
            console.log(`\n📄 Reading: ${envPath}`);
            const catResult = await ssh.execCommand(`cat ${envPath}`);
            const content = catResult.stdout;
            
            const botTokenMatch = content.match(/TELEGRAM_BOT_TOKEN=["']?([^"'\n]+)["']?/);
            const chatIdMatch = content.match(/TELEGRAM_CHAT_ID=["']?([^"'\n]+)["']?/);
            
            console.log(`🤖 Bot Token: ${botTokenMatch ? botTokenMatch[1].substring(0, 10) + '...' : 'MISSING'}`);
            console.log(`🎯 Chat ID: ${chatIdMatch ? chatIdMatch[1] : 'MISSING'}`);
            
            if (botTokenMatch && chatIdMatch) {
                console.log("🚀 Testing Telegram from remote server...");
                const testCmd = `curl -X POST "https://api.telegram.org/bot${botTokenMatch[1]}/sendMessage" -d "chat_id=${chatIdMatch[1]}&text=🧛‍♂️ GOD MODE: Remote Server (${envPath}) Test Message"`;
                const curlResult = await ssh.execCommand(testCmd);
                console.log("📝 Remote Test Result:", curlResult.stdout);
            }
        }

    } catch (err: any) {
        console.error("❌ Connection failed:", err.message);
    } finally {
        ssh.dispose();
    }
}

checkRemote();
