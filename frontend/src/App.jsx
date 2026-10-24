import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Placeholder from './components/Placeholder.jsx'

// TODO: add <Navbar /> above <Routes> and <Footer /> below it.
// TODO: replace each <Placeholder /> with its real page component in src/pages/.
const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Placeholder name="Home" />} />
        <Route path="/doctors" element={<Placeholder name="Doctors" />} />
        <Route path="/doctors/:speciality" element={<Placeholder name="Doctors by speciality" />} />
        <Route path="/login" element={<Placeholder name="Login" />} />
        <Route path="/about" element={<Placeholder name="About" />} />
        <Route path="/contact" element={<Placeholder name="Contact" />} />
        <Route path="/my-profile" element={<Placeholder name="My Profile" />} />
        <Route path="/my-appointments" element={<Placeholder name="My Appointments" />} />
        <Route path="/appointment/:docId" element={<Placeholder name="Appointment" />} />
      </Routes>
    </div>
  )
}

export default App
