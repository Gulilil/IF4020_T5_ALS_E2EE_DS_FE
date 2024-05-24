import React, { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import HomeChat from './components/pages/HomeChat'
import { ROUTES } from './constants/routes'
import { useCookies } from 'react-cookie'
import apiClient from './api/apiClient'
import { ECDH } from './class/ECDH'
import { makeNumToHex } from './utils/functions'
import { generatePrimeNumber } from './utils/number'
import { eccBase } from './type/eccBase'
import { Point } from './type/point'
// import { ec as EC } from 'elliptic'


const AppRoutes: React.FC = () => {
  const [, setCookie] = useCookies(['sharedKey'])
  const isKeyGeneratedRef = useRef<boolean>(false)

  useEffect(() => {
    const generateKey = async () => {

      // ECDH Key Generator
      // const ec = new EC('secp256k1')
      const ecdh = new ECDH();
      let clientPrivateKey : string
      let clientPublicKey : string

      const storedPrivateKey = localStorage.getItem('clientPrivateKey')
      const storedPublicKey = localStorage.getItem('clientPublicKey')

      if (storedPrivateKey && storedPublicKey) {
        // clientPrivateKey = ec.keyFromPrivate(storedPrivateKey, 'hex')
        // clientPublicKey = clientPrivateKey.getPublic()

        clientPrivateKey = storedPrivateKey
        clientPublicKey = storedPublicKey
      } else {
        // const key = ec.genKeyPair()
        // clientPrivateKey = key.getPrivate()
        // clientPublicKey = key.getPublic()

        clientPrivateKey = makeNumToHex(generatePrimeNumber()) 
        const basePoint = ecdh.getRandomPoint()
        clientPublicKey = ecdh.multiplyPoint(basePoint, clientPrivateKey).getPointValue()

        localStorage.setItem(
          'clientPrivateKey',
          clientPrivateKey
        )
        localStorage.setItem(
          'clientPublicKey',
          clientPublicKey,
        )

      }

      try {
        // Client asks for handshake

        const eccBaseData : eccBase = {a: ecdh.aVal, b: ecdh.bVal, p: ecdh.pVal, pointVal: ecdh.basePoint.getPointValue()}
        const response = await apiClient.post('/key', {
          // key: clientPublicKey.encode('hex', false),
          key: clientPublicKey,
          eccData : eccBaseData
        })

        if (response.status === 200) {
          const publicServerKey = response.data

          // const serverKey = ec.keyFromPublic(publicServerKey, 'hex')
          // const sharedSecret = (clientPrivateKey as EC.KeyPair)
          //   .derive(serverKey.getPublic())
          //   .toString(16)

          const publicServerKeyPoint = new Point(0,0)
          publicServerKeyPoint.setPointValue(publicServerKey)

          const sharedSecretKeyPoint = ecdh.multiplyPoint(publicServerKeyPoint, clientPrivateKey)
          const sharedSecretKey = sharedSecretKeyPoint.getPointValue()
          setCookie('sharedKey', sharedSecretKey, {
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
