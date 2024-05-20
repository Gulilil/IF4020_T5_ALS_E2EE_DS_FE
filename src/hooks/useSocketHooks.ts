import { useEffect, useState } from 'react'
import socket from '../api/socket'
import { JoinRoomPayload, Message } from '../dto/socket'

export const useJoinRoom = (selectedChatroom: number | null) => {
  const [messages, setMessages] = useState<{ [key: number]: Message[] }>({})

  useEffect(() => {
    if (selectedChatroom !== null) {
      const payload: JoinRoomPayload = { roomId: selectedChatroom.toString() }
      socket.emit('joinRoom', payload)

      socket.on('receiveMessage', (message: Message) => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [message.roomChatId]: [
            ...(prevMessages[message.roomChatId] || []),
            message,
          ],
        }))
      })

      socket.on('roomMessages', (roomMessages: Message[]) => {
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

  return messages
}

export const useJoinQueue = (
  setSelectedChatroom: (id: number | null) => void,
  setReceiverId: (id: string | null) => void,
) => {
  const [isRealTimeChat, setIsRealTimeChat] = useState<boolean>(false)

  const joinQueue = (userId: string, chatroomId: number) => {
    setIsRealTimeChat(false)
    socket.emit('joinQueue', { userId, chatroomId })

    socket.on(
      'matched',
      ({ roomId, receiverId }: { roomId: string; receiverId: string }) => {
        setSelectedChatroom(Number(roomId))
        setReceiverId(receiverId)
      },
    )

    socket.on('error', (message: string) => {
      console.error(message)
    })
  }

  const joinRealTimeQueue = (userId: string) => {
    setIsRealTimeChat(true)
    socket.emit('joinRealTimeQueue', { userId })

    socket.on(
      'matchedRealTime',
      ({ roomId, receiverId }: { roomId: string; receiverId: string }) => {
        setSelectedChatroom(Number(roomId))
        setReceiverId(receiverId)
      },
    )

    socket.on('error', (message: string) => {
      console.error(message)
    })
  }

  return { isRealTimeChat, joinQueue, joinRealTimeQueue }
}
