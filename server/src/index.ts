import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifySensible from '@fastify/sensible'
import { env } from './env.js'
import { events } from './lib/events.js'
import authDev from './plugins/auth-dev.js'
import dietRoutes from './routes/diets.js'

const app = fastify({ logger: true })

await app.register(fastifyCors, {
  origin: env.corsOrigin,
  credentials: true,
})
await app.register(fastifySensible)
await app.register(authDev)
await app.register(dietRoutes)

app.get('/', async () => ({
  name: 'DietScan API',
  status: 'ok',
  endpoints: {
    health: '/health',
    diets: '/api/diets',
    currentDiet: '/api/users/me/diet',
    switchDiet: 'PUT /api/users/me/diet',
  },
}))

app.get('/health', async () => ({ status: 'ok' }))

const port = env.port
const host = env.host

try {
  await app.listen({ port, host })
  app.log.info(`Server started on http://${host}:${port}`)

  // Пример подписки: логируем событие смены диеты (вместо реального брокера)
  events.on('diet.changed', (p) => app.log.info({ event: 'diet.changed', ...p }))
} catch (err) {
  app.log.error(err)
  process.exit(1)
}


