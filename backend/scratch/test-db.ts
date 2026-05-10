import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing connection and query...');
  try {
    await prisma.$connect();
    console.log('Connected successfully!');
    const count = await prisma.user.count();
    console.log('User count:', count);
  } catch (error) {
    console.error('Operation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
