import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext.jsx'
import { DoctorContext } from '../context/DoctorContext.jsx'

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('aToken')
    localStorage.removeItem('dToken')
    setAToken('')
    setDToken('')
    navigate('/')
  }

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-3">
        <p className="text-xl font-semibold text-primary">Prescripto</p>
        <span className="border border-gray-400 px-2.5 py-0.5 rounded-full text-xs text-gray-600">
          {aToken ? 'Admin' : 'Doctor'}
        </span>
      </div>
      <button
        onClick={logout}
        className="bg-primary text-white text-sm px-8 py-2 rounded-full cursor-pointer"
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar
