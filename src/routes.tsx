import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home';
import HomeChat from './components/pages/Chat';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home-chat" element={<HomeChat />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
