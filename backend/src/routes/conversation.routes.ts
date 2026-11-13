
import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.middleware.js'
import {
    createConversation,
    getConversations,
    getConversationById,
    deleteConversation,
    sendMessage,
  } from '../controllers/conversation.controller.js'


const router = Router()

router.use(authenticateToken)

router.post('/', createConversation)
router.get('/', getConversations)
router.get('/:id', getConversationById)
router.delete('/:id', deleteConversation)
router.post('/:id/messages', sendMessage)

export default router
