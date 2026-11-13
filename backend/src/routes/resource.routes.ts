
import { Router } from 'express'
import {
  createResource,
  getAllResources,
  getResourcesByCourse,
  getMyResources,
} from '../controllers/resource.controller.js'

import { authenticateToken } from '../middleware/auth.middleware.js'
import { authorizeRoles } from '../middleware/role.middleware.js'
import upload from '../middleware/upload.middleware.js'

const router = Router()

// Faculty and Admin can upload resources
router.post(
  '/',
  authenticateToken,
  authorizeRoles('FACULTY', 'ADMIN'),
  upload.single('file'),
  createResource
)

// Authenticated users can view resources
router.get('/', authenticateToken, getAllResources)

router.get(
  '/course/:courseId',
  authenticateToken,
  getResourcesByCourse
)
router.get(
  '/my-resources',
  authenticateToken,
  authorizeRoles('FACULTY'),
  getMyResources
)

export default router
