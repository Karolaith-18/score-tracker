import 'dotenv/config'

const required = ['MONGO_URI']
required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌  Variable de entorno requerida no definida: ${key}`)
    process.exit(1)
  }
})

export const PORT         = Number(process.env.PORT) || 3001
export const NODE_ENV     = process.env.NODE_ENV     || 'development'
export const IS_PROD      = NODE_ENV === 'production'
export const MONGO_URI    = process.env.MONGO_URI
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'