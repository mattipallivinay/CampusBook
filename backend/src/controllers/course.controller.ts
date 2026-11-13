
import { Request, Response } from 'express'
import prisma from '../config/prisma.js'

interface AuthRequest extends Request {
  user?: {
    userId: string
    role: string
  }
}

// Create a course (ADMIN only)
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, code, description, department, semester } = req.body

    if (!title || !code) {
      return res.status(400).json({
        success: false,
        message: 'Course title and code are required',
      })
    }

    const existingCourse = await prisma.course.findUnique({
      where: { code },
    })

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: 'Course code already exists',
      })
    }

    const course = await prisma.course.create({
      data: { title, code, description, department, semester },
    })

    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    })
  } catch (error) {
    console.error('Create course error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to create course',
    })
  }
}

// Get all courses
export const getAllCourses = async (_req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    })
  } catch (error) {
    console.error('Get courses error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve courses',
    })
  }
}

// Get a course by ID
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await prisma.course.findUnique({
        where: { id: String(req.params.id) },
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      })
    }

    return res.status(200).json({
      success: true,
      data: course,
    })
  } catch (error) {
    console.error('Get course error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve course',
    })
  }
}
