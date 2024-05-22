export interface JoinRoomPayload {
  roomId: string
}

export interface SendMessagePayload {
  roomId: string
  senderId: string
  receiverId: string
  message: string
  isSigned: boolean
  signature?: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  createdAt: string
  hashedMessage: string
  roomChatId: number
  isSigned: boolean
}

export interface Chatroom {
  chatroomId: number
  name: string
  isRemovable: boolean
}
