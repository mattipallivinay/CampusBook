
import { Request, Response } from 'express'
import prisma from '../config/prisma.js'
import { uploadToCloudinary } from '../services/cloudinary.service.js'

interface AuthRequest extends Request {
  user?: {
    userId: string
    role: string
  }
}

// Upload resource details (FACULTY or ADMIN)

export const createResource = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, type, courseId } = req.body
    const userId = req.user?.userId
    const file = req.file

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    if (!title || !type || !courseId || !file) {
      return res.status(400).json({
        success: false,
        message: 'Title, type, course ID, and file are required',
      })
    }

    const allowedTypes = [
      'PDF',
      'PPT',
      'NOTES',
      'ASSIGNMENT',
      'QUESTION_PAPER',
      'OTHER',
    ]

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource type',
      })
    }

    const course = await prisma.course.findUnique({
      where: { id: String(courseId) },
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      })
    }

    const uploadedFile = await uploadToCloudinary(file)

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        type,
        fileUrl: uploadedFile.url,
        fileName: file.originalname,
        uploadedBy: userId,
        courseId: String(courseId),
      },
    })

    return res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully',
      data: resource,
    })
  } catch (error) {
    console.error('Create resource error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to upload resource',
    })
  }
}


// Get all resources
export const getAllResources = async (_req: Request, res: Response) => {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        course: true,
        uploader: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    })
  } catch (error) {
    console.error('Get resources error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve resources',
    })
  }
}

// Get resources for a specific course
export const getResourcesByCourse = async (req: Request, res: Response) => {
  try {
    const resources = await prisma.resource.findMany({
      where: {
        courseId: String(req.params.courseId),
      },
      include: {
        course: true,
        uploader: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    })
  } catch (error) {
    console.error('Get course resources error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve course resources',
    })
  }
}

export const getMyResources = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    const resources = await prisma.resource.findMany({
      where: {
        uploadedBy: userId,
      },
      include: {
        course: true,
        uploader: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    })
  } catch (error) {
    console.error('Get my resources error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve your resources',
    })
  }
}
