export type SchnorrParams = {
  a: number
  p: string
  q: string
}

export type SchnorrKeys = {
  x: number
  y: number
}

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

  // Concatenate the message with x and compute the hash e using Web Crypto API
  const concatenated = message + x.toString()
  const encoder = new TextEncoder()
  const data = encoder.encode(concatenated)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const e = BigInt(
    '0x' + hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join(''),
  )

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
