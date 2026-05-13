import { FastifyInstance } from "fastify"
import { QueryCloudProduct } from "../services/ProductService.js"
import { CreateAuditArgs } from "../db/types.js"
import { CreateAudit } from "../services/AuditService.js"

export default (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", fastify.authenticate)
  fastify.post('/', {
  }, async (req, res) => {
    const args = req.body as CreateAuditArgs

    return await CreateAudit(req.session.user, args)
  })
}

export const autoPrefix = "/audits"