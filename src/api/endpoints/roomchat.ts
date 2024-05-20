import apiClient from '../apiClient'

export const getChatroomIds = async (userId: string) => {
  const response = await apiClient.get(`/roomchat/${userId}/ids`)
  if (response.data) {
    return response.data as number[]
  } else {
    throw new Error('Invalid username or password')
  }
}
