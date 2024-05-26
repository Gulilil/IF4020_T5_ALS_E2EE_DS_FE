import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Chatroom, Message } from '../dto/socket'
import {
  useJoinQueue,
  useJoinRoom,
  useSendMessage,
} from '../hooks/useSocketHooks'
import { useChatroom } from '../hooks/useChatroom'
import { getMessagesInChatroom } from '../api/endpoints/roomchat'

interface ChatContextType {
  chatrooms: Chatroom[] | null
  messages: { [key: number]: Message[] }
  selectedChatroom: number | null
  receiverId: string | null
  isRealTime: boolean
  loading: boolean
  waitingForMatch: boolean
  setSelectedChatroom: (id: number | null) => void
  setIsRealTime: (isRealTime: boolean) => void
  deleteChatroom: (chatroomId: number) => void
  joinRealTimeQueue: (userId: string) => void
  addRealTimeMessage: (
    chatroomId: number,
    message: string,
    user: string,
    receiverId: string,
    isSigned: boolean,
    signature?: string,
    publicKey?: string,
  ) => void
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

  /** Context State */
  const [messages, setMessages] = useState<{ [key: number]: Message[] }>({})
  const [isRealTime, setIsRealTime] = useState<boolean>(false)

  /** Hooks Related to Chat */
  const realTimeMessages = useJoinRoom(selectedChatroom)
  const { joinRealTimeQueue } = useJoinQueue(
    setSelectedChatroom,
    setReceiverId,
    setWaitingForMatch,
  )
  const { addRealTimeMessage } = useSendMessage()

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
