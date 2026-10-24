import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const currencySymbol = '₹'

  const [doctors, setDoctors] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userData, setUserData] = useState(null)

  // Public: list of doctors
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/list')
      if (data.success) setDoctors(data.doctors)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Logged-in patient profile
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
        headers: { token },
      })
      if (data.success) setUserData(data.userData)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getDoctorsData()
  }, [])

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      loadUserProfileData()
    } else {
      localStorage.removeItem('token')
      setUserData(null)
    }
  }, [token])

  const value = {
    backendUrl,
    currencySymbol,
    doctors,
    getDoctorsData,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContextProvider
