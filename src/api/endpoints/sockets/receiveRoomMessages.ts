import socket from '../../socket'

export const receiveRoomMessages = (callback: (messages: unknown) => void) => {
  socket.on('roomMessages', callback)
}
