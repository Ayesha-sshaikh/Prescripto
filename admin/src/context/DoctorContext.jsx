import { createContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const DoctorContext = createContext()

const DoctorContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '')
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(null)
  const [profileData, setProfileData] = useState(null)

  const headers = { dtoken: dToken }

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers })
      if (data.success) setAppointments(data.appointments)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/doctor/complete-appointment',
        { appointmentId },
        { headers }
      )
      if (data.success) {
        toast.success(data.message)
        getAppointments()
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/doctor/cancel-appointment',
        { appointmentId },
        { headers }
      )
      if (data.success) {
        toast.success(data.message)
        getAppointments()
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers })
      if (data.success) setDashData(data.dashData)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers })
      if (data.success) setProfileData(data.profileData)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const value = {
    backendUrl,
    dToken,
    setDToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
  }

  return <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
}

export default DoctorContextProvider
