import { FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma.js'

export async function resolveUserId(req: FastifyRequest): Promise<string> {
  const existing = (req as any).userId as string | undefined
  if (existing) return existing
  const headerId = (req.headers['x-user-id'] as string) || 'demo-telegram-1'
  const user = await prisma.user.upsert({
    where: { telegramId: headerId },
    update: {},
    create: { telegramId: headerId, name: 'Гость' },
  })
  ;(req as any).userId = user.id
  return user.id
}


