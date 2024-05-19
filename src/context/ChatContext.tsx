import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react'
import { SendMessagePayload, JoinRoomPayload } from '../dto/socket'
import socket from '../api/socket'

export interface Message {
  id: string
  senderId: string
  receiverId: string
  createdAt: string
  hashedMessage: string
  roomChatId: number
}

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
  ]

  const [selectedChatroom, setSelectedChatroom] = useState<number | null>(null)
  const [messages, setMessages] = useState<{ [key: number]: Message[] }>({})
  const [receiverId, setReceiverId] = useState<string | null>(null)
  const [isRealTimeChat, setIsRealTimeChat] = useState<boolean>(false)

  useEffect(() => {
    if (selectedChatroom !== null) {
      const payload: JoinRoomPayload = { roomId: selectedChatroom.toString() }
      socket.emit('joinRoom', payload)

      socket.on('receiveMessage', (message: Message) => {
        console.log('Message received:', message)
        setMessages((prevMessages) => ({
          ...prevMessages,
          [message.roomChatId]: [
            ...(prevMessages[message.roomChatId] || []),
            message,
          ],
        }))
      })

      socket.on('roomMessages', (roomMessages: Message[]) => {
        console.log('Room messages received:', roomMessages)
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedChatroom]: roomMessages,
        }))
      })

      return () => {
        socket.off('roomMessages')
        socket.off('receiveMessage')
      }
    }
  }, [selectedChatroom])

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

  const joinQueue = (userId: string, chatroomId: number) => {
    setIsRealTimeChat(false)
    socket.emit('joinQueue', { userId, chatroomId })

    socket.on(
      'matched',
      ({ roomId, receiverId }: { roomId: string; receiverId: string }) => {
        setSelectedChatroom(Number(roomId))
        setReceiverId(receiverId)
        console.log(`Matched to room: ${roomId}`)
      },
    )

    socket.on('error', (message: string) => {
      console.error(message)
    })
  }

  const fetchMessages = (chatroomId: number) => {
    socket.emit('fetchMessages', { roomId: chatroomId.toString() })
  }

  const joinRealTimeQueue = (userId: string) => {
    setIsRealTimeChat(true)
    socket.emit('joinRealTimeQueue', { userId })

    socket.on(
      'matchedRealTime',
      ({ roomId, receiverId }: { roomId: string; receiverId: string }) => {
        setSelectedChatroom(Number(roomId))
        setReceiverId(receiverId)
        console.log(`Matched to real-time room: ${roomId}`)
      },
    )

    socket.on('error', (message: string) => {
      console.error(message)
    })
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
