import socket from '../../socket'

export const receiveMessages = (callback: (message: unknown) => void) => {
  socket.on('receiveMessage', callback)
}
