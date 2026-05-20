import mongoose from 'mongoose'
import { MONGO_URI } from './env.js'

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('🗄️   MongoDB conectado')
  } catch (err) {
    console.error('❌  Error al conectar MongoDB:', err.message)
    process.exit(1)
  }
}