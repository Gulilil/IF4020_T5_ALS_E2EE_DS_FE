import { Message } from '../../dto/socket'
import apiClient from '../apiClient'

export const getChatroomIds = async (userId: string) => {
  const response = await apiClient.get(`/roomchat/${userId}/ids`)
  if (response.data) {
    return response.data as number[]
  } else {
    throw new Error('Invalid username or password')
  }
}

export const getMessagesInChatroom = async (chatroomId: number) => {
  const response = await apiClient.get(`/roomchat/${chatroomId}/messages`)
  if (response.data) {
    return response.data as Message[]
  } else {
    throw new Error('Can not fetch messages')
  }
}
