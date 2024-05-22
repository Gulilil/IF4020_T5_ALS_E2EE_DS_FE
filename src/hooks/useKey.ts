import { ec as EC } from 'elliptic'
import { useState } from 'react'
import { getSchnorrParameters } from '../api/endpoints/key'
import { getRandomBigInt, modExp } from '../dto/key/schnorr'

const useKey = () => {
  const [privateE2EEKey, setPrivateE2EEKey] = useState<string>('')
  const [publicE2EEKey, setPublicE2EEKey] = useState<string>('')
  const [privateSchnorrKey, setPrivateSchnorrKey] = useState<string>('')
  const [publicSchnorrKey, setPublicSchnorrKey] = useState<string>('')

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
      const response = await getSchnorrParameters()
      const { a, p, q } = response

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
    handleGenerateE2EEKey,
    privateSchnorrKey,
    publicSchnorrKey,
    handleGenerateSchnorrKey,
  }
}

export default useKey
