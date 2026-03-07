import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// create postgres pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// prisma adapter
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

app.get('/', async (req, res) => {
  try {
    const tiers = await prisma.tier.findMany();

    res.json({
      message: 'Server running 🚀',
      tiers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
