import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../../context/DoctorContext.jsx'
import Avatar from '../../components/Avatar.jsx'
import { currency } from '../../utils/format.js'

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext)
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    if (dToken) getProfileData()
  }, [dToken])

  const updateProfile = async () => {
    try {
      const { fees, address, available } = profileData
      const { data } = await axios.post(
        backendUrl + '/api/doctor/update-profile',
        { fees, address, available },
        { headers: { dtoken: dToken } }
      )
      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (!profileData) return <p className="m-5 text-gray-500">Loading...</p>

  return (
    <div className="m-5 w-full max-w-4xl">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="bg-indigo-50 rounded-lg w-full sm:max-w-64 h-64 flex items-center justify-center overflow-hidden">
          {profileData.image ? (
            <img className="w-full h-full object-cover object-top" src={profileData.image} alt={profileData.name} />
          ) : (
            <Avatar name={profileData.name} size={96} />
          )}
        </div>

        <div className="flex-1 border border-stone-100 rounded-lg p-8 bg-white">
          <p className="text-3xl font-medium text-gray-700">{profileData.name}</p>
          <p className="text-gray-600 mt-1">
            {profileData.degree} - {profileData.speciality}{' '}
            <span className="py-0.5 px-2 border text-xs rounded-full">{profileData.experience}</span>
          </p>

          <p className="text-sm font-medium text-neutral-800 mt-4">About</p>
          <p className="text-sm text-gray-600 max-w-[700px] mt-1">{profileData.about}</p>

          <p className="text-gray-600 font-medium mt-4">
            Appointment fee:{' '}
            <span className="text-gray-800">
              {currency}
              {isEdit ? (
                <input
                  type="number"
                  className="border rounded px-2 py-0.5 w-24"
                  value={profileData.fees}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, fees: Number(e.target.value) }))}
                />
              ) : (
                profileData.fees
              )}
            </span>
          </p>

          <div className="flex gap-2 py-2 text-gray-600">
            <p>Address:</p>
            <p className="text-sm">
              {isEdit ? (
                <>
                  <input
                    type="text"
                    className="border rounded px-2 py-0.5 mb-1 block"
                    value={profileData.address.line1}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))
                    }
                  />
                  <input
                    type="text"
                    className="border rounded px-2 py-0.5 block"
                    value={profileData.address.line2}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))
                    }
                  />
                </>
              ) : (
                <>
                  {profileData.address.line1}
                  <br />
                  {profileData.address.line2}
                </>
              )}
            </p>
          </div>

          <label className="flex gap-2 pt-2 items-center text-sm text-gray-700">
            <input
              type="checkbox"
              checked={profileData.available}
              disabled={!isEdit}
              onChange={() => isEdit && setProfileData((prev) => ({ ...prev, available: !prev.available }))}
            />
            Available
          </label>

          {isEdit ? (
            <button
              onClick={updateProfile}
              className="px-6 py-1.5 border border-primary text-sm rounded-full mt-5 bg-primary text-white cursor-pointer"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-6 py-1.5 border border-primary text-sm rounded-full mt-5 text-primary hover:bg-primary hover:text-white transition cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
