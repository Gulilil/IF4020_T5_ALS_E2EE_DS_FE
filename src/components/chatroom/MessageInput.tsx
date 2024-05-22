import React from 'react'
import {
  TextField,
  IconButton,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

interface MessageInputProps {
  message: string
  setMessage: React.Dispatch<React.SetStateAction<string>>
  handleKeyPress: (e: React.KeyboardEvent) => void
  handleMessageSend: () => void
  isRealTime: boolean
  isSigning: boolean
  setIsSigning: React.Dispatch<React.SetStateAction<boolean>>
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  handleKeyPress,
  handleMessageSend,
  isRealTime,
  isSigning,
  setIsSigning,
}) => (
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
      onKeyPress={handleKeyPress}
      InputProps={{
        style: {
          color: '#ffffff',
        },
      }}
      disabled={!isRealTime}
    />
    <IconButton
      sx={{ color: '#CCCCCC' }}
      onClick={handleMessageSend}
      disabled={!isRealTime}
    >
      <SendIcon />
    </IconButton>
    <FormControlLabel
      control={
        <Checkbox
          checked={isSigning}
          onChange={(e) => setIsSigning(e.target.checked)}
          sx={{
            color: '#ffffff',
            '&.Mui-checked': {
              color: '#ffffff',
            },
          }}
        />
      }
      label="Sign Message"
      sx={{ color: '#ffffff', marginLeft: '10px' }}
    />
  </footer>
)

export default MessageInput
