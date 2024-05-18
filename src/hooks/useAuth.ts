import { useState } from 'react';
import { login, register } from '../api/endpoints/auth';
import { userData } from '../dto/auth/user';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (username: string, password: string) => {
    try {
      const user = await login(username, password);
      setUser(user);
      setError(null);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  const handleRegister = async (userData: userData) => {
    try {
      await register(userData);
      setError(null);
    } catch (err) {
      setError('Error registering user');
    }
  };

  return { user, error, handleLogin, handleRegister };
};

export default useAuth;
