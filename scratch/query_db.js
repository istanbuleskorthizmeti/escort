const { NodeSSH } = require("node-ssh");
const ssh = new NodeSSH();
(async () => {
  try {
    await ssh.connect({
      host: "187.77.111.203",
      username: "root",
      password: "Z4-nN8JfiUIh5,;g"
    });
    const check = await ssh.execCommand('docker exec -i vuc2026-db psql -U vuc2026_user -d vuc2026 -c "SELECT count(1) from \\\"PageContent\\\";"');
    console.log("Count is:", check.stdout.trim());
    
    const sample = await ssh.execCommand('docker exec -i vuc2026-db psql -U vuc2026_user -d vuc2026 -c "SELECT slug, \\\"siteId\\\" from \\\"PageContent\\\" LIMIT 10;"');
    console.log("Sample rows:\n", sample.stdout.trim());
  } catch (err) {
    console.error(err);
  } finally {
    ssh.dispose();
  }
})();
