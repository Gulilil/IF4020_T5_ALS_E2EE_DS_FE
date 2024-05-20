import { createContext, ReactNode, useContext } from 'react'
import { Chatroom, Message, SendMessagePayload } from '../dto/socket'
import socket from '../api/socket'
import { useJoinQueue, useJoinRoom } from '../hooks/useSocketHooks'
import { useChatroom } from '../hooks/useChatroom'

interface ChatContextType {
  chatrooms: Chatroom[] | null
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
  deleteChatroom: (chatroomId: number) => void
  loading: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
  children: ReactNode
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const {
    chatrooms,
    selectedChatroom,
    setSelectedChatroom,
    receiverId,
    setReceiverId,
    deleteChatroom,
    loading
  } = useChatroom()

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
        chatrooms,
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
        deleteChatroom,
        loading
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
