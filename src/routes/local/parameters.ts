import { FastifyInstance } from "fastify"
import { MakeWsRequest } from "../../wsserver.js"

export default (fastify: FastifyInstance) => {
   fastify.addHook("preHandler", fastify.authenticate)
  fastify.get('/parameters', {
  }, async (req, res) => {

    const token = req.session.storeToken
    
    const response = await MakeWsRequest(token, {
      method: "GET",
      url: "/parameters",
    })

    if (response.payload.status >= 400) {
      return res.code(response.payload.status).send({ message: response.payload.error || "Erro ao criar auditoria" })
    }
    else {
      return response.payload.body
    }
  })
}