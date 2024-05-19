import { JoinRoomPayload } from '../../../dto/socket'
import socket from '../../socket'

export const joinRoom = (roomId: string) => {
  return new Promise<void>((resolve, reject) => {
    const payload: JoinRoomPayload = { roomId }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.emit('joinRoom', payload, (response: any) => {
      if (response.error) {
        reject(response.error)
      } else {
        resolve()
      }
    })
  })
}
