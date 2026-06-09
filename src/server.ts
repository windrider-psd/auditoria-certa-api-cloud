import fastifyCors from "@fastify/cors"
import autoLoad from '@fastify/autoload'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import jwt from '@fastify/jwt'
import { fastify, FastifyReply, FastifyRequest } from "fastify"
import SessionService from "./services/SessionService.js"
import auth from "./plugins/auth.js"
import { ProcessQuery } from "./utils/requestutils.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


const server = fastify({
    logger: true
})

server.register(fastifyCors, {
    origin: '*',
    methods:["GET", "POST", "PUT", "DELETE", "OPTIONS"]
})

/*
server.register(jwt, {
    secret: EnvVars.JwtSecret
})
*/


server.addHook("preHandler", async (req, reply) => {
    ProcessQuery(req.query)
    const auth = req.headers.authorization;

    if (auth != undefined) {
        if (!auth.startsWith('Bearer ')) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }

        const token = auth.split(' ')[1];
        const session = await SessionService.ValidateSessionToken(token)

        if (session) {
            req.session = session
        }
    }
})

server.decorate("authenticate", async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.session == null) {
        return reply.status(401).send({ error: 'Invalid or expired token' });
    }
})

server.register(autoLoad, {
    dir: join(__dirname, 'routes'),
    maxDepth:1
})



export default server