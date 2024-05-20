import { useState, useEffect } from 'react'
import socket from '../api/socket'
import { Chatroom } from '../dto/socket'


export const useChatroom = () => {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([])
  const [selectedChatroom, setSelectedChatroom] = useState<number | null>(null)
  const [receiverId, setReceiverId] = useState<string | null>(null)

  useEffect(() => {
    const initialChatrooms = [
      { chatroomId: 1, name: 'General', isRemovable: false },
      { chatroomId: 2, name: 'Random', isRemovable: false },
      { chatroomId: 3, name: 'Support', isRemovable: false },
      { chatroomId: 4, name: 'Test Chatroom Data', isRemovable: true },
    ];
    setChatrooms(initialChatrooms);
  }, []);

  const deleteChatroom = (chatroomId: number) => {
    setChatrooms((prevChatrooms) =>
      prevChatrooms.filter((chatroom) => chatroom.chatroomId !== chatroomId),
    );
    if (selectedChatroom === chatroomId) {
      setSelectedChatroom(null);
    }
    socket.emit('deleteChatroom', { chatroomId });
  };

  return {
    chatrooms,
    setChatrooms,
    selectedChatroom,
    setSelectedChatroom,
    receiverId,
    setReceiverId,
    deleteChatroom,
  }
}
