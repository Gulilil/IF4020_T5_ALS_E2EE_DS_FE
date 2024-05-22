export type SchnorrParams = {
  a: number
  p: string
  q: string
}

export type SchnorrKeys = {
  x: number
  y: number
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
