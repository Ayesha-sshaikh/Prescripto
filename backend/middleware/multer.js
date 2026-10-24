import multer from 'multer'

// Saves the uploaded file temporarily on disk; controllers send it to Cloudinary
const storage = multer.diskStorage({
  filename: (req, file, callback) => callback(null, file.originalname),
})

const upload = multer({ storage })
export default upload
