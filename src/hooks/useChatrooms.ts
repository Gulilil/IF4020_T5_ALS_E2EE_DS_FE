import { useState, useEffect } from 'react';

const chatroomData = [
  { id: 1, name: 'General' },
  { id: 2, name: 'Random' },
  { id: 3, name: 'Support' },
];

const messageData = {
  1: ['Hello in General!', 'How are you?'],
  2: ['Random chat starts here.'],
  3: ['Need help with something?'],
};

export const useChatrooms = () => {
  const [chatrooms, setChatrooms] = useState(chatroomData);
  const [messages, setMessages] = useState(messageData);
  
  useEffect(() => {
    setChatrooms(chatroomData);
    setMessages(messageData);
  }, []);

  return { chatrooms, messages };
};
