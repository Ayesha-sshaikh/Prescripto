import { useContext, useEffect } from 'react'
import { AdminContext } from '../context/AdminContext.jsx'
import { DoctorContext } from '../context/DoctorContext.jsx'

// Temporary page. Replace each with the real page from the tutorial video.
const Placeholder = ({ name }) => {
  const { aToken, doctors, getAllDoctors } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  useEffect(() => {
    if (aToken) getAllDoctors()
  }, [aToken])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-primary">{name} page</h1>
      <p className="mt-2 text-gray-600">
        TODO: build this page. Logged in as {aToken ? 'Admin' : dToken ? 'Doctor' : 'nobody'}.
        {aToken ? ` Doctors loaded: ${doctors.length}` : ''}
      </p>
    </div>
  )
}

export default Placeholder
