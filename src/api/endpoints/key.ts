import { SchnorrParams } from '../../dto/key/schnorr'
import apiClient from '../apiClient'

export const getSchnorrParameters = async () => {
  const response = await apiClient.get(`/key/schnorr`)
  if (response.data) {
    return response.data as SchnorrParams
  } else {
    throw new Error('Can not get schnorr params')
  }
}
