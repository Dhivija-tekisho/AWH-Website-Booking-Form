import { createHmac } from 'node:crypto'
import type { IncomingMessage } from 'node:http'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'

function base64Url(value: string | Buffer): string {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function signServiceToken(secret: string, organizationId: string): string {
  const now = Math.floor(Date.now() / 1000)
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = base64Url(
    JSON.stringify({
      sub: 'ai-service',
      organizationId,
      iat: now,
      exp: now + 300,
    }),
  )
  const signature = createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')

  return `${header}.${payload}.${signature}`
}

async function readRequestBody(req: IncomingMessage): Promise<Buffer | undefined> {
  const chunks: Buffer[] = []

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  if (!chunks.length) return undefined
  return Buffer.concat(chunks)
}

function dhpProxyPlugin(env: Record<string, string>): PluginOption {
  const coreApiBaseUrl = env.DHP_CORE_API_URL || 'http://localhost:3000'
  const serviceTokenSecret = env.DHP_SERVICE_TOKEN_SECRET || ''
  const organizationId = env.DHP_ORGANIZATION_ID || '30000000-0000-0000-0000-000000000001'

  return {
    name: 'dhp-core-proxy',
    configureServer(server) {
      server.middlewares.use('/api/dhp', async (req, res, next) => {
        if (!req.url) {
          next()
          return
        }

        if (!serviceTokenSecret) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error:
                'Missing DHP_SERVICE_TOKEN_SECRET in the frontend environment. The dev proxy cannot authenticate to core-api without it.',
            }),
          )
          return
        }

        try {
          const upstreamUrl = new URL(req.url.replace(/^\/?/, ''), `${coreApiBaseUrl.replace(/\/$/, '')}/`)
          const body = await readRequestBody(req)
          const token = signServiceToken(serviceTokenSecret, organizationId)
          const headers = new Headers()

          for (const [key, value] of Object.entries(req.headers)) {
            if (!value || key === 'host' || key === 'content-length' || key === 'authorization') {
              continue
            }

            if (Array.isArray(value)) {
              headers.set(key, value.join(','))
            } else {
              headers.set(key, value)
            }
          }

          headers.set('Authorization', `Bearer ${token}`)

          const upstreamRes = await fetch(upstreamUrl, {
            method: req.method,
            headers,
            body,
          })

          res.statusCode = upstreamRes.status

          upstreamRes.headers.forEach((value, key) => {
            if (key === 'content-encoding' || key === 'transfer-encoding') return
            res.setHeader(key, value)
          })

          const responseBody = Buffer.from(await upstreamRes.arrayBuffer())
          res.end(responseBody)
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown proxy error'
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: message }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const aiBaseUrl = env.VITE_AI_ORCHESTRATION_URL || 'http://localhost:3001'

  return {
    plugins: [react(), dhpProxyPlugin(env)],
    server: {
      port: 5000,
      proxy: {
        '/api/ai': {
          target: aiBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/ai/, '/v1/ai'),
        },
      },
    },
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
  }
})
