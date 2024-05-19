import React from 'react';
import useAuthRedirect from '../../hooks/useAuthRedirect';

const HomeChat: React.FC = () => {
  useAuthRedirect();
  return <div>Welcome to Home Chat!</div>;
};

export default HomeChat;
