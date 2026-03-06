import { Client } from 'pg';

const client = new Client({
  user: 'postgres',
  password: 'password',
  host: 'localhost',
  port: 5432,
  database: 'postgres',
});

async function createDB() {
  await client.connect();

  const dbName = 'TaskOrbit';

  const res = await client.query(
    `SELECT 1 FROM pg_database WHERE datname='${dbName}'`,
  );

  if (res.rowCount === 0) {
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log('Database created:', dbName);
  } else {
    console.log('Database already exists');
  }

  await client.end();
}

createDB();
