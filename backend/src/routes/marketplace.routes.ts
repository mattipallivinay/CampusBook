import { Router } from 'express'

import {
  getAllListings,
  createListing,
  getMyListings,
  updateListingStatus,
} from '../controllers/marketplace.controller.js'

import { authenticateToken } from '../middleware/auth.middleware.js'

const router = Router()

router.use(authenticateToken)

router.get('/', getAllListings)
router.post('/', createListing)
router.get('/my-listings', getMyListings)
router.patch('/:id/status', updateListingStatus)

export default router