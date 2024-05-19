import { ec as EC } from 'elliptic'
import React, { useEffect, useState } from 'react'
import apiClient from '../../api/apiClient'
import { useCookies } from 'react-cookie'
const TestingSocket: React.FC = () => {
  const [cookies, setCookies] = useCookies(['sharedKey'])
  const [message, setMessage] = useState('')
  const [isKeyGenerated, setIsKeyGenerated] = useState(false)
  useEffect(() => {
    const generateKey = async () => {
      setIsKeyGenerated(true)

      const ec = new EC('secp256k1')
      const key = ec.genKeyPair()
      const clientPublicKey = key.getPublic()
      try {
        const response = await apiClient.post('/', {
          key: clientPublicKey.encode('hex', false),
        })
        if (response.status === 200) {
          const publicServerKey = response.data
          const serverKey = ec.keyFromPublic(publicServerKey, 'hex')
          const sharedSecret = key.derive(serverKey.getPublic()).toString(16)
          console.log('Ini sharedSecret di client', sharedSecret)
          setCookies('sharedKey', sharedSecret)
        }
      } catch (error) {
        // console.error(error)
      }
      console.log('Ini cookies : ', cookies.sharedKey)
    }
    if (!isKeyGenerated) {
      generateKey()
    }
  }, [])
  // useEffect(() => {
  //   const newSocket = io('http://localhost:8000')
  //   const ec = new EC('secp256k1')
  //   const key = ec.genKeyPair()
  //   const clientPublicKey = key.getPublic()
  //   newSocket.on('connect', () => {
  //     console.log('Connected to server')

  //     newSocket.emit('clientPublicKey', {
  //       publicKey: clientPublicKey.encode('hex', false),
  //       userId: 123,
  //     })
  //   })
  //   newSocket.on('publicKey', (serverPublicKey) => {
  //     console.log('Receive server public key')
  //     const serverKey = ec.keyFromPublic(serverPublicKey, 'hex')
  //     const sharedSecret = key.derive(serverKey.getPublic()).toString(16)

  //     console.log('Shared secret:', sharedSecret)
  //   })

  //   newSocket.on('status', (message) => {
  //     if (message === 'PAIRED') {
  //       console.log('FInd a match!')
  //     }
  //     if (message == 'WAITING') {
  //       console.log('Waiting!')
  //     }
  //     console.log('Ini message : ', message)
  //   })
  // }, [])
  // const hanldeSubmit = () => {
  //   console.log('Submitted with message', message)
  //   if (socketRef.current) {
  //     socketRef.current.emit('sendMessage', message)
  //   }
  // }
  return (
    <>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {/* {cookies && <p>{cookies.sharedKey}</p>} */}
      {/* <button onClick={hanldeSubmit}>Send</button> */}
    </>
  )
}

export default TestingSocket
