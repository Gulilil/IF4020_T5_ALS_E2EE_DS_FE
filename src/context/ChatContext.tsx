import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react'
import { SendMessagePayload, JoinRoomPayload } from '../dto/socket'
import socket from '../api/socket'

interface Message {
  text: string
  user: string
}

interface ChatContextType {
  chatrooms: { id: number; name: string }[]
  messages: { [key: number]: Message[] }
  selectedChatroom: number | null
  setSelectedChatroom: (id: number | null) => void
  addMessage: (chatroomId: number, message: string, user: string) => void
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
  ]

  const messageData: { [key: number]: Message[] } = {
    1: [
      { text: 'Hello in General!', user: 'user1' },
      { text: 'How are you?', user: 'user2' },
    ],
    2: [{ text: 'Random chat starts here.', user: 'user1' }],
    3: [{ text: 'Need help with something?', user: 'user2' }],
  }

  const [selectedChatroom, setSelectedChatroom] = useState<number | null>(null)
  const [messages, setMessages] = useState<{ [key: number]: Message[] }>(
    messageData,
  )

  useEffect(() => {
    if (selectedChatroom !== null) {
      const payload: JoinRoomPayload = { roomId: selectedChatroom.toString() }
      socket.emit('joinRoom', payload)

      socket.on('roomMessages', (roomMessages) => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedChatroom]: roomMessages,
        }))
      })

      socket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedChatroom]: [...prevMessages[selectedChatroom], message],
        }))
      })

      return () => {
        socket.off('roomMessages')
        socket.off('receiveMessage')
      }
    }
  }, [selectedChatroom])

  const addMessage = (chatroomId: number, message: string, user: string) => {
    const payload: SendMessagePayload = {
      roomId: chatroomId.toString(),
      senderId: user,
      receiverId: '',
      message,
    }
    socket.emit('sendMessage', payload)
  }

  return (
    <ChatContext.Provider
      value={{
        chatrooms: chatroomData,
        messages,
        selectedChatroom,
        setSelectedChatroom,
        addMessage,
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
