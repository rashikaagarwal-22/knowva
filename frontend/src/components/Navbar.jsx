import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiLogOut, FiPlus, FiHome } from 'react-icons/fi'
import { motion } from 'framer-motion'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex justify-between items-center shadow-lg"
    >
      <Link to="/" className="text-2xl font-bold text-blue-400 tracking-tight">
        AI Knowledge Base
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition flex items-center gap-1"
            >
              <FiHome /> Home
            </Link>
            <Link
              to="/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <FiPlus /> New Note
            </Link>
            <span className="text-gray-400">
              {user.firstName} 
            </span>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar