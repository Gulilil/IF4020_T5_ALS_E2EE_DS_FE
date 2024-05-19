import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Divider,
} from '@mui/material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { useChat } from '../context/ChatContext'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

const Sidebar: React.FC = () => {
  const { chatrooms, selectedChatroom, setSelectedChatroom } = useChat()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('username')
    navigate(ROUTES.HOME)
  }

  return (
    <div className="w-60 h-full bg-gray-900 text-white flex flex-col">
      <Box className="flex-1 overflow-y-auto bg-custom-chatroom-sidebar">
        <List>
          {chatrooms.map((chatroom) => (
            <ListItem
              button
              key={chatroom.id}
              onClick={() => setSelectedChatroom(chatroom.id)}
              selected={chatroom.id === selectedChatroom}
              className={`hover:bg-gray-700 ${chatroom.id === selectedChatroom ? 'bg-gray-800' : ''}`}
            >
              <ListItemText primary={chatroom.name} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider className="bg-custom-chatroom-sidebar" />
      <Box className="p-4 bg-custom-chatroom-sidebar">
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#222222',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#333333',
            },
          }}
          fullWidth
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </div>
  )
}

export default Sidebar
