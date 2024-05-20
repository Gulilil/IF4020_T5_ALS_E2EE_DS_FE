import { createContext, ReactNode, useContext, useState } from 'react'
import { Message, SendMessagePayload } from '../dto/socket'
import socket from '../api/socket'
import { useJoinQueue, useJoinRoom } from '../hooks/useSocketHooks'

interface ChatContextType {
  chatrooms: { id: number; name: string }[]
  messages: { [key: number]: Message[] }
  selectedChatroom: number | null
  receiverId: string | null
  setSelectedChatroom: (id: number | null) => void
  addMessage: (
    chatroomId: number,
    message: string,
    user: string,
    receiverId: string,
  ) => void
  addRealTimeMessage: (
    chatroomId: number,
    message: string,
    user: string,
    receiverId: string,
  ) => void
  isRealTimeChat: boolean
  joinQueue: (userId: string, chatroomId: number) => void
  joinRealTimeQueue: (userId: string) => void
  fetchMessages: (chatroomId: number) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
  children: ReactNode
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const chatroomData = [
    { id: 1, name: 'General' },
    { id: 2, name: 'Random' },
    { id: 3, name: 'Support' },
    { id: 4, name: 'Test Chatroom Data' },
  ]

  const [selectedChatroom, setSelectedChatroom] = useState<number | null>(null)
  const [receiverId, setReceiverId] = useState<string | null>(null)

  const messages = useJoinRoom(selectedChatroom)
  const { isRealTimeChat, joinQueue, joinRealTimeQueue } = useJoinQueue(
    setSelectedChatroom,
    setReceiverId,
  )

  const addMessage = (
    chatroomId: number,
    message: string,
    user: string,
    receiverId: string,
  ) => {
    const payload: SendMessagePayload = {
      roomId: chatroomId.toString(),
      senderId: user,
      receiverId,
      message,
    }
    socket.emit('sendMessage', payload)
  }

  const fetchMessages = (chatroomId: number) => {
    socket.emit('fetchMessages', { roomId: chatroomId.toString() })
  }

  const addRealTimeMessage = (
    chatroomId: number,
    message: string,
    user: string,
    receiverId: string,
  ) => {
    const payload: SendMessagePayload = {
      roomId: chatroomId.toString(),
      senderId: user,
      receiverId,
      message,
    }
    socket.emit('sendRealTimeMessage', payload)
  }

  return (
    <ChatContext.Provider
      value={{
        chatrooms: chatroomData,
        messages,
        selectedChatroom,
        receiverId,
        setSelectedChatroom,
        addMessage,
        addRealTimeMessage,
        joinQueue,
        joinRealTimeQueue,
        fetchMessages,
        isRealTimeChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
