import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  console.log('Initializing PrismaClient...');
  
  if (!process.env.DATABASE_URL) {
    const errorMessage = 'Error: DATABASE_URL is not set in environment variables. The application cannot connect to the database.';
    console.error(errorMessage);
    // In production/build, we want to fail hard if this is missing
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMessage);
    }
  } else {
    console.log('DATABASE_URL: Loaded');
  }

  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
