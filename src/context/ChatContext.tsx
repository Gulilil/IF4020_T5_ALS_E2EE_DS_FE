import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Chatroom, Message, SendMessagePayload } from '../dto/socket'
import socket from '../api/socket'
import { useJoinQueue, useJoinRoom } from '../hooks/useSocketHooks'
import { useChatroom } from '../hooks/useChatroom'
import { getMessagesInChatroom } from '../api/endpoints/roomchat'

interface ChatContextType {
  chatrooms: Chatroom[] | null
  messages: { [key: number]: Message[] }
  selectedChatroom: number | null
  receiverId: string | null
  isRealTime: boolean
  setSelectedChatroom: (id: number | null) => void
  addRealTimeMessage: (
    chatroomId: number,
    message: string,
    user: string,
    receiverId: string,
    isSigned: boolean,
    signature?: string,
  ) => void
  joinRealTimeQueue: (userId: string) => void
  deleteChatroom: (chatroomId: number) => void
  loading: boolean
  waitingForMatch: boolean
  setIsRealTime: (isRealTime: boolean) => void
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
    loading,
    waitingForMatch,
    setWaitingForMatch,
  } = useChatroom()

  const [isRealTime, setIsRealTime] = useState<boolean>(false)

  const realTimeMessages = useJoinRoom(selectedChatroom)

  const [messages, setMessages] = useState<{ [key: number]: Message[] }>({})

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChatroom !== null && !isRealTime) {
        const fetchedMessages = await getMessagesInChatroom(selectedChatroom)
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedChatroom]: fetchedMessages,
        }))
      }
    }

    fetchMessages()
  }, [selectedChatroom, isRealTime])

  useEffect(() => {
    if (isRealTime) {
      setMessages(realTimeMessages)
    }
  }, [realTimeMessages, isRealTime])

  const { joinRealTimeQueue } = useJoinQueue(
    setSelectedChatroom,
    setReceiverId,
    setWaitingForMatch,
  )

  const addRealTimeMessage = (
    chatroomId: number,
    message: string,
    user: string,
    receiverId: string,
    isSigned: boolean,
    signature?: string,
  ) => {
    const payload: SendMessagePayload = {
      roomId: chatroomId.toString(),
      senderId: user,
      receiverId,
      message,
      isSigned,
      signature,
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
        isRealTime,
        setSelectedChatroom,
        addRealTimeMessage,
        joinRealTimeQueue,
        deleteChatroom,
        loading,
        waitingForMatch,
        setIsRealTime,
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
