import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext.jsx'
import Avatar from '../../components/Avatar.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { slotDateFormat, calculateAge, currency } from '../../utils/format.js'

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) getAllAppointments()
  }, [aToken])

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm overflow-x-auto">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] gap-1 py-3 px-6 border-b font-medium text-gray-600">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date &amp; Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.length === 0 && <p className="p-6 text-gray-500">No appointments yet.</p>}

        {[...appointments].reverse().map((item, index) => (
          <div
            key={item._id}
            className="flex flex-wrap sm:grid sm:grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] gap-1 items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50"
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <Avatar src={item.userData.image} name={item.userData.name} />
              <p>{item.userData.name}</p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <Avatar src={item.docData.image} name={item.docData.name} />
              <p>{item.docData.name}</p>
            </div>
            <p>
              {currency}
              {item.amount}
            </p>
            {!item.cancelled && !item.isCompleted ? (
              <button
                onClick={() => cancelAppointment(item._id)}
                className="text-red-500 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 w-fit cursor-pointer"
              >
                Cancel
              </button>
            ) : (
              <StatusBadge item={item} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllAppointments
