import { useState } from 'react'
import { login } from '../api/endpoints/auth'
import { User } from '../dto/auth/user'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (username: string, password: string) => {
    try {
      const user = await login(username, password)
      setUser(user)
      setError(null)
      localStorage.setItem('id', user.id.toString())
      localStorage.setItem('username', user.username)
      localStorage.setItem('name', user.name)
      navigate(ROUTES.CHATS)
    } catch (err) {
      setError('Invalid username or password')
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('id')
      localStorage.removeItem('username')
      localStorage.removeItem('name')
      setUser(null)
      navigate(ROUTES.HOME)
    } catch (err) {
      setError('Error logging out')
    }
  }

  return { user, error, handleLogin, handleLogout }
}

export default useAuth
