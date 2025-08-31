import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { join } from 'path';
import { beforeAll, beforeEach, afterEach, afterAll } from 'vitest';


const generateDatabaseURL = (): string => {
  if (!process.env.DATABASE_URL_TESTING) {
    throw new Error('Please provide a database URL.');
  }

  let url = process.env.DATABASE_URL_TESTING;

  // Mengganti nama database dari 'neondb' menjadi 'testingDb'
  url = url.replace('/neondb', '/testingDb');
  return url;
};

const prismaBinary = join(__dirname, '..', '..', 'node_modules', '.bin', 'prisma');

// Generate URL database untuk testing
const url = generateDatabaseURL();
process.env.DATABASE_URL_TESTING = url;

const prisma = new PrismaClient({
  datasources: { db: { url } },
});

// Setup database sebelum semua pengujian
beforeAll(async () => {
  execSync(`${prismaBinary} db push`, {
    env: {
      ...process.env,
      DATABASE_URL_TESTING: url,
    },
  });
});

// Bersihkan data sebelum setiap pengujian
beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.token.deleteMany();
});

// Bersihkan database setelah semua pengujian selesai
afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS "testingDb"`);
  await prisma.$disconnect();
});

export default prisma;
