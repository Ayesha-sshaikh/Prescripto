// Shows Completed / Cancelled / Upcoming for an appointment
const StatusBadge = ({ item }) => {
  if (item.cancelled) {
    return <span className="text-xs font-medium text-red-500">Cancelled</span>
  }
  if (item.isCompleted) {
    return <span className="text-xs font-medium text-green-600">Completed</span>
  }
  return <span className="text-xs font-medium text-amber-600">Upcoming</span>
}

export default StatusBadge
