
import { Readable } from 'stream'
import cloudinary from '../config/cloudinary.js'

export const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'campusbook/resources',
        resource_type: 'raw',
        public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Cloudinary upload failed'))
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        })
      }
    )

    Readable.from(file.buffer).pipe(uploadStream)
  })
}
