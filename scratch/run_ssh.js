const { NodeSSH } = require('node-ssh');

async function runCommand(host, password, command) {
    const ssh = new NodeSSH();
    try {
        await ssh.connect({
            host: host,
            username: 'root',
            password: password,
            readyTimeout: 10000
        });
        
        console.log(`[${host}] Executing: ${command}`);
        const result = await ssh.execCommand(command, { cwd: '/var/www/escortvip' });
        
        console.log(`[${host}] STDOUT:\n` + result.stdout);
        if (result.stderr) console.log(`[${host}] STDERR:\n` + result.stderr);
    } catch (e) {
        console.error(`[${host}] Error:`, e.message);
    } finally {
        ssh.dispose();
    }
}

async function main() {
    const host = process.argv[2];
    const password = process.argv[3];
    const command = process.argv[4];

    if ('host || 'password || 'command) {
        console.error("Usage: node run_ssh.js <host> <password> <command>");
        process.exit(1);
    }

    await runCommand(host, password, command);
}

main();
