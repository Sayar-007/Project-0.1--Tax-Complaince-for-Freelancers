import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  console.log('Initializing PrismaClient...');
  
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not set in environment variables. Prisma Client will fail to connect.');
  } else {
    console.log('DATABASE_URL: Found (length: ' + process.env.DATABASE_URL.length + ')');
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
