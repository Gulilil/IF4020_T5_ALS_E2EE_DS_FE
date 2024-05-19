import React, { useState } from 'react';
import { Box, TextField, IconButton, AppBar, Toolbar, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import Sidebar from './SideBar';

const HomeChat: React.FC = () => {
  useAuthRedirect();
  const [selectedChatroom, setSelectedChatroom] = useState<number | null>(null);
  const [messages, setMessages] = useState<{ [key: number]: string[] }>({
    1: ['Hello in General!', 'How are you?'],
    2: ['Random chat starts here.'],
    3: ['Need help with something?'],
  });
  const [message, setMessage] = useState<string>('');

  const handleSendMessage = () => {
    if (message.trim() && selectedChatroom !== null) {
      setMessages(prevMessages => ({
        ...prevMessages,
        [selectedChatroom]: [...prevMessages[selectedChatroom], message],
      }));
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSelectChatroom={setSelectedChatroom} selectedChatroom={selectedChatroom} />
      <div className="flex-1 flex flex-col">
        <AppBar position="static" className="bg-blue-600">
          <Toolbar>
            <Typography variant="h6" className="text-white flex-1">
              {selectedChatroom !== null 
                ? `Chatroom ${selectedChatroom}` // You can improve this to show the chatroom name
                : 'Select a Chatroom'}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box className="flex-1 p-4 overflow-y-auto">
          {selectedChatroom !== null 
            ? messages[selectedChatroom].map((msg, index) => (
                <div key={index} className="mb-2">
                  <div className="bg-white p-2 rounded shadow">
                    {msg}
                  </div>
                </div>
              ))
            : <div className="text-center text-gray-500">No chatroom selected</div>
          }
        </Box>
        {selectedChatroom !== null && (
          <footer className="p-4 bg-white shadow flex">
            <TextField
              variant="outlined"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <IconButton color="primary" onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </footer>
        )}
      </div>
    </div>
  );
};

export default HomeChat;
