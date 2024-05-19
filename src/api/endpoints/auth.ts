import { userData } from '../../dto/auth/user';
import apiClient from '../apiClient';

export const register = (userData: userData) => {
  return apiClient.post('/users', { userData });
};

export const login = async (username: string, password: string) => {
  const response = await apiClient.post(`/auth/login`, {username, password});
  console.log(response)
  if (response.data.length > 0) {
    return response.data[0];
  } else {
    throw new Error('Invalid username or password');
  }
};
