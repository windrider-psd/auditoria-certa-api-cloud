import { FastifyInstance } from "fastify"
export default (fastify: FastifyInstance) => {
  fastify.get('/ping', async (request, reply) => {
    return "pong local"
  })
}