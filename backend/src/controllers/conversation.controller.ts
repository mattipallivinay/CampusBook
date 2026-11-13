
import { Request, Response } from 'express'
import prisma from '../config/prisma.js'
import axios from 'axios'

interface AuthRequest extends Request {
  user?: {
    userId: string
    role: string
  }
}

// Create a new conversation
export const createConversation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId
    const { title, documentId } = req.body

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    const conversation = await prisma.aIConversation.create({
      data: {
        userId,
        title: title?.trim() || 'New Chat',
        documentId: documentId || null,
      },
    })

    return res.status(201).json({
      success: true,
      conversation,
    })
  } catch (error) {
    console.error('Create conversation error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to create conversation',
    })
  }
}

// Get all conversations belonging to the logged-in user
export const getConversations = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    const conversations = await prisma.aIConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return res.status(200).json({
      success: true,
      conversations,
    })
  } catch (error) {
    console.error('Get conversations error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversations',
    })
  }
}

// Get one conversation with its messages
export const getConversationById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId
    const id = req.params.id

    if (typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid conversation ID',
      })
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    const conversation = await prisma.aIConversation.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      })
    }

    return res.status(200).json({
      success: true,
      conversation,
    })
  } catch (error) {
    console.error('Get conversation error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve conversation',
    })
  }
}

// Delete a conversation
export const deleteConversation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId
    const id = req.params.id

if (typeof id !== 'string') {
  return res.status(400).json({
    success: false,
    message: 'Invalid conversation ID',
  })
}

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    const result = await prisma.aIConversation.deleteMany({
      where: {
        id,
        userId,
      },
    })

    if (result.count === 0) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully',
    })
  } catch (error) {
    console.error('Delete conversation error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to delete conversation',
    })
  }
}

export const sendMessage = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId
    const id = req.params.id
    const { question } = req.body

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    if (typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid conversation ID',
      })
    }

    if (typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Question is required',
      })
    }

    const conversation = await prisma.aIConversation.findFirst({
      where: { id, userId },
    })

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      })
    }

    if (!conversation.documentId) {
      return res.status(400).json({
        success: false,
        message: 'No document is associated with this conversation',
      })
    }

    const userMessage = await prisma.aIMessage.create({
      data: {
        conversationId: id,
        role: 'USER',
        content: question.trim(),
      },
    })

    try {
      const aiResponse = await axios.post(
        `${process.env.AI_SERVICE_URL || 'http://localhost:8000'}/api/ai/ask`,
        {
          question: question.trim(),
          document_id: conversation.documentId,
        },
        { timeout: 120000 }
      )

      const answer = aiResponse.data?.data?.answer

      if (typeof answer !== 'string' || !answer.trim()) {
        throw new Error('AI service returned an invalid answer')
      }

      const assistantMessage = await prisma.aIMessage.create({
        data: {
          conversationId: id,
          role: 'ASSISTANT',
          content: answer,
        },
      })

      await prisma.aIConversation.update({
        where: { id },
        data: {
          updatedAt: new Date(),
          ...(conversation.title === 'New Chat'
            ? { title: question.trim().slice(0, 60) }
            : {}),
        },
      })

      return res.status(200).json({
        success: true,
        messages: [userMessage, assistantMessage],
        answer,
        sources: aiResponse.data?.data?.sources || [],
      })
    } catch (aiError) {
      console.error('AI service error:', aiError)

      return res.status(502).json({
        success: false,
        message: 'AI service could not generate a response. Please try again.',
        userMessage,
      })
    }
  } catch (error) {
    console.error('Send message error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to send message',
    })
  }
}
