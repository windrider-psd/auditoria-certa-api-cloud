import { FastifyInstance } from "fastify"
import { MakeWsRequest } from "../../wsserver.js"

export default (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", fastify.authenticate)
  fastify.get<{
    Querystring: { query: string }
  }>('/local/products/query', {
  }, async (req, res) => {
    const token = req.session.storeToken
        
        const response = await MakeWsRequest(token, {
          method: "GET",
          url: "/products/query?query=" + req.query.query,
        })
        if (response.payload.status >= 400) {
          return res.code(response.payload.status).send({ message: response.payload.error || "Erro ao criar auditoria" })
        }
        else {
          return response.payload.body
        }
  })
}
