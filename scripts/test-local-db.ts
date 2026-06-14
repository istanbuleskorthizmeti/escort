import { Client } from 'pg';

async function testDb() {
  const client = new Client({
    connectionString: 'postgresql://vuc2026_user:vuc2026_pass@127.0.0.1:5432/vuc2026?sslmode=disable'
  });

  try {
    await client.connect();
    console.log('✅ Connected to local PostgreSQL database!');
    
    // Check tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in database:', res.rows.map(r => r.table_name));

    // Check SystemSetting table
    const settingsRes = await client.query('SELECT key FROM "SystemSetting"');
    console.log('Settings keys:', settingsRes.rows.map(r => r.key));

    await client.end();
  } catch (err: any) {
    console.error('❌ Failed to connect to local DB:', err.message);
  }
}

testDb();
