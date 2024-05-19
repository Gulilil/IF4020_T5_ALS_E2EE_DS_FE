import { SendMessagePayload } from '../../../dto/socket'
import socket from '../../socket'

export const sendMessage = (
  roomId: string,
  senderId: string,
  receiverId: string,
  message: string,
) => {
  return new Promise<void>((resolve, reject) => {
    const payload: SendMessagePayload = {
      roomId,
      senderId,
      receiverId,
      message,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.emit('sendMessage', payload, (response: any) => {
      if (response.error) {
        reject(response.error)
      } else {
        resolve()
      }
    })
  })
}
