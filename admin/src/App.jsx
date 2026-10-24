import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext.jsx'
import { DoctorContext } from './context/DoctorContext.jsx'
import Login from './pages/Login.jsx'
import Placeholder from './pages/Placeholder.jsx'

// TODO: add <Navbar /> (with logout) and <Sidebar /> once logged in.
// TODO: replace each <Placeholder /> with its real page component in src/pages/.
const App = () => {
  const { aToken, setAToken } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)

  const logout = () => {
    localStorage.removeItem('aToken')
    localStorage.removeItem('dToken')
    setAToken('')
    setDToken('')
  }

  if (!aToken && !dToken) {
    return (
      <div className="mx-4 sm:mx-[10%]">
        <ToastContainer />
        <Login />
      </div>
    )
  }

  return (
    <div className="mx-4 sm:mx-[5%]">
      <ToastContainer />
      <div className="flex justify-between items-center py-3 border-b">
        <p className="font-semibold text-primary">Prescripto {aToken ? 'Admin' : 'Doctor'}</p>
        <button onClick={logout} className="bg-primary text-white text-sm px-6 py-1.5 rounded-full">
          Logout
        </button>
      </div>
      <Routes>
        {/* Admin routes */}
        <Route path="/" element={<Navigate to={aToken ? '/admin-dashboard' : '/doctor-dashboard'} />} />
        <Route path="/admin-dashboard" element={<Placeholder name="Admin Dashboard" />} />
        <Route path="/all-appointments" element={<Placeholder name="All Appointments" />} />
        <Route path="/add-doctor" element={<Placeholder name="Add Doctor" />} />
        <Route path="/doctor-list" element={<Placeholder name="Doctors List" />} />
        {/* Doctor routes */}
        <Route path="/doctor-dashboard" element={<Placeholder name="Doctor Dashboard" />} />
        <Route path="/doctor-appointments" element={<Placeholder name="Doctor Appointments" />} />
        <Route path="/doctor-profile" element={<Placeholder name="Doctor Profile" />} />
      </Routes>
    </div>
  )
}

export default App
