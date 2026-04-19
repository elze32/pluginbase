import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import path from 'path'
import { authRoutes } from './routes/auth.js'
import { pluginRoutes } from './routes/plugins.js'
import { viewRoutes } from './routes/views.js'
import { scannerRoutes } from './routes/scanner.js'
import { adminRoutes } from './routes/admin.js'
import { masterRoutes } from './routes/master.js'
import { guideRoutes } from './routes/guides.js'

const PORT = Number(process.env.PORT) || 3001
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'

async function start(): Promise<void> {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    },
    bodyLimit: 10 * 1024 * 1024, // 10 MB
  })

  await fastify.register(cors, {
    origin: [CORS_ORIGIN, 'http://localhost:1420', 'tauri://localhost'],
    credentials: true,
  })

  await fastify.register(cookie)

  await fastify.register(multipart, {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  })

  await fastify.register(fastifyStatic, {
    root: path.join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
  })

  // Health check
  fastify.get('/health', async () => ({ status: 'ok', ts: new Date().toISOString() }))

  // Routes
  await fastify.register(authRoutes, { prefix: '/api/v1/auth' })
  await fastify.register(pluginRoutes, { prefix: '/api/v1/plugins' })
  await fastify.register(viewRoutes, { prefix: '/api/v1/views' })
  await fastify.register(scannerRoutes, { prefix: '/api/v1/scanner' })
  await fastify.register(adminRoutes, { prefix: '/api/v1/admin' })
  await fastify.register(masterRoutes, { prefix: '/api/v1/master' })
  await fastify.register(guideRoutes, { prefix: '/api/v1/guides' })

  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' })
    console.log(`API PluginBase en écoute sur http://localhost:${PORT}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
