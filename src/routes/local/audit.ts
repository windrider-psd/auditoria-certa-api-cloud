import { FastifyInstance } from "fastify"
import { CreateAuditArgs } from "../../db/types.js"
import { CreateAudit } from "../../services/AuditService.js"
import { MakeWsRequest } from "../../wsserver.js"

export default (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", fastify.authenticate)
  fastify.post('/', {
  }, async (req, res) => {
    const args = req.body as CreateAuditArgs
    const token = req.session.storeToken

    const response = await MakeWsRequest(token, {
      method: "POST",
      url: "/audits",
      body: args
    })

    if (response.payload.status >= 400) {
      return res.code(response.payload.status).send({ message: response.payload.error || "Erro ao criar auditoria" })
    }
    else {
      return response.payload.body
    }


  })
}