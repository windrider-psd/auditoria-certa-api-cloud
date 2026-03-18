import { FastifyInstance } from "fastify"
export const autoPrefix = "/test"
export default (fastify: FastifyInstance) => {
  fastify.get('/ping', async (request, reply) => {
    return "pong"
  })
}