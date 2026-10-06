import { FastifyInstance } from "fastify"
import { QueryCloudProduct } from "../services/ProductService.js"
import { CreateAuditArgs } from "../db/types.js"
import { CreateAudit, GetAuditByStoreCode } from "../services/AuditService.js"

export default (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", fastify.authenticate)
  fastify.post('/', {
  }, async (req, res) => {
    const args = req.body as CreateAuditArgs

    return await CreateAudit(req.session.user, args)
  })

  fastify.post<{
    Params:{storeCode:string},
    Body:{start:string, end:string}
  }>("/by-store/:storeCode", async (req, res)=>{
    const result = await GetAuditByStoreCode(req.params.storeCode, new Date(req.body.start), new Date(req.body.end))
    return result
  })
}

export const autoPrefix = "/audits"