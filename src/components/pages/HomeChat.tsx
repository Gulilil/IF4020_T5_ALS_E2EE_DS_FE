import React from 'react'
import { ChatProvider } from '../../context/ChatContext'
import Sidebar from '../SideBar'
import Chatroom from '../Chatroom'

const HomeChat: React.FC = () => {
  return (
    <ChatProvider>
      <div className="flex h-screen w-screen">
        <Sidebar />
        <Chatroom />
      </div>
    </ChatProvider>
  )
}

export default HomeChat
