import { FastifyInstance } from "fastify";
import { hash, verify } from '@node-rs/argon2';
import { Static, Type } from '@sinclair/typebox'
import SessionService from "../services/SessionService.js";
import { GetLogin, Login } from "../services/AuthService.js";
import { UserLogin } from "../db/types.js";

const LoginSchema = Type.Object({
  user: Type.String(),
  password: Type.String(),
  storeToken: Type.String()
})

type LoginSchemaType = Static<typeof LoginSchema>


export default (fastify: FastifyInstance) => {
  fastify.post<{
    Body: LoginSchemaType
  }>('/login', {
    schema: {
      body: LoginSchema
    }
  }, async (req, res) => {
    const login = await Login({
      username: req.body.user,
      password: req.body.password,
      storeToken: req.body.storeToken
    })

    if (login) {
      const token = SessionService.GenerateSessionToken()
      await SessionService.CreateSession(token, login)

      //@ts-ignore
      delete login.user.password

      return { login, token }
    }

    return res.code(401).send({message: "Usuário e senha inválidos"})
  })

  fastify.get('/login', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const user = await GetLogin(request.session.userId)
    if(user){
      return user.toJSON()
    }
    reply.code(401).send({message: "Necessário login"})
  })

  fastify.delete("/login", { preHandler: [fastify.authenticate] }, async (req, reply) => {
    await SessionService.InvalidateSession(req.session.sessionId, req.session.userId)
    return {

    }
  })
}

export const autoPrefix = "/auth"