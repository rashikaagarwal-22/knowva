import { createContext, useState, useEffect, useContext } from 'react'
import API from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in (cookie present)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get('/user/check')
        setUser(res.data.user)
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  // Login function
  const login = async (emailId, password) => {
    try {
      const res = await API.post('/user/login', { emailId, password })
      setUser(res.data.user)
      toast.success('Logged in successfully!')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
      return false
    }
  }

  // Register function
  const register = async (firstName, lastName, emailId, password) => {
    try {
      const res = await API.post('/user/register', { firstName, lastName, emailId, password})
      setUser(res.data.user)
      toast.success('Registration successful!')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
      return false
    }
  }

  // Logout
  const logout = async () => {
    try {
      await API.post('/user/logout')
      setUser(null)
      toast.success('Logged out')
    } catch (err) {
      toast.error('Logout error')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}