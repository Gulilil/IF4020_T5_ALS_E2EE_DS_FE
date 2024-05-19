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
import useAuth from '../hooks/useAuth'

const Sidebar: React.FC = () => {
  const { handleLogout } = useAuth()
  const { chatrooms, selectedChatroom, setSelectedChatroom, joinQueue, joinRealTimeQueue } = useChat()
  const currentUser = localStorage.getItem('id') || 'user1'

  const handleJoinQueue = (chatroomId: number) => {
    joinQueue(currentUser, chatroomId)
  }

  const handleJoinRealTimeQueue = () => {
    setSelectedChatroom(-1)
    joinRealTimeQueue(currentUser)
  }

  return (
    <div className="w-60 h-full bg-gray-900 text-white flex flex-col">
      <Box className="flex-1 overflow-y-auto bg-custom-chatroom-sidebar">
        <List>
          {chatrooms.map((chatroom) => (
            <ListItem
              button
              key={chatroom.id}
              onClick={() => {
                setSelectedChatroom(chatroom.id)
                handleJoinQueue(chatroom.id)
              }}
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
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#666666',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#777777',
            },
            marginTop: '10px',
          }}
          fullWidth
          onClick={handleJoinRealTimeQueue}
        >
          Join Real-Time Queue
        </Button>
      </Box>
    </div>
  )
}

export default Sidebar
