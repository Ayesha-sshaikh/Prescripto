import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext.jsx'
import Avatar from '../../components/Avatar.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { slotDateFormat, currency } from '../../utils/format.js'

const StatCard = ({ label, value }) => (
  <div className="bg-white p-5 min-w-52 rounded-lg border border-gray-100 shadow-sm">
    <p className="text-3xl font-semibold text-gray-700">{value}</p>
    <p className="text-gray-400 mt-1">{label}</p>
  </div>
)

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, completeAppointment, cancelAppointment } =
    useContext(DoctorContext)

  useEffect(() => {
    if (dToken) getDashData()
  }, [dToken])

  if (!dashData) return <p className="m-5 text-gray-500">Loading...</p>

  return (
    <div className="m-5">
      <div className="flex flex-wrap gap-4">
        <StatCard label="Earnings" value={`${currency}${dashData.earnings}`} />
        <StatCard label="Appointments" value={dashData.appointments} />
        <StatCard label="Patients" value={dashData.patients} />
      </div>

      <div className="bg-white mt-10 rounded-lg border border-gray-100">
        <p className="px-4 py-4 font-semibold border-b">Latest Bookings</p>
        {dashData.latestAppointments.length === 0 && (
          <p className="p-4 text-gray-500 text-sm">No bookings yet.</p>
        )}
        {dashData.latestAppointments.map((item) => (
          <div
            key={item._id}
            className="flex items-center px-6 py-3 gap-3 hover:bg-gray-50 border-b last:border-b-0"
          >
            <Avatar src={item.userData.image} name={item.userData.name} size={40} />
            <div className="flex-1 text-sm">
              <p className="text-gray-800 font-medium">{item.userData.name}</p>
              <p className="text-gray-500">
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>
            </div>
            {!item.cancelled && !item.isCompleted ? (
              <div className="flex gap-2 text-sm">
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

export default DoctorDashboard
