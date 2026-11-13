
import { Request, Response, NextFunction } from 'express'

type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN'

interface AuthRequest extends Request {
  user?: {
    userId: string
    role: string
  }
}

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
      })
    }

    next()
  }
}
