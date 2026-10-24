import fs from 'fs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'

// POST /api/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET)
      return res.json({ success: true, token })
    }
    res.json({ success: false, message: 'Invalid credentials' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/admin/add-doctor  (multipart form-data, image field name: "image")
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
    const imageFile = req.file

    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
      return res.json({ success: false, message: 'Missing details' })
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email' })
    }
    if (password.length < 8) {
      return res.json({ success: false, message: 'Please enter a strong password (min 8 characters)' })
    }
    if (await doctorModel.findOne({ email })) {
      return res.json({ success: false, message: 'A doctor with this email already exists' })
    }

    let imageUrl = ''
    if (imageFile) {
      const upload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
      imageUrl = upload.secure_url
      fs.unlink(imageFile.path, () => {})
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const doctor = new doctorModel({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      speciality,
      degree,
      experience,
      about,
      fees: Number(fees),
      address: JSON.parse(address), // frontend sends JSON.stringify({line1, line2})
    })
    await doctor.save()
    res.json({ success: true, message: 'Doctor added' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// GET /api/admin/all-doctors
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({ success: true, doctors })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/admin/change-availability  { docId }
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body
    const doc = await doctorModel.findById(docId)
    if (!doc) return res.json({ success: false, message: 'Doctor not found' })
    await doctorModel.findByIdAndUpdate(docId, { available: !doc.available })
    res.json({ success: true, message: 'Availability changed' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// GET /api/admin/appointments
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({})
    res.json({ success: true, appointments })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/admin/cancel-appointment  { appointmentId }
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appointment = await appointmentModel.findById(appointmentId)
    if (!appointment) return res.json({ success: false, message: 'Appointment not found' })

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    // free the slot again
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

// GET /api/admin/dashboard
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})
    res.json({
      success: true,
      dashData: {
        doctors: doctors.length,
        appointments: appointments.length,
        patients: users.length,
        latestAppointments: [...appointments].reverse().slice(0, 5),
      },
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export {
  loginAdmin,
  addDoctor,
  allDoctors,
  changeAvailability,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
}
