import React, { createContext, ReactNode, useContext, useState } from 'react'

interface ChatContextType {
  chatrooms: { id: number; name: string }[]
  messages: { [key: number]: string[] }
  selectedChatroom: number | null
  setSelectedChatroom: (id: number | null) => void
  addMessage: (chatroomId: number, message: string) => void
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

  const messageData = {
    1: ['Hello in General!', 'How are you?'],
    2: ['Random chat starts here.'],
    3: ['Need help with something?'],
  }

  const [selectedChatroom, setSelectedChatroom] = useState<number | null>(null)
  const [messages, setMessages] = useState<{ [key: number]: string[] }>(
    messageData,
  )

  const addMessage = (chatroomId: number, message: string) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [chatroomId]: [...prevMessages[chatroomId], message],
    }))
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
