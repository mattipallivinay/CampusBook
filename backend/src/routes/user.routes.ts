
import { Router } from 'express'
import {
  getAllUsers,
  registerUser,
  loginUser,
  createFaculty,
  getMyProfile,
} from '../controllers/user.controller.js'
import { authenticateToken } from '../middleware/auth.middleware.js'
import { authorizeRoles } from '../middleware/role.middleware.js'

const router = Router()

router.get(
  '/',
  authenticateToken,
  authorizeRoles('ADMIN'),
  getAllUsers
)
router.get('/me', authenticateToken, getMyProfile)

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post(
    '/faculty',
    authenticateToken,
    authorizeRoles('ADMIN'),
    createFaculty
  )

export default router
