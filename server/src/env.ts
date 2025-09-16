import dotenv from 'dotenv'
dotenv.config()

export const env = {
  port: Number(process.env.PORT ?? 3000),
  host: process.env.HOST ?? '0.0.0.0',
  corsOrigin: (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(','),
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/dietscan',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
}


