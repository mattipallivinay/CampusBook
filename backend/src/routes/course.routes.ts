
import { Router } from 'express'
import {
  createCourse,
  getAllCourses,
  getCourseById,
} from '../controllers/course.controller.js'

import { authenticateToken } from '../middleware/auth.middleware.js'
import { authorizeRoles } from '../middleware/role.middleware.js'

const router = Router()

// Admin only
router.post(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN'),
  createCourse
)

// Authenticated users
router.get('/', authenticateToken, getAllCourses)
router.get('/:id', authenticateToken, getCourseById)

export default router
