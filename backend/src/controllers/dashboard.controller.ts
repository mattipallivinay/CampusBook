import { Response } from 'express'
import prisma from '../config/prisma.js'
import type { AuthRequest } from '../middleware/auth.middleware.js'

export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      })
    }

    const [
      totalStudents,
      totalFaculty,
      totalResources,
      totalListings,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'FACULTY' } }),
      prisma.resource.count(),
      prisma.marketplaceListing.count(),
    ])

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalFaculty,
        totalResources,
        totalListings,
      },
    })
  } catch (error) {
    console.error('Admin dashboard stats error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin statistics',
    })
  }
}

export const getFacultyStats = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.userId

    if (!facultyId || req.user?.role !== 'FACULTY') {
      return res.status(403).json({
        success: false,
        message: 'Faculty access required',
      })
    }

    const [
      uploadedResources,
      totalListings,
    ] = await Promise.all([
      prisma.resource.count({
        where: { uploadedBy: facultyId },
      }),
      prisma.marketplaceListing.count({
        where: { sellerId: facultyId },
      }),
    ])

    return res.status(200).json({
      success: true,
      data: {
        uploadedResources,
        totalListings,
      },
    })
  } catch (error) {
    console.error('Faculty dashboard stats error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve faculty statistics',
    })
  }
}

export const getStudentStats = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.userId

    if (!studentId || req.user?.role !== 'STUDENT') {
      return res.status(403).json({
        success: false,
        message: 'Student access required',
      })
    }

    const [
      enrolledCourses,
      studyResources,
      aiInteractions,
      marketplaceListings,
    ] = await Promise.all([
        prisma.enrollment.count({
            where: { userId: studentId },
          }),
      prisma.resource.count(),
      prisma.aIMessage.count({
        where: {
          conversation: {
            userId: studentId,
          },
        },
      }),
      prisma.marketplaceListing.count({
        where: { sellerId: studentId },
      }),
    ])

    return res.status(200).json({
      success: true,
      data: {
        enrolledCourses,
        studyResources,
        aiInteractions,
        marketplaceListings,
      },
    })
  } catch (error) {
    console.error('Student dashboard stats error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve student statistics',
    })
  }
}
