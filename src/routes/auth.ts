import { FastifyInstance } from "fastify";
import { Static, Type } from '@sinclair/typebox'
import SessionService from "../services/SessionService.js";
import { GetLogin, Login, PreLogin } from "../services/AuthService.js";
import { isStoreAuthenticated } from "../wsserver.js";

const LoginSchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
  storeToken: Type.String()
})

const PreLoginSchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
})

type LoginSchemaType = Static<typeof LoginSchema>

type PreLoginSchemaType = Static<typeof PreLoginSchema>

export default (fastify: FastifyInstance) => {

fastify.get<{
    Querystring: PreLoginSchemaType
  }>('/prelogin', {
    schema: {
      querystring: PreLoginSchema
    }
  }, async (req, res) => {
    const companies = await PreLogin({
      username: req.query.username,
      password: req.query.password,
    })
    
    if (companies != null) {
      const comp =  companies.map(c=>c.toJSON())

      for(const c of comp){
        // @ts-ignore
        c.stores = c.stores.filter(s =>{
          return isStoreAuthenticated(s.storeToken)
        })
      }

      return comp
    }
    else{
      return res.code(401).send({message: "Usuário e senha inválidos"})
    }

    
  })

  fastify.post<{
    Body: LoginSchemaType
  }>('/login', {
    schema: {
      body: LoginSchema
    }
  }, async (req, res) => {
    const login = await Login({
      username: req.body.username,
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