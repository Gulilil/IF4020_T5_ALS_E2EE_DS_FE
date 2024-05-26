import { SchnorrParams } from '../dto/key/schnorr'
import { Keccak } from './keccak'

export async function generateDigitalSignature(
  message: string,
  privateKey: string,
  params: SchnorrParams,
): Promise<{ e: string; y: string }> {
  const { a, p, q } = params
  const aBigInt = BigInt(a)
  const pBigInt = BigInt(p)
  const qBigInt = BigInt(q)
  const privateKeyBigInt = BigInt(privateKey)

  // Generate a random number r
  const r = getRandomBigInt(qBigInt - 1n) + 1n

  // Compute x = α^r mod p
  const x = modExp(aBigInt, r, pBigInt)

  const concatenated = message + x.toString()
  const eHash = Keccak.hash(concatenated)
  const e = BigInt('0x' + eHash) % qBigInt

  // Compute y = (r + se) mod q
  const y = (r + privateKeyBigInt * e) % qBigInt

  // Return the signature
  return { e: e.toString(), y: y.toString() }
}

export function modExp(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n
  base = base % mod
  while (exp > 0) {
    if (exp % 2n === 1n) result = (result * base) % mod
    exp = exp >> 1n
    base = (base * base) % mod
  }
  return result
}

export function getRandomBigInt(max: bigint): bigint {
  let result = BigInt(0)
  const bitLength = max.toString(2).length
  const bytes = Math.ceil(bitLength / 8)
  const buffer = new Uint8Array(bytes)
  window.crypto.getRandomValues(buffer)
  for (let i = 0; i < bytes; i++) {
    result = (result << BigInt(8)) + BigInt(buffer[i])
  }
  if (result > max) {
    return getRandomBigInt(max)
  }
  return result
}

export async function verifyDigitalSignature(
  message: string,
  signature?: string,
  publicKey?: string,
  params?: SchnorrParams,
): Promise<boolean> {
  if (!signature || !publicKey || !params) {
    return false
  }

  const { e, y } = JSON.parse(signature)
  const { a, p, q } = params
  const aBigInt = BigInt(a)
  const pBigInt = BigInt(p)
  const qBigInt = BigInt(q)
  const eBigInt = BigInt(e) % qBigInt
  const yBigInt = BigInt(y) % qBigInt
  const publicKeyBigInt = BigInt(publicKey)

  console.log('Public Key:', publicKeyBigInt.toString())
  console.log('Signature e:', eBigInt.toString())
  console.log('Signature y:', yBigInt.toString())

  // Compute x' = α^y * β^(-e) mod p
  const x1 = modExp(aBigInt, yBigInt, pBigInt)
  const x2 = modExp(publicKeyBigInt, qBigInt - eBigInt, pBigInt)
  const xPrime = (x1 * x2) % pBigInt
  console.log('Computed xPrime:', xPrime.toString())

  const concatenated = message + xPrime.toString()
  const ePrimeHash = Keccak.hash(concatenated)
  const ePrime = BigInt('0x' + ePrimeHash) % qBigInt
  console.log('Computed ePrime:', ePrime.toString())

  const isValid = ePrime === eBigInt
  console.log('Is valid:', isValid)
  return isValid
}
