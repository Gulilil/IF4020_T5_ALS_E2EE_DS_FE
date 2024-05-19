import React from 'react'
import { ChatProvider } from '../../context/ChatContext'
import Sidebar from '../SideBar'
import Chatroom from '../Chatroom'

const HomeChat: React.FC = () => {
  return (
    <ChatProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Chatroom />
        </div>
      </div>
    </ChatProvider>
  )
}

export default HomeChat
