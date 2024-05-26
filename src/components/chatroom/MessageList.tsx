import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { Message } from '../../dto/socket'
import {
  adjustText,
  makeBlocksArrayToString,
  makeStringToBlocksArray,
} from '../../utils/process'
import { ECEG } from '../../class/ECEG'
import { ECEG_A, ECEG_B, ECEG_P, ECEG_X, ECEG_Y } from '../../utils/ECEGData'
import { Point } from '../../type/point'
import { decryptECB } from '../../utils/ecb'

interface MessageListProps {
  messages: Message[]
  currentUser: string
  onMessageClick: (message: Message) => void
  privateKey: string
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUser,
  onMessageClick,
  privateKey,
}) => {
  const [decryptedMessages, setDecryptedMessages] = useState<string[]>([])

  const alreadyinList = (str: string, strArr : Array<string>) => {
    for( let i = 0; i < strArr.length; i++){
      if (strArr[i] == str){
        return true
      }
    }
    return false
  }

  useEffect(() => {
    messages.map((message) => {
      if (message.senderId !== currentUser) {
        const realMessage = decryptIncomingMessage(
          message.hashedMessage,
          message.ecegVal,
        )
        if (!alreadyinList(realMessage, decryptedMessages)){
          setDecryptedMessages((prevMessages) => [...prevMessages, realMessage])
        }
      }
    })
  }, [messages])

  const decryptIncomingMessage = (hashedMessage: string, ecegVal: string) => {
    const adjustedMessage = adjustText(hashedMessage)

    // Decrypt ECEG
    const eceg = new ECEG()
    // Set pre-determined for a, b, p, and basepoint
    eceg.setValue(ECEG_A, ECEG_B, ECEG_P)
    const basePoint = new Point(ECEG_X, ECEG_Y)
    eceg.setBasePoint(basePoint)

    const pairPointVal = eceg.makeStringToPairPointValue(ecegVal)
    const pairPoint = eceg.getPointFromPairPointValue(pairPointVal)

    const secretPoint = eceg.decryptECEG(privateKey, pairPoint)
    const directKey = secretPoint.getPointValue()

    // Decrypt ECB
    const key = makeStringToBlocksArray(directKey, true)
    const decryptedData = decryptECB(
      makeStringToBlocksArray(adjustedMessage, false),
      key[0],
    )
    const data = makeBlocksArrayToString(decryptedData)

    return data
  }

  let messageIdx = 0;
  const handleDecryptedMessage = () => {
    const currIdx = messageIdx
    messageIdx += 1
    return decryptedMessages[currIdx]
  }

  return (
    <Box className="flex-1 p-4 overflow-y-auto bg-custom-chatroom px-20">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-2 flex ${msg.senderId === currentUser ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`p-2 rounded text-{BDBDBD} w-fit break-words`}
            style={{
              maxWidth: '70%',
              border: msg.isSigned ? '2px solid #FFD700' : 'none',
              backgroundColor: msg.isSigned ? '#FFF8DC' : '#262626',
              color: msg.isSigned ? '#000' : '#BDBDBD',
              cursor: msg.isSigned ? 'pointer' : 'default',
            }}
            onClick={msg.isSigned ? () => onMessageClick(msg) : undefined}
          >
            <div className="font-bold">{msg.senderId}</div>
            <div>
              {msg.senderId === currentUser
                ? msg.hashedMessage
                : handleDecryptedMessage()}

              {msg.senderId === currentUser && (
                <div className="mt-2 font-bold">{`[=ENCRYPTED=]`}</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </Box>
  )
}

export default MessageList
