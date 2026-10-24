import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext.jsx'
import Avatar from '../../components/Avatar.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { slotDateFormat, calculateAge, currency } from '../../utils/format.js'

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } =
    useContext(DoctorContext)

  useEffect(() => {
    if (dToken) getAppointments()
  }, [dToken])

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm overflow-x-auto">
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1.5fr] gap-1 py-3 px-6 border-b font-medium text-gray-600">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date &amp; Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.length === 0 && <p className="p-6 text-gray-500">No appointments yet.</p>}

        {[...appointments].reverse().map((item, index) => (
          <div
            key={item._id}
            className="flex flex-wrap sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_2fr_1fr_1.5fr] gap-1 items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50"
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <Avatar src={item.userData.image} name={item.userData.name} />
              <p>{item.userData.name}</p>
            </div>
            <p className="text-xs border border-primary text-primary px-2 rounded-full w-fit">
              {item.payment ? 'Online' : 'Cash'}
            </p>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <p>
              {currency}
              {item.amount}
            </p>
            {!item.cancelled && !item.isCompleted ? (
              <div className="flex gap-2">
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-red-500 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => completeAppointment(item._id)}
                  className="text-green-600 border border-green-200 px-3 py-1 rounded-full hover:bg-green-50 cursor-pointer"
                >
                  Complete
                </button>
              </div>
            ) : (
              <StatusBadge item={item} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorAppointments
