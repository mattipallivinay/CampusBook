import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import prisma from './config/prisma.js'
import userRoutes from './routes/user.routes.js'
import courseRoutes from './routes/course.routes.js'
import enrollmentRoutes from './routes/enrollment.routes.js'
import resourceRoutes from './routes/resource.routes.js'
import conversationRoutes from './routes/conversation.routes.js'
import marketplaceRoutes from './routes/marketplace.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// Middleware
app.use(helmet())
app.use(cors({
    origin: FRONTEND_URL,
}))
app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/conversations', conversationRoutes)
app.use('/api/marketplace', marketplaceRoutes)
app.use('/api/dashboard', dashboardRoutes)


// Health check API
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusBook API is running successfully!',
    timestamp: new Date().toISOString(),
  })
})

// Start server
async function startServer() {
  try {
    await prisma.$connect()
    console.log('CampusBook database connected successfully!')

    app.listen(PORT, () => {
      console.log(`CampusBook API running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

startServer()