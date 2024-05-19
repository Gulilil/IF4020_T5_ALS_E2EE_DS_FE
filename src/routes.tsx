import { Login } from '@mui/icons-material';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/pages/Register';
import TestingSocket from './components/pages/TestingSocket';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/socket' element={<TestingSocket />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
