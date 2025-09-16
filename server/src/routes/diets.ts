import { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { DietService } from '../services/diet-service.js'
import { resolveUserId } from '../utils/user.js'

export const dietRoutes: FastifyPluginAsync = async (app) => {
  app.get('/api/diets', async (req, reply) => {
    const userId = await resolveUserId(req)
    const data = await DietService.listDiets(userId)
    return data
  })

  app.get('/api/users/me/diet', async (req, reply) => {
    const userId = await resolveUserId(req)
    const data = await DietService.getCurrentDiet(userId)
    return data
  })

  app.put('/api/users/me/diet', async (req, reply) => {
    const userId = await resolveUserId(req)
    const schema = z.object({
      dietId: z.string().min(1),
      goalWeightDelta: z.number().nullable().optional(),
      goalNotes: z.string().nullable().optional(),
    })
    const body = schema.parse(req.body)
    const updated = await DietService.switchDiet(userId, body.dietId, {
      goalWeightDelta: body.goalWeightDelta ?? null,
      goalNotes: body.goalNotes ?? null,
    })
    return updated
  })

  app.get('/api/diets/:dietId/summary', async (req, reply) => {
    const params = z.object({ dietId: z.string().min(1) }).parse(req.params)
    const data = await DietService.getDietSummary(params.dietId)
    return data
  })
}

export default dietRoutes


