const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('Connected.');

    const pyScript = `
import os, shutil
root = '/root/esc/public/_media'
for r, d, fs in list(os.walk(root)):
    for f in fs:
        full = os.path.join(r, f)
        if chr(92) in full:
            # Get relative path replacement
            rel = full[len(root):].replace(chr(92), '/').strip('/')
            target = os.path.join(root, rel)
            os.makedirs(os.path.dirname(target), exist_ok=True)
            try:
                shutil.move(full, target)
                print(f"Moved: {full} -> {target}")
            except Exception as e:
                print(f"Failed to move {full}: {e}")
`;

    await ssh.execCommand(`echo "${pyScript.replace(/"/g, '\\"')}" > /tmp/fix.py`);
    const res = await ssh.execCommand('python3 /tmp/fix.py');
    console.log(res.stdout || res.stderr);
    await ssh.execCommand('rm -f /tmp/fix.py');

    // Clean up empty directories with backslashes
    await ssh.execCommand("find /root/esc/public/_media -depth -type d -name '*\\\\*' -exec rm -rf {} +");
    console.log('Cleaned up backslash folders.');
    
    ssh.dispose();
  } catch (e) {
    console.error(e);
    ssh.dispose();
  }
}
run();
