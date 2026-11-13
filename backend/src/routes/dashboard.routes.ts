import { Router } from 'express'
import {
  getAdminStats,
  getFacultyStats,
  getStudentStats,
} from '../controllers/dashboard.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { authorizeRoles } from '../middleware/role.middleware.js'

const router = Router()

router.use(authenticateToken)

router.get('/admin', authorizeRoles('ADMIN'), getAdminStats)
router.get('/faculty', authorizeRoles('FACULTY'), getFacultyStats)
router.get('/student', authorizeRoles('STUDENT'), getStudentStats)

export default router