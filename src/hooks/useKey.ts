import { ec as EC } from 'elliptic'
import { useEffect, useState } from 'react'
import { getSchnorrParameters } from '../api/endpoints/key'
import { getRandomBigInt, modExp, SchnorrParams } from '../dto/key/schnorr'

const useKey = () => {
  const [schnorrParams, setSchnorrParams] = useState<SchnorrParams | null>(null)
  const [privateE2EEKey, setPrivateE2EEKey] = useState<string>('')
  const [publicE2EEKey, setPublicE2EEKey] = useState<string>('')
  const [privateSchnorrKey, setPrivateSchnorrKey] = useState<string>('')
  const [publicSchnorrKey, setPublicSchnorrKey] = useState<string>('')

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
    try {
      if (!schnorrParams) {
        throw new Error('Schnorr params is not initialized')
      }

      const { a, p, q } = schnorrParams

      const aNew = BigInt(a)
      const pNew = BigInt(p)
      const qNew = BigInt(q)

      const x = getRandomBigInt(qNew - 1n) + 1n
      const y = modExp(aNew, x, pNew)

      setPrivateSchnorrKey(x.toString())
      setPublicSchnorrKey(y.toString())
    } catch (error) {
      console.error('Error generating Schnorr keys:', error)
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
  }
}

export default useKey
