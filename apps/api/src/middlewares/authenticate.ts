import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma.js'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    reply.status(401).send({ error: 'Non authentifié' })
    return
  }

  const token = authHeader.slice(7)
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    reply.status(401).send({ error: 'Session expirée ou invalide' })
    return
  }

  request.user = { id: session.user.id, email: session.user.email }
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: { id: string; email: string }
  }
}
