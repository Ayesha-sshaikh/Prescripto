import { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../context/AdminContext.jsx'
import { DoctorContext } from '../context/DoctorContext.jsx'

// One login screen for both roles: Admin (atoken) and Doctor (dtoken)
const Login = () => {
  const [role, setRole] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setAToken, backendUrl } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = role === 'Admin' ? '/api/admin/login' : '/api/doctor/login'
      const { data } = await axios.post(backendUrl + url, { email, password })
      if (!data.success) return toast.error(data.message)

      if (role === 'Admin') {
        localStorage.setItem('aToken', data.token)
        setAToken(data.token)
      } else {
        localStorage.setItem('dToken', data.token)
        setDToken(data.token)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmit} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] border rounded-xl text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{role}</span> Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            className="border rounded w-full p-2 mt-1"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border rounded w-full p-2 mt-1"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base">Login</button>
        {role === 'Admin' ? (
          <p>
            Doctor login?{' '}
            <span className="text-primary underline cursor-pointer" onClick={() => setRole('Doctor')}>
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin login?{' '}
            <span className="text-primary underline cursor-pointer" onClick={() => setRole('Admin')}>
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  )
}

export default Login
