import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import SessionService from "../services/SessionService.js";
export default (fastify: FastifyInstance) => {

    fastify.addHook("preHandler", async (req, reply) => {
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
}