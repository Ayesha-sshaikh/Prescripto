import { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext.jsx'
import { specialities } from '../../utils/format.js'

const inputClass = 'border rounded px-3 py-2 w-full bg-white'

const AddDoctor = () => {
  const { aToken, backendUrl, getAllDoctors } = useContext(AdminContext)

  const [docImg, setDocImg] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState(specialities[0])
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [saving, setSaving] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      // The photo is optional. If you skip it, a letter avatar is shown instead.
      if (docImg) formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

      setSaving(true)
      const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, {
        headers: { atoken: aToken },
      })
      setSaving(false)

      if (data.success) {
        toast.success(data.message)
        setDocImg(null)
        setName('')
        setEmail('')
        setPassword('')
        setFees('')
        setAbout('')
        setDegree('')
        setAddress1('')
        setAddress2('')
        getAllDoctors()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      setSaving(false)
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmit} className="m-5 w-full max-w-4xl">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-white px-8 py-8 border rounded w-full">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img" className="cursor-pointer">
            {docImg ? (
              <img className="w-16 h-16 rounded-full object-cover" src={URL.createObjectURL(docImg)} alt="" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-400">
                +
              </div>
            )}
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" accept="image/*" hidden />
          <p>
            Upload doctor
            <br />
            picture (optional)
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div>
              <p>Doctor name</p>
              <input className={inputClass} type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <p>Doctor email</p>
              <input className={inputClass} type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <p>Doctor password</p>
              <input className={inputClass} type="password" placeholder="At least 8 characters" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <p>Experience</p>
              <select className={inputClass} value={experience} onChange={(e) => setExperience(e.target.value)}>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={`${i + 1} ${i === 0 ? 'Year' : 'Years'}`}>
                    {i + 1} {i === 0 ? 'Year' : 'Years'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p>Fees</p>
              <input className={inputClass} type="number" placeholder="Fees" required value={fees} onChange={(e) => setFees(e.target.value)} />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div>
              <p>Speciality</p>
              <select className={inputClass} value={speciality} onChange={(e) => setSpeciality(e.target.value)}>
                {specialities.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p>Education</p>
              <input className={inputClass} type="text" placeholder="Education" required value={degree} onChange={(e) => setDegree(e.target.value)} />
            </div>
            <div>
              <p>Address</p>
              <input className={`${inputClass} mb-2`} type="text" placeholder="Address 1" required value={address1} onChange={(e) => setAddress1(e.target.value)} />
              <input className={inputClass} type="text" placeholder="Address 2" required value={address2} onChange={(e) => setAddress2(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="mt-4 text-gray-600">
          <p>About doctor</p>
          <textarea className={inputClass} rows={5} placeholder="Write about the doctor" required value={about} onChange={(e) => setAbout(e.target.value)} />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white px-10 py-3 mt-4 rounded-full cursor-pointer disabled:opacity-60"
        >
          {saving ? 'Adding...' : 'Add doctor'}
        </button>
      </div>
    </form>
  )
}

export default AddDoctor
