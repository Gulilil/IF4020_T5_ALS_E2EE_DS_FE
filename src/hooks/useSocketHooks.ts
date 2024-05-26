import { useEffect, useState } from 'react'
import socket from '../api/socket'
import { Message, SendMessagePayload } from '../dto/socket'
import {
  adjustText,
  makeBlocksArrayToString,
  makeStringToBlocksArray,
} from '../utils/process'
import { encryptECB } from '../utils/ecb'
import { ECEG } from '../class/ECEG'
import { ECEG_A, ECEG_B, ECEG_P, ECEG_X, ECEG_Y } from '../utils/ECEGData'
import { Point } from '../type/point'

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
    publicKey?: string,
  ) => {
    const messageAdjusted = adjustText(message)

    // Setup Encryption for ECEG
    const eceg = new ECEG()
    // Set pre-determined for a, b, p, and basepoint
    eceg.setValue(ECEG_A, ECEG_B, ECEG_P)
    const basePoint = new Point(ECEG_X, ECEG_Y)
    eceg.setBasePoint(basePoint)
    const secretPoint = eceg.getRandomPoint()
    const directKey = secretPoint.getPointValue()

    const k = eceg.getKValue()

    // Encryption using ECB
    const key = makeStringToBlocksArray(directKey, true)
    const encryptedData = encryptECB(
      makeStringToBlocksArray(messageAdjusted, false),
      key[0],
    )
    const data = makeBlocksArrayToString(encryptedData)

    // Closing Encryption
    const publicKeyPoint = new Point(0,0)
    publicKeyPoint.setPointValue(publicKey!)
    const pairPoint = eceg.encryptECEG(k, basePoint, secretPoint, publicKeyPoint)
    const pairPointVal = eceg.getValueFromPairPoint(pairPoint)
    const ecegVal = eceg.makePairPointValueToString(pairPointVal)


    const payload: SendMessagePayload = {
      roomId: chatroomId.toString(),
      senderId: user,
      receiverId,
      message: data,
      isSigned,
      signature,
      ecegVal
    }
    socket.emit('sendRealTimeMessage', payload)
  }

  return { addRealTimeMessage }
}
