import { Request, Response } from 'express'
import prisma from '../config/prisma.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/jwt.js'
import type { AuthRequest } from '../middleware/auth.middleware.js'

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (error) {
    console.error('Get users error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
    })
  }
}
export const registerUser = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body
  
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email and password are required',
        })
      }
  
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must contain at least 8 characters',
        })
      }
  
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })
  
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email is already registered',
        })
      }
  
      const hashedPassword = await bcrypt.hash(password, 12)
  
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      })
  
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user,
      })
    } catch (error) {
      console.error('Registration error:', error)
      return res.status(500).json({
        success: false,
        message: 'Registration failed',
      })
    }
  }
  export const loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
  
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        })
      }
  
      const user = await prisma.user.findUnique({
        where: { email },
      })
  
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        })
      }
  
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password,
      )
  
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        })
      }
  
      const token = generateToken(user.id, user.role)
  
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      console.error('Login error:', error)
      return res.status(500).json({
        success: false,
        message: 'Login failed',
      })
    }
  }
  
  export const createFaculty = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body
  
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required',
        })
      }
  
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must contain at least 8 characters',
        })
      }
  
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })
  
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered',
        })
      }
  
      const hashedPassword = await bcrypt.hash(password, 12)
  
      const faculty = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'FACULTY',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      })
  
      return res.status(201).json({
        success: true,
        message: 'Faculty account created successfully',
        data: faculty,
      })
    } catch (error) {
      console.error('Create faculty error:', error)
  
      return res.status(500).json({
        success: false,
        message: 'Failed to create faculty account',
      })
    }
  }
  export const getMyProfile = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId
  
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        })
      }
  
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      })
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        })
      }
  
      return res.status(200).json({
        success: true,
        data: user,
      })
    } catch (error) {
      console.error('Get profile error:', error)
  
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile',
      })
    }
  }