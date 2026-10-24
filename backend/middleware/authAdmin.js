import jwt from 'jsonwebtoken'

// Admin sends the token in the "atoken" header
const authAdmin = (req, res, next) => {
  try {
    const { atoken } = req.headers
    if (!atoken) return res.json({ success: false, message: 'Not authorized. Login again.' })
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET)
    if (decoded.role !== 'admin') {
      return res.json({ success: false, message: 'Not authorized. Login again.' })
    }
    next()
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export default authAdmin
