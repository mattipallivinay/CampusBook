
import { Router } from 'express'
import {
  enrollInCourse,
  getMyEnrollments,
} from '../controllers/enrollment.controller.js'

import { authenticateToken } from '../middleware/auth.middleware.js'
import { authorizeRoles } from '../middleware/role.middleware.js'

const router = Router()

router.post(
  '/',
  authenticateToken,
  authorizeRoles('STUDENT'),
  enrollInCourse
)

router.get(
  '/my-courses',
  authenticateToken,
  authorizeRoles('STUDENT'),
  getMyEnrollments
)

export default router
