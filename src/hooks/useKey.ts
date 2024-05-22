import { ec as EC } from 'elliptic'
import { useEffect, useState } from 'react'
import { getSchnorrParameters } from '../api/endpoints/key'
import { SchnorrParams } from '../dto/key/schnorr'
import { generateDigitalSignature, getRandomBigInt, modExp, verifyDigitalSignature } from '../utils/schnorr'

const useKey = () => {
  const [schnorrParams, setSchnorrParams] = useState<SchnorrParams | null>(null)
  const [privateE2EEKey, setPrivateE2EEKey] = useState<string>('')
  const [publicE2EEKey, setPublicE2EEKey] = useState<string>('')
  const [privateSchnorrKey, setPrivateSchnorrKey] = useState<string>('')
  const [publicSchnorrKey, setPublicSchnorrKey] = useState<string>('')
  const [isGeneratingKey, setIsGeneratingKey] = useState<boolean>(false)

  useEffect(() => {
    const fetchSchnorrParams = async () => {
      try {
        const response = await getSchnorrParameters()
        setSchnorrParams(response)
      } catch (error) {
        console.error('Error fetching Schnorr parameters:', error)
      }
    }

    fetchSchnorrParams()
  }, [])

  const handleGenerateE2EEKey = () => {
    const ec = new EC('secp256k1')
    const key = ec.genKeyPair()
    const privateKey = key.getPrivate()
    const publicKey = key.getPublic()
    setPrivateE2EEKey(privateKey.toString('hex'))
    setPublicE2EEKey(publicKey.encode('hex', false))
  }

  const handleGenerateSchnorrKey = async () => {
    setIsGeneratingKey(true)
    try {
      if (!schnorrParams) {
        throw new Error('Schnorr params are not initialized')
      }
  
      const { a, p, q } = schnorrParams
  
      const aNew = BigInt(a)
      const pNew = BigInt(p)
      const qNew = BigInt(q)
  
      let retries = 0
      const maxRetries = 30000
      let success = false
  
      while (retries < maxRetries && !success) {
        const x = getRandomBigInt(qNew - 1n) + 1n
        const y = modExp(aNew, x, pNew)
  
        const privateKey = x.toString()
        const publicKey = y.toString()
  
        // Test self-verification
        const testMessage = 'Test message for key verification'
        const signature = await generateDigitalSignature(testMessage, privateKey, schnorrParams)
  
        const isValid = await verifyDigitalSignature(testMessage, JSON.stringify(signature), publicKey, schnorrParams)
  
        if (isValid) {
          setPrivateSchnorrKey(privateKey)
          setPublicSchnorrKey(publicKey)
          success = true
          console.log('Schnorr keys generated and verified successfully')
        } else {
          retries++
          console.log(`Retry ${retries}: Self-verification failed.`)
        }
      }
  
      if (!success) {
        console.error('Failed to generate valid Schnorr keys after maximum retries')
      }
  
    } catch (error) {
      console.error('Error generating Schnorr keys:', error)
    } finally {
      setIsGeneratingKey(false)
    }
  } 

  return {
    privateE2EEKey,
    publicE2EEKey,
    privateSchnorrKey,
    publicSchnorrKey,
    schnorrParams,
    handleGenerateSchnorrKey,
    handleGenerateE2EEKey,
    isGeneratingKey,
  }
}

export default useKey
