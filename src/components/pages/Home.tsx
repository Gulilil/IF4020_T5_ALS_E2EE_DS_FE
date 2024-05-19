import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const Home: React.FC = () => {
  const { handleLogin } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      console.log(storedUsername);
      navigate(ROUTES.CHATS);
    }
  }, [navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(username, password);
    navigate(ROUTES.CHATS);
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
      <div className="flex flex-col text-gray-700 bg-white shadow-md rounded-xl p-8 w-80 sm:w-96">
        <h4 className="font-sans text-2xl font-semibold text-center text-blue-gray-900">
          Sign In
        </h4>
        <p className="mt-1 text-base text-center text-gray-700">
          Enter your details to login.
        </p>
        <form className="mt-8" onSubmit={onSubmit}>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col">
              <label htmlFor="username" className="mb-2 font-sans text-base font-semibold text-blue-gray-900">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="rounded-md border border-gray-300 bg-gray-100 px-3 py-2 focus:border-gray-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="mb-2 font-sans text-base font-semibold text-blue-gray-900">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="rounded-md border border-gray-300 bg-gray-100 px-3 py-2 focus:border-gray-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
          <button
            className="w-full rounded-lg bg-gray-900 py-3 text-xs font-bold uppercase text-white shadow-md transition-all hover:bg-gray-800 focus:opacity-85 focus:shadow-none active:opacity-85"
            type="submit"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
