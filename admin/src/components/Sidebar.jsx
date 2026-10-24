import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext.jsx'
import { DoctorContext } from '../context/DoctorContext.jsx'

const adminLinks = [
  { to: '/admin-dashboard', label: 'Dashboard' },
  { to: '/all-appointments', label: 'Appointments' },
  { to: '/add-doctor', label: 'Add Doctor' },
  { to: '/doctor-list', label: 'Doctors List' },
]

const doctorLinks = [
  { to: '/doctor-dashboard', label: 'Dashboard' },
  { to: '/doctor-appointments', label: 'Appointments' },
  { to: '/doctor-profile', label: 'Profile' },
]

const Sidebar = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)
  const links = aToken ? adminLinks : dToken ? doctorLinks : []

  return (
    <div className="min-h-screen bg-white border-r w-16 sm:w-60 shrink-0">
      <ul className="text-gray-700 mt-5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 sm:px-9 sm:min-w-60 cursor-pointer text-sm ${
                isActive ? 'bg-indigo-50 border-r-4 border-primary text-primary font-medium' : ''
              }`
            }
          >
            <p>{link.label}</p>
          </NavLink>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
