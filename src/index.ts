import express from 'express'
const app = express()
import './config/postgres'
import './config/redis'

const { NODE_ENV } = process.env
const allowedOrigins: string[] = []
if (NODE_ENV === 'development' || NODE_ENV === 'staging') {
  allowedOrigins.push('http://localhost:8080', 'http://0.0.0.0:8080')
}

app.use((req, res, next) => {
  const { origin }: any = req.headers
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type')
  res.setHeader('Access-Control-Allow-Credentials', true.toString())

  next()
})

import bodyParser from 'body-parser'
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))

import cookieParser from 'cookie-parser'
app.use(cookieParser())

import { logRequests } from './helpers/logger'
app.use(logRequests())

import router from './routes'
app.use(router)

import swaggerUi from 'swagger-ui-express'
if (NODE_ENV === 'development') {
  const swaggerDocument = require('./config/swagger/index')
  router.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}

const PORT: number = parseInt(process.env.PORT as string) || 3000
const HOST: string = process.env.HOST || '0.0.0.0'
app.listen(PORT, HOST, () => {
  console.log('\x1b[36m%s\x1b[0m', `API URL: http://${HOST}:${PORT}`)
  console.log('\x1b[36m%s\x1b[0m', `Docs URL: http://${HOST}:${PORT}/api/docs`)
})
