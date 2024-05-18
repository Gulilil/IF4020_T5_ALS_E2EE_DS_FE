import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const Register: React.FC = () => {
  const { handleRegister, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister({username: "test", password: "hello"});
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Register</h2>
      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Register</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Register;
