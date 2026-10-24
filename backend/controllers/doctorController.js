import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'

// GET /api/doctor/list  (public - used by the patient website)
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email'])
    res.json({ success: true, doctors })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/doctor/login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body
    const doctor = await doctorModel.findOne({ email })
    if (!doctor) return res.json({ success: false, message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, doctor.password)
    if (!isMatch) return res.json({ success: false, message: 'Invalid credentials' })

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// GET /api/doctor/appointments
const appointmentsDoctor = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ docId: req.docId })
    res.json({ success: true, appointments })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/doctor/complete-appointment  { appointmentId }
const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appointment = await appointmentModel.findById(appointmentId)
    if (appointment && appointment.docId === req.docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
      return res.json({ success: true, message: 'Appointment completed' })
    }
    res.json({ success: false, message: 'Action failed' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/doctor/cancel-appointment  { appointmentId }
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appointment = await appointmentModel.findById(appointmentId)
    if (appointment && appointment.docId === req.docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

      const { docId, slotDate, slotTime } = appointment
      const doctor = await doctorModel.findById(docId)
      const slots = doctor.slots_booked
      if (slots[slotDate]) {
        slots[slotDate] = slots[slotDate].filter((t) => t !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, { slots_booked: slots })
      }
      return res.json({ success: true, message: 'Appointment cancelled' })
    }
    res.json({ success: false, message: 'Action failed' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// GET /api/doctor/dashboard
const doctorDashboard = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ docId: req.docId })
    let earnings = 0
    appointments.forEach((a) => {
      if (a.isCompleted || a.payment) earnings += a.amount
    })
    const patients = []
    appointments.forEach((a) => {
      if (!patients.includes(a.userId)) patients.push(a.userId)
    })
    res.json({
      success: true,
      dashData: {
        earnings,
        appointments: appointments.length,
        patients: patients.length,
        latestAppointments: [...appointments].reverse().slice(0, 5),
      },
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// GET /api/doctor/profile
const doctorProfile = async (req, res) => {
  try {
    const profileData = await doctorModel.findById(req.docId).select('-password')
    res.json({ success: true, profileData })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// POST /api/doctor/update-profile  { fees, address, available }
const updateDoctorProfile = async (req, res) => {
  try {
    const { fees, address, available } = req.body
    await doctorModel.findByIdAndUpdate(req.docId, { fees, address, available })
    res.json({ success: true, message: 'Profile updated' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export {
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentComplete,
  appointmentCancel,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
}
