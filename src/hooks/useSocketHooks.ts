import { useEffect, useState } from 'react'
import socket from '../api/socket'
import { Message, SendMessagePayload } from '../dto/socket'

export const useJoinRoom = (selectedChatroom: number | null) => {
  const [messages, setMessages] = useState<{ [key: number]: Message[] }>({})

  useEffect(() => {
    if (selectedChatroom !== null) {
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
  setWaitingForMatch: (waiting: boolean) => void,
) => {
  const joinRealTimeQueue = (userId: string) => {
    setWaitingForMatch(true)
    socket.emit('joinRealTimeQueue', { userId })

    socket.on(
      'matchedRealTime',
      ({ roomId, receiverId }: { roomId: string; receiverId: string }) => {
        setSelectedChatroom(Number(roomId))
        setReceiverId(receiverId)
        setWaitingForMatch(false)
      },
    )

    socket.on('error', (message: string) => {
      console.error(message)
      setWaitingForMatch(false)
    })
  }

  return { joinRealTimeQueue }
}

export const useSendMessage = () => {
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

  return { addRealTimeMessage }
}
