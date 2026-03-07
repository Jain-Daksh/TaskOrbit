import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env');
}

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// prisma adapter
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});
const SALT_ROUNDS = 10;
const SECRET = process.env.PASSWORD_SECRET || '';

async function hashPassword(password: string) {
  return bcrypt.hash(password + SECRET, SALT_ROUNDS);
}

async function main() {
  await prisma.$transaction(async (tx) => {
    // 1️⃣ Create tiers
    const tiers = await tx.tier.createManyAndReturn({
      data: [
        { name: 'Tier 1', price: 10 },
        { name: 'Tier 2', price: 20 },
        { name: 'Tier 3', price: 30 },
      ],
    });

    // 2️⃣ Create roles
    const roles = await tx.role.createManyAndReturn({
      data: [{ name: 'Admin' }, { name: 'Member' }],
    });

    const adminRole = roles.find((r) => r.name === 'Admin');
    const memberRole = roles.find((r) => r.name === 'Member');

    // 3️⃣ Hash password
    const hashedPassword = await hashPassword('123456');

    // 4️⃣ Create users
    const users = await tx.user.createManyAndReturn({
      data: [
        { name: 'User 1', email: 'user1@test.com', password: hashedPassword },
        { name: 'User 2', email: 'user2@test.com', password: hashedPassword },
        { name: 'User 3', email: 'user3@test.com', password: hashedPassword },
        { name: 'User 4', email: 'user4@test.com', password: hashedPassword },
        { name: 'User 5', email: 'user5@test.com', password: hashedPassword },
        { name: 'User 6', email: 'user6@test.com', password: hashedPassword },
      ],
    });

    // 5️⃣ Create workspaces
    const workspace1 = await tx.workspace.create({
      data: {
        name: 'Workspace 1',
        tierId: tiers[0]!.id,
        ownerId: users[0]!.id,
      },
    });

    const workspace2 = await tx.workspace.create({
      data: {
        name: 'Workspace 2',
        tierId: tiers[1]!.id,
        ownerId: users[1]!.id,
      },
    });

    // 6️⃣ Workspace members
    await tx.workspaceMember.createMany({
      data: [
        {
          workspaceId: workspace1.id,
          userId: users[0]!.id,
          roleId: adminRole!.id,
        },
        {
          workspaceId: workspace1.id,
          userId: users[1]!.id,
          roleId: memberRole!.id,
        },
        {
          workspaceId: workspace1.id,
          userId: users[2]!.id,
          roleId: memberRole!.id,
        },

        {
          workspaceId: workspace2.id,
          userId: users[3]!.id,
          roleId: adminRole!.id,
        },
        {
          workspaceId: workspace2.id,
          userId: users[4]!.id,
          roleId: memberRole!.id,
        },
        {
          workspaceId: workspace2.id,
          userId: users[5]!.id,
          roleId: memberRole!.id,
        },
      ],
    });
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
