import React from 'react'
import { Box } from '@mui/material'
import { Message } from '../../dto/socket'
import { decryptECB } from '../../utils/ecb'
import {
  adjustText,
  makeBlocksArrayToString,
  makeStringToBlocksArray,
} from '../../utils/process'

interface MessageListProps {
  messages: Message[]
  currentUser: string
  onMessageClick: (message: Message) => void
  publicKey: string
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUser,
  onMessageClick,
  publicKey,
}) => {
  const decryptOwnMessage = (message: string) => {
    // const data = decryptECB(makeStringToBlocksArray(message, false), publicKey)
    const adjustMessage = adjustText(message)
    // Kalau dia dikiirm sama diri sendiri, tinggal decrypt aja pake fungsi yg sama (symmetrical)
    const result = decryptECB(
      makeStringToBlocksArray(adjustMessage, false),
      publicKey,
    )
    return makeBlocksArrayToString(result)
  }
  return (
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
              cursor: msg.isSigned ? 'pointer' : 'default',
            }}
            onClick={msg.isSigned ? () => onMessageClick(msg) : undefined}
          >
            <div className="font-bold">{msg.senderId}</div>
            <div>
              {msg.senderId === currentUser
                ? decryptOwnMessage(msg.hashedMessage)
                : msg.hashedMessage}
            </div>
          </div>
        </div>
      ))}
    </Box>
  )
}

export default MessageList
