import { ec as EC } from 'elliptic'
import React, { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import HomeChat from './components/pages/HomeChat'
import { ROUTES } from './constants/routes'
import { useCookies } from 'react-cookie'
import apiClient from './api/apiClient'

const AppRoutes: React.FC = () => {
  const [, setCookie] = useCookies(['sharedKey'])
  const isKeyGeneratedRef = useRef<boolean>(false)

  useEffect(() => {
    const generateKey = async () => {
      const ec = new EC('secp256k1')
      let clientPrivateKey
      let clientPublicKey

      const storedPrivateKey = localStorage.getItem('clientPrivateKey')
      const storedPublicKey = localStorage.getItem('clientPublicKey')

      if (storedPrivateKey && storedPublicKey) {
        clientPrivateKey = ec.keyFromPrivate(storedPrivateKey, 'hex')
        clientPublicKey = clientPrivateKey.getPublic()
      } else {
        const key = ec.genKeyPair()
        clientPrivateKey = key.getPrivate()
        clientPublicKey = key.getPublic()

        localStorage.setItem(
          'clientPrivateKey',
          clientPrivateKey.toString('hex'),
        )
        localStorage.setItem(
          'clientPublicKey',
          clientPublicKey.encode('hex', false),
        )
      }

      try {
        const response = await apiClient.post('/key', {
          key: clientPublicKey.encode('hex', false),
        })

        if (response.status === 200) {
          const publicServerKey = response.data
          const serverKey = ec.keyFromPublic(publicServerKey, 'hex')
          const sharedSecret = (clientPrivateKey as EC.KeyPair)
            .derive(serverKey.getPublic())
            .toString(16)
          setCookie('sharedKey', sharedSecret, {
            path: '/',
            maxAge: 3600,
            secure: true,
            sameSite: 'strict',
          })
        }
      } catch (error) {
        console.error('Error generating key:', error)
      }
    }

    if (!isKeyGeneratedRef.current) {
      isKeyGeneratedRef.current = true
      generateKey()
    }
  }, [setCookie])

  return (
    <Router>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.CHATS} element={<HomeChat />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes
