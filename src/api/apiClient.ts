import axios from 'axios'
import { decryptECB, encryptECB } from '../utils/ecb'
import {
  adjustText,
  makeStringToBlocksArray,
  makeBlocksArrayToString,
} from '../utils/process'

const SKIP_INTERCEPTOR_URLS = ['http://localhost:8000/api/key']

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const shouldSkipInterceptor = (url: string) => {
  return SKIP_INTERCEPTOR_URLS.some((skipUrl) => url.includes(skipUrl))
}

/* Request Interceptor */
apiClient.interceptors.request.use(
  (config) => {
    const url = config.baseURL! + config.url!
    if (shouldSkipInterceptor(url) || config.method?.toUpperCase() === 'GET') {
      return config
    }

    const cookieValue = document.cookie.replace(
      /(?:(?:^|.*;\s*)sharedKey\s*=\s*([^;]*).*$)|^.*$/,
      '$1',
    )

    const stringData = JSON.stringify(config.data)
    const textAdjusted = adjustText(stringData)
    const key = makeStringToBlocksArray(cookieValue, true)[0]
    const encryptedData = encryptECB(
      makeStringToBlocksArray(textAdjusted, false),
      key,
    )
    const data = makeBlocksArrayToString(encryptedData)
    config.data = JSON.stringify({ encrypted: data })
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

/* Response Interceptor */
apiClient.interceptors.response.use(
  (response) => {
    const url = response.config.baseURL! + response.config.url!
    if (shouldSkipInterceptor(url)) {
      return response
    }

    try {
      if (
        response.data.error === 'Unauthorized, need to initialize handshake'
      ) {
        alert('Session expired, reinitializing handshake...')
        window.location.reload()
        return Promise.reject(
          new Error('Unauthorized, need to initialize handshake'),
        )
      }

      const cookieValue = document.cookie.replace(
        /(?:(?:^|.*;\s*)sharedKey\s*=\s*([^;]*).*$)|^.*$/,
        '$1',
      )

      const encryptedData = response.data.encrypted
      if (!encryptedData) {
        throw new Error('No encrypted data found in response.')
      }

      const key = makeStringToBlocksArray(cookieValue, true)[0]
      const textBlocks = makeStringToBlocksArray(encryptedData, false)
      const decryptedBlocks = decryptECB(textBlocks, key)
      const decryptedString = makeBlocksArrayToString(decryptedBlocks)
      response.data = JSON.parse(decryptedString)
      return response
    } catch (error) {
      console.error('Decryption error', error)
      return Promise.reject(error)
    }
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default apiClient
