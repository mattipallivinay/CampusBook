
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    role: string
  }
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization header',
      })
    }

    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new Error('JWT_SECRET is not configured')
    }

    const decoded = jwt.verify(token, secret) as {
      userId: string
      role: string
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    }

    next()
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    })
  }
}
