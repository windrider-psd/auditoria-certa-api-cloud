import 'fastify'
import '@fastify/jwt'
import { UserSession } from './services/SessionService.ts'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any
  }

  interface FastifyRequest {
    session: UserSession
  }
}


