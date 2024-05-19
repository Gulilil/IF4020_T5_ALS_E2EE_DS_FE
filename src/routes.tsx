import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home';
import HomeChat from './components/pages/HomeChat';
import { ROUTES } from './constants/routes';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.CHATS} element={<HomeChat />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
