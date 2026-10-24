import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext.jsx'
import Avatar from '../../components/Avatar.jsx'

const DoctorsList = () => {
  const { aToken, doctors, getAllDoctors, changeAvailability } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) getAllDoctors()
  }, [aToken])

  return (
    <div className="m-5 w-full">
      <p className="text-lg font-medium">All Doctors</p>
      {doctors.length === 0 && <p className="mt-4 text-gray-500 text-sm">No doctors added yet.</p>}

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((item) => (
          <div
            key={item._id}
            className="border border-indigo-200 rounded-xl w-56 overflow-hidden bg-white"
          >
            <div className="bg-indigo-50 h-44 flex items-center justify-center">
              {item.image ? (
                <img className="h-full w-full object-cover object-top" src={item.image} alt={item.name} />
              ) : (
                <Avatar name={item.name} size={80} />
              )}
            </div>
            <div className="p-4">
              <p className="text-gray-800 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
              <label className="mt-2 flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.available}
                  onChange={() => changeAvailability(item._id)}
                />
                <span>Available</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList
