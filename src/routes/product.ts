import { FastifyInstance } from "fastify"
import { GetCloudProductByCode, QueryCloudProduct, UpdateCloudProductEan } from "../services/ProductService.js"

export default (fastify: FastifyInstance) => {
    fastify.addHook("preHandler", fastify.authenticate)
    fastify.get<{
      Querystring: { query: string }
    }>('/query', {
    }, async (req, res) => {
      const query = req.query.query
      return await QueryCloudProduct(query, req.session.company.token)
    })

    fastify.get<{
      Params: { id: string }
    }>('/by-code/:id', {
    }, async (req, res) => {
      const query = req.params.id
      
      return await GetCloudProductByCode(query, req.session.company.token)
    })

    fastify.put<{
      Params: { id: string },
      Body: { ean: string }
    }>('/update-ean/:id', {
    }, async (req, res) => {
      const query = req.params.id
      const { ean } = req.body

      return await UpdateCloudProductEan(query, ean, req.session.company.token)
    })
}

export const autoPrefix = "/products"