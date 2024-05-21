import axios from 'axios'
import { encryptECB } from '../utils/ecb'
import { adjustText, makeStringToBlocksArray } from '../utils/process'
const SKIP_INTERCEPTOR_URLS = ['http://localhost:8000/api/']

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Helper function to check if a URL should skip interceptors
const shouldSkipInterceptor = (url) => {
  return SKIP_INTERCEPTOR_URLS.some((skipUrl) => url === skipUrl)
}

apiClient.interceptors.request.use(
  (config) => {
    const cookieValue = document.cookie.replace(
      /(?:(?:^|.*;\s*)sharedKey\s*\=\s*([^;]*).*$)|^.*$/,
      '$1',
    )
    console.log('Ini cookie', cookieValue)
    const url = config.baseURL + config.url
    console.log('Ini url ', url)
    const stringData = JSON.stringify(config.data)
    const textAdjusted = adjustText(stringData)
    const textBlocks = makeStringToBlocksArray(textAdjusted, false)
    const key = makeStringToBlocksArray(cookieValue, true)[0]
    console.log('Ini key', key)
    const encryptedData = encryptECB(textBlocks, key)
    const data = encryptedData.join(',')
    const encodedData = Buffer.from(data).toString('base64')
    console.log('Ini encoded data', encodedData)
    config.data = encodedData
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
export default apiClient
