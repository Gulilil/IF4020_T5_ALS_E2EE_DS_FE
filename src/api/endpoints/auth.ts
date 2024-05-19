import { User } from '../../dto/auth/user'
import apiClient from '../apiClient'

export const login = async (username: string, password: string) => {
  const response = await apiClient.post(`/auth/login`, { username, password })
  if (response.data) {
    const user: User = response.data as User
    return user
  } else {
    throw new Error('Invalid username or password')
  }
}
