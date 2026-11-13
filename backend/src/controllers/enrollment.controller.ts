
import { Request, Response } from 'express'
import prisma from '../config/prisma.js'

interface AuthRequest extends Request {
  user?: {
    userId: string
    role: string
  }
}

// Enroll a student in a course
export const enrollInCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.body
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required',
      })
    }

    if (req.user?.role !== 'STUDENT') {
      return res.status(403).json({
        success: false,
        message: 'Only students can enroll in courses',
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

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: String(courseId),
        },
      },
    })

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: 'Already enrolled in this course',
      })
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId: String(courseId),
      },
      include: {
        course: true,
      },
    })

    return res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: enrollment,
    })
  } catch (error) {
    console.error('Course enrollment error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to enroll in course',
    })
  }
}

export const getMyEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: true,
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    })

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    })
  } catch (error) {
    console.error('Get enrollments error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve enrollments',
    })
  }
}
