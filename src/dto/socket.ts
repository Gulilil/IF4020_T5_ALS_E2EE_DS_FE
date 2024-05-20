export interface JoinRoomPayload {
  roomId: string
}

export interface SendMessagePayload {
  roomId: string
  senderId: string
  receiverId: string
  message: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  createdAt: string
  hashedMessage: string
  roomChatId: number
}

export interface Chatroom {
  chatroomId: number
  name: string
  isRemovable: boolean
}
