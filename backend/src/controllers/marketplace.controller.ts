import { Request, Response } from 'express'
import prisma from '../config/prisma.js'
import type { AuthRequest } from '../middleware/auth.middleware.js'
export const getAllListings = async (req: Request, res: Response) => {
    try {
      const listings = await prisma.marketplaceListing.findMany({
        where: {
          status: 'AVAILABLE',
        },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
  
      return res.status(200).json({
        success: true,
        count: listings.length,
        data: listings,
      })
    } catch (error) {
      console.error('Get marketplace listings error:', error)
  
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch marketplace listings',
      })
    }
  }
  export const createListing = async (req: AuthRequest, res: Response) => {
    try {
      const { title, author, description, price, condition, imageUrl } = req.body
      const sellerId = req.user?.userId
  
      if (!sellerId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        })
      }
  
      if (!title || !author || price === undefined || !condition) {
        return res.status(400).json({
          success: false,
          message: 'Title, author, price, and condition are required',
        })
      }
  
      const numericPrice = Number(price)
  
      if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid price',
        })
      }
  
      const listing = await prisma.marketplaceListing.create({
        data: {
          title,
          author,
          description,
          price: numericPrice,
          condition,
          imageUrl,
          sellerId,
        },
      })
  
      return res.status(201).json({
        success: true,
        message: 'Listing created successfully',
        data: listing,
      })
    } catch (error) {
      console.error('Create marketplace listing error:', error)
  
      return res.status(500).json({
        success: false,
        message: 'Failed to create listing',
      })
    }
  }
  export const getMyListings = async (req: AuthRequest, res: Response) => {
    try {
      const sellerId = req.user?.userId
  
      if (!sellerId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        })
      }
  
      const listings = await prisma.marketplaceListing.findMany({
        where: { sellerId },
        orderBy: { createdAt: 'desc' },
      })
  
      return res.status(200).json({
        success: true,
        count: listings.length,
        data: listings,
      })
    } catch (error) {
      console.error('Get my listings error:', error)
  
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch your listings',
      })
    }
  }
  export const updateListingStatus = async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
        const id = req.params.id

        if (typeof id !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Invalid listing ID',
          })
        }
      const { status } = req.body
      const sellerId = req.user?.userId
  
      if (!sellerId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        })
      }
  
      if (!['AVAILABLE', 'RESERVED', 'SOLD'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid listing status',
        })
      }
  
      const listing = await prisma.marketplaceListing.findFirst({
        where: { id, sellerId },
      })
  
      if (!listing) {
        return res.status(404).json({
          success: false,
          message: 'Listing not found or access denied',
        })
      }
  
      const updatedListing = await prisma.marketplaceListing.update({
        where: { id },
        data: { status },
      })
  
      return res.status(200).json({
        success: true,
        message: 'Listing status updated successfully',
        data: updatedListing,
      })
    } catch (error) {
      console.error('Update listing status error:', error)
  
      return res.status(500).json({
        success: false,
        message: 'Failed to update listing status',
      })
    }
  }