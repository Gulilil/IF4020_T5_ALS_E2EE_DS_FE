import { Box } from '@mui/material'
import { Message } from '../../dto/socket'

interface MessageListProps {
  messages: Message[]
  currentUser: string
}

const MessageList = ({ messages, currentUser }: MessageListProps) => (
  <Box className="flex-1 p-4 overflow-y-auto bg-custom-chatroom px-20">
    {messages.map((msg, index) => (
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
)

export default MessageList
