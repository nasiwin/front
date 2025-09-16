import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifySensible from '@fastify/sensible'
import { env } from './env.js'
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

app.get('/health', async () => ({ status: 'ok' }))

const port = env.port
const host = env.host

try {
  await app.listen({ port, host })
  app.log.info(`Server started on http://${host}:${port}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}


