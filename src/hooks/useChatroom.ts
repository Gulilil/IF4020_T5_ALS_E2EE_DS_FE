import { useState, useEffect } from 'react'
import socket from '../api/socket'
import { Chatroom } from '../dto/socket'
import { getChatroomIds } from '../api/endpoints/roomchat'

export const useChatroom = () => {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([])
  const [selectedChatroom, setSelectedChatroom] = useState<number | null>(null)
  const [receiverId, setReceiverId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [waitingForMatch, setWaitingForMatch] = useState<boolean>(false)

  useEffect(() => {
    const initializeChatrooms = async () => {
      const currentUser = localStorage.getItem('id') || 'user1'
      const chatroomIds = await getChatroomIds(currentUser)

      const userChatrooms = chatroomIds.map((id: number) => ({
        chatroomId: id,
        name: `Chatroom ${id}`,
        isRemovable: true,
      }))

      setChatrooms([...userChatrooms])
      setLoading(false)

      socket.on('chatroomDeleted', (chatroomId: number) => {
        setChatrooms((prevChatrooms) =>
          prevChatrooms.filter(
            (chatroom) => chatroom.chatroomId !== chatroomId,
          ),
        )
        if (selectedChatroom === chatroomId) {
          setSelectedChatroom(null)
        }
      })

      socket.on(
        'matchedRealTime',
        ({ roomId, receiverId }: { roomId: number; receiverId: string }) => {
          setSelectedChatroom(roomId)
          setReceiverId(receiverId)
          setWaitingForMatch(false)
        },
      )
    }

    initializeChatrooms()

    return () => {
      socket.off('chatroomDeleted')
      socket.off('matchedRealTime')
    }
  }, [selectedChatroom])

  const deleteChatroom = (chatroomId: number) => {
    setChatrooms((prevChatrooms) =>
      prevChatrooms.filter((chatroom) => chatroom.chatroomId !== chatroomId),
    )
    if (selectedChatroom === chatroomId) {
      setSelectedChatroom(null)
    }
    socket.emit('deleteChatroom', { chatroomId })
  }

  return {
    chatrooms,
    setChatrooms,
    selectedChatroom,
    setSelectedChatroom,
    receiverId,
    setReceiverId,
    deleteChatroom,
    loading,
    waitingForMatch,
    setWaitingForMatch,
  }
}
