import { FastifyInstance } from "fastify"
import { QueryCloudProduct } from "../services/ProductService.js"

export default (fastify: FastifyInstance) => {
   fastify.addHook("preHandler", fastify.authenticate)
  fastify.get<{
    Querystring: { query: string }
  }>('/query', {
  }, async (req, res) => {
    const query = req.query.query
    return await QueryCloudProduct(query, req.session.company.token)
  })
}

export const autoPrefix = "/products"