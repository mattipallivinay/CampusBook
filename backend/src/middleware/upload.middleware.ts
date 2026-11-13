
import multer from 'multer'

const storage = multer.memoryStorage()

const fileFilter: multer.Options['fileFilter'] = (_req, file, callback) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ]

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true)
  } else {
    callback(new Error('Only PDF and PPT files are allowed'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
})

export default upload
