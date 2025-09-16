import { FastifyPluginAsync } from 'fastify'
import { prisma } from '../lib/prisma.js'

// Dev-заглушка аутентификации: берем userId из заголовка x-user-id или фиксированный демо
export const authDevPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (req, reply) => {
    const headerId = (req.headers['x-user-id'] as string) || 'demo-telegram-1'
    // Находим/создаем пользователя с telegramId=headerId
    const user = await prisma.user.upsert({
      where: { telegramId: headerId },
      update: {},
      create: { telegramId: headerId, name: 'Гость' },
    })
    ;(req as any).userId = user.id
  })
}

export default authDevPlugin


