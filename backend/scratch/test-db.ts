import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing connection and query...');
  try {
    await prisma.$connect();
    console.log('Connected successfully!');
    const result = await prisma.$queryRaw`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    console.log('Tables in database:', result);
  } catch (error) {
    console.error('Operation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
