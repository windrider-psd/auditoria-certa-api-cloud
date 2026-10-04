import { FastifyInstance } from "fastify"
import {dirname, join} from "path"
import { fileURLToPath } from 'node:url'
import autoLoad from '@fastify/autoload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default (fastify: FastifyInstance) => {
  fastify.register(autoLoad, {
      dir: join(__dirname, 'local'),
      prefix: "/local",
  })
  console.log(fastify.printRoutes())

}