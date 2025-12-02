import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  console.log('Initializing PrismaClient...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded' : 'Not Loaded');
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not set in environment variables.');
    // Optionally throw an error or handle it more gracefully
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
