import React from 'react';
import { List, ListItem, ListItemText, AppBar, Toolbar, Typography, Button, Box, Divider } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useChatrooms } from '../../hooks/useChatrooms';

const Sidebar: React.FC<{ onSelectChatroom: (id: number) => void, selectedChatroom: number | null }> = ({ onSelectChatroom, selectedChatroom }) => {
  const { chatrooms } = useChatrooms();

  const handleLogout = () => {
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  return (
    <div className="w-1/4 h-full bg-gray-900 text-white flex flex-col">
      <AppBar position="static" className="bg-gray-800">
        <Toolbar>
          <ChatIcon />
          <Typography variant="h6" className="ml-2">
            ChatGPT
          </Typography>
        </Toolbar>
      </AppBar>
      <Box className="flex-1 overflow-y-auto">
        <List>
          {chatrooms.map(chatroom => (
            <ListItem 
              button 
              key={chatroom.id} 
              onClick={() => onSelectChatroom(chatroom.id)}
              selected={chatroom.id === selectedChatroom}
              className={`hover:bg-gray-700 ${chatroom.id === selectedChatroom ? 'bg-gray-800' : ''}`}
            >
              <ListItemText primary={chatroom.name} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
      <Box className="p-4">
        <Button variant="contained" color="secondary" fullWidth startIcon={<ExitToAppIcon />} onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </div>
  );
};

export default Sidebar;
