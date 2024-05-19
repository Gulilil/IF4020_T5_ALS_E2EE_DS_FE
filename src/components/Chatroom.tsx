import React, { useState } from 'react'
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
  const { selectedChatroom, messages, addMessage } = useChat()
  const [message, setMessage] = useState<string>('')

  const handleSendMessage = () => {
    if (message.trim() && selectedChatroom !== null) {
      addMessage(selectedChatroom, message)
      setMessage('')
    }
  }

  if (selectedChatroom === null) {
    return (
      <div className="text-center text-gray-500 flex-1 flex items-center justify-center">
        No chatroom selected
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col w-full">
      <AppBar position="static" className="bg-blue-600">
        <Toolbar>
          <Typography variant="h6" className="text-white flex-1">
            {`Chatroom ${selectedChatroom}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box className="flex-1 p-4 overflow-y-auto">
        {messages[selectedChatroom]?.map((msg, index) => (
          <div key={index} className="mb-2">
            <div className="bg-white p-2 rounded shadow">{msg}</div>
          </div>
        ))}
      </Box>
      <footer className="p-4 bg-white shadow flex">
        <TextField
          variant="outlined"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage()
            }
          }}
        />
        <IconButton color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </footer>
    </div>
  )
}

export default Chatroom
