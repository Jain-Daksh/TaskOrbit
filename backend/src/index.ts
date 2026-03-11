import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import cors from 'cors';
import router from './routes/index.route';
const { Pool } = pg;

import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://task-orbit-nu.vercel.app',
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(router);
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
