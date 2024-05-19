import { useState } from 'react'
import { login, register } from '../api/endpoints/auth'
import { userData } from '../dto/auth/user'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

const useAuth = () => {
  const [user, setUser] = useState(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (username: string, password: string) => {
    try {
      const user = await login(username, password)
      setUser(user)
      setError(null)
      localStorage.setItem('username', username)
      navigate(ROUTES.CHATS)
    } catch (err) {
      setError('Invalid username or password')
    }
  }

  const handleRegister = async (userData: userData) => {
    try {
      await register(userData)
      setError(null)
    } catch (err) {
      setError('Error registering user')
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('username')
      navigate(ROUTES.HOME)
    } catch (err) {
      setError('Error logging out')
    }
  }

  return { user, error, handleLogin, handleRegister, handleLogout }
}

export default useAuth
