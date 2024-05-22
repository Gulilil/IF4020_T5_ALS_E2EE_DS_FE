import React, { useState } from 'react'
import {
  Box,
  TextField,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useChat } from '../context/ChatContext'
import useKey from '../hooks/useKey'
import { generateDigitalSignature } from '../utils/schnorr'

const Chatroom: React.FC = () => {
  const {
    selectedChatroom,
    messages,
    addRealTimeMessage,
    receiverId,
    isRealTime,
  } = useChat()
  const { schnorrParams } = useKey()
  const [message, setMessage] = useState<string>('')
  const [isSigning, setIsSigning] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [privateKey, setPrivateKey] = useState<string>('')

  const currentUser = localStorage.getItem('id') || 'user1'

  const handleSendMessage = (signature?: string) => {
    if (
      message.trim() &&
      selectedChatroom !== null &&
      receiverId &&
      isRealTime
    ) {
      addRealTimeMessage(
        selectedChatroom,
        message,
        currentUser,
        receiverId,
        isSigning,
        signature,
      )
      setMessage('')
    }
  }

  const handleSignToggle = () => {
    setIsSigning(!isSigning)
    if (!isSigning) {
      setOpen(true)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleKeySubmit = async () => {
    if (privateKey.trim() && schnorrParams) {
      const signature = await generateDigitalSignature(
        message,
        privateKey,
        schnorrParams,
      )
      setPrivateKey('')
      setOpen(false)
      handleSendMessage(JSON.stringify(signature))
    } else {
      console.error(
        'Private key is empty or Schnorr parameters are not initialized',
      )
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
      <AppBar position="static" sx={{ backgroundColor: '#1A1A1A' }}>
        <Toolbar>
          <Typography variant="h6" className="text-white flex-1">
            {`Chatroom ${selectedChatroom}`}
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
              style={{
                maxWidth: '70%',
                border: msg.isSigned ? '2px solid #FFD700' : 'none',
                backgroundColor: msg.isSigned ? '#FFF8DC' : '#262626',
                color: msg.isSigned ? '#000' : '#BDBDBD',
              }}
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
          disabled={!isRealTime}
        />
        <IconButton
          sx={{ color: '#CCCCCC' }}
          onClick={() => handleSendMessage()}
          disabled={!isRealTime}
        >
          <SendIcon />
        </IconButton>
        <Button
          onClick={handleSignToggle}
          color="primary"
          variant="contained"
          disabled={!isRealTime}
        >
          {isSigning ? 'Cancel Sign' : 'Sign Message'}
        </Button>
      </footer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enter Private Key</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Private Key"
            type="password"
            fullWidth
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleKeySubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Chatroom
