import { useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'

// Temporary page. Replace each with the real page from the tutorial video.
const Placeholder = ({ name }) => {
  const { doctors, userData } = useContext(AppContext)
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-primary">{name} page</h1>
      <p className="mt-2 text-gray-600">
        TODO: build this page. Doctors loaded from the backend: {doctors.length}
        {userData ? ` | Logged in as ${userData.name}` : ''}
      </p>
    </div>
  )
}

export default Placeholder
