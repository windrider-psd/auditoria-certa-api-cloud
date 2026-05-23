import { FastifyInstance } from "fastify"
import {join} from "path"
import autoLoad from '@fastify/autoload'

export default (fastify: FastifyInstance) => {
  fastify.register(autoLoad, {
      dir: join(__dirname, 'local'),
      prefix: "/local",
  })
}