import fs from 'fs'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

// POST /api/user/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing details' })
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Enter a valid email' })
    }
    if (password.length < 8) {
      return res.json({ success: false, message: 'Password must be at least 8 characters' })
    }
    if (await userModel.findOne({ email })) {
      return res.json({ success: false, message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await userModel.create({ name, email, password: hashedPassword })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/user/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) return res.json({ success: false, message: 'User does not exist' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.json({ success: false, message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// GET /api/user/get-profile
const getProfile = async (req, res) => {
  try {
    const userData = await userModel.findById(req.userId).select('-password')
    res.json({ success: true, userData })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/user/update-profile  (multipart: name, phone, address(JSON), dob, gender, image)
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body
    const imageFile = req.file
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: 'Data missing' })
    }

    await userModel.findByIdAndUpdate(req.userId, {
      name,
      phone,
      address: address ? JSON.parse(address) : { line1: '', line2: '' },
      dob,
      gender,
    })

    if (imageFile) {
      const upload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      await userModel.findByIdAndUpdate(req.userId, { image: upload.secure_url })
      fs.unlink(imageFile.path, () => {})
    }
    res.json({ success: true, message: 'Profile updated' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/user/book-appointment  { docId, slotDate, slotTime }
// slotDate looks like "24_10_2026", slotTime like "10:30 AM"
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body
    const userId = req.userId

    const docData = await doctorModel.findById(docId).select('-password')
    if (!docData) return res.json({ success: false, message: 'Doctor not found' })
    if (!docData.available) return res.json({ success: false, message: 'Doctor not available' })

    // check that the slot is free
    const slots_booked = docData.slots_booked
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'Slot not available' })
      }
      slots_booked[slotDate].push(slotTime)
    } else {
      slots_booked[slotDate] = [slotTime]
    }

    const userData = await userModel.findById(userId).select('-password')
    const docInfo = docData.toObject()
    delete docInfo.slots_booked // keep the stored copy small

    await appointmentModel.create({
      userId,
      docId,
      userData,
      docData: docInfo,
      amount: docData.fees,
      slotTime,
      slotDate,
    })
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })

    res.json({ success: true, message: 'Appointment booked' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// GET /api/user/appointments
const listAppointment = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.userId })
    res.json({ success: true, appointments })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/user/cancel-appointment  { appointmentId }
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment || appointment.userId !== req.userId) {
      return res.json({ success: false, message: 'Unauthorized action' })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    const { docId, slotDate, slotTime } = appointment
    const doctor = await doctorModel.findById(docId)
    if (doctor) {
      const slots = doctor.slots_booked
      if (slots[slotDate]) {
        slots[slotDate] = slots[slotDate].filter((t) => t !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, { slots_booked: slots })
      }
    }
    res.json({ success: true, message: 'Appointment cancelled' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// TODO (friend): online payment with Razorpay / Stripe:
//   POST /api/user/payment-razorpay, /verify-razorpay, /payment-stripe, /verify-stripe

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
}
