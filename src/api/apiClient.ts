import axios from 'axios'
import { encryptECB } from '../utils/ecb'
import { adjustText, makeStringToBlocksArray } from '../utils/process'

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const cookieValue = document.cookie.replace(
      /(?:(?:^|.*;\s*)sharedKey\s*\=\s*([^;]*).*$)|^.*$/,
      '$1',
    )
    if (config.data) {
      console.log('Plain data ; ', config.data)
      const stringData = JSON.stringify(config.data)
      const textAdjusted = adjustText(stringData)
      const textBlocks = makeStringToBlocksArray(textAdjusted, false)
      const key = makeStringToBlocksArray(cookieValue, true)[0]
      const encrypedData = encryptECB(textBlocks, key)
      const data = encrypedData.join(',')
      const encodedData = Buffer.from(data, 'base64').toString('utf8')
      config.data = encodedData
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
export default apiClient
