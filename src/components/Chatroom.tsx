import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useChat } from '../context/ChatContext'

const Chatroom: React.FC = () => {
  const {
    selectedChatroom,
    messages,
    addMessage,
    addRealTimeMessage,
    receiverId,
    fetchMessages,
    isRealTimeChat,
  } = useChat()
  const [message, setMessage] = useState<string>('')
  const currentUser = localStorage.getItem('id') || 'user1'

  const handleSendMessage = () => {
    if (message.trim() && selectedChatroom !== null && receiverId) {
      if (isRealTimeChat) {
        console.log(selectedChatroom)
        addRealTimeMessage(selectedChatroom, message, currentUser, receiverId)
      } else {
        addMessage(selectedChatroom, message, currentUser, receiverId)
      }
      setMessage('')
    }
  }

  useEffect(() => {
    if (selectedChatroom !== null && !isRealTimeChat) {
      const interval = setInterval(() => {
        fetchMessages(selectedChatroom)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [selectedChatroom, fetchMessages, isRealTimeChat])

  if (selectedChatroom === null) {
    return (
      <div className="text-center text-gray-500 flex-1 flex items-center justify-center">
        No chatroom selected
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col w-full">
      <AppBar position="static" sx={{ backgroundColor: '#1A1A1A' }}>
        <Toolbar>
          <Typography variant="h6" className="text-white flex-1">
            {`Chatroom ${isRealTimeChat ? 'Real-Time' : selectedChatroom}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box className="flex-1 p-4 overflow-y-auto bg-custom-chatroom px-20">
        {messages[selectedChatroom]?.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${msg.senderId === currentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-2 rounded text-{BDBDBD} w-fit break-words`}
              style={{ maxWidth: '70%' }}
            >
              <div className="font-bold">{msg.senderId}</div>
              <div>{msg.hashedMessage}</div>
            </div>
          </div>
        ))}
      </Box>
      <footer className="p-4 bg-custom-chatroom shadow flex justify-center">
        <TextField
          variant="outlined"
          sx={{
            backgroundColor: '#262626',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '100%',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#4a4a4a',
                borderRadius: '16px',
              },
              '&:hover fieldset': {
                borderColor: '#888888',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ffffff',
              },
              '& input': {
                color: '#ffffff',
              },
            },
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage()
            }
          }}
          InputProps={{
            style: {
              color: '#ffffff',
            },
          }}
        />
        <IconButton sx={{ color: '#CCCCCC' }} onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </footer>
    </div>
  )
}

export default Chatroom
