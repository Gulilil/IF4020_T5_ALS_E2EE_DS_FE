export class Keccak {
  private static RC = [
    0x0000000000000001n,
    0x0000000000008082n,
    0x800000000000808an,
    0x8000000080008000n,
    0x000000000000808bn,
    0x0000000080000001n,
    0x8000000080008081n,
    0x8000000000008009n,
    0x000000000000008an,
    0x0000000000000088n,
    0x0000000080008009n,
    0x000000008000000an,
    0x000000008000808bn,
    0x800000000000008bn,
    0x8000000000008089n,
    0x8000000000008003n,
    0x8000000000008002n,
    0x8000000000000080n,
    0x000000000000800an,
    0x800000008000000an,
    0x8000000080008081n,
    0x8000000000008080n,
    0x0000000080000001n,
    0x8000000080008008n,
  ]

  private static r = [
    [0, 36, 3, 41, 18],
    [1, 44, 10, 45, 2],
    [62, 6, 43, 15, 61],
    [28, 55, 25, 21, 56],
    [27, 20, 39, 8, 14],
  ]

  private static ROT(x: bigint, n: number): bigint {
    return (
      ((x << BigInt(n)) & (BigInt(2 ** 64) - BigInt(1))) | (x >> BigInt(64 - n))
    )
  }

  private static keccak_f(state: bigint[]): bigint[] {
    for (let round = 0; round < 24; round++) {
      // θ step
      const C: bigint[] = Array(5).fill(0n)
      const D: bigint[] = Array(5).fill(0n)
      for (let x = 0; x < 5; x++) {
        C[x] =
          state[x] ^
          state[x + 5] ^
          state[x + 10] ^
          state[x + 15] ^
          state[x + 20]
      }
      for (let x = 0; x < 5; x++) {
        D[x] = C[(x + 4) % 5] ^ Keccak.ROT(C[(x + 1) % 5], 1)
        for (let y = 0; y < 5; y++) {
          state[x + 5 * y] ^= D[x]
        }
      }

      // ρ and π steps
      const B: bigint[] = Array(25).fill(0n)
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          B[(y % 5) * 5 + ((2 * x + 3 * y) % 5)] = Keccak.ROT(
            state[x + 5 * y],
            Keccak.r[x][y],
          )
        }
      }

      // χ step
      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          state[x + 5 * y] =
            B[x + 5 * y] ^
            (~B[((x + 1) % 5) + 5 * y] & B[((x + 2) % 5) + 5 * y])
        }
      }

      // ι step
      state[0] ^= Keccak.RC[round]
    }
    return state
  }

  private static pad(x: number, m: number): Uint8Array {
    const j = (-m - 2) % x
    const paddingLength = ((j + x) % x) + 1
    const result = new Uint8Array(paddingLength)
    result[0] = 0x01
    result[paddingLength - 1] = 0x80
    return result
  }

  private static sponge(
    input: Uint8Array,
    r: number,
    c: number,
    outputLength: number,
  ): Uint8Array {
    const state: bigint[] = Array(25).fill(0n)
    const rate = r / 8
    const outputBytes = outputLength / 8

    const inputPadded = new Uint8Array([
      ...input,
      ...Keccak.pad(rate, input.length),
    ])
    for (
      let blockStart = 0;
      blockStart < inputPadded.length;
      blockStart += rate
    ) {
      const block = inputPadded.subarray(blockStart, blockStart + rate)
      for (let i = 0; i < block.length / 8; i++) {
        const value = block
          .subarray(i * 8, (i + 1) * 8)
          .reduce(
            (acc, byte, index) => acc | (BigInt(byte) << (BigInt(index) * 8n)),
            0n,
          )
        state[i] ^= value
      }
      Keccak.keccak_f(state)
    }

    const z: number[] = []
    while (z.length < outputBytes) {
      for (let i = 0; i < rate / 8; i++) {
        const value = state[i]
        for (let j = 0; j < 8; j++) {
          z.push(Number((value >> (BigInt(j) * 8n)) & 0xffn))
        }
      }
      Keccak.keccak_f(state)
    }
    return new Uint8Array(z.slice(0, outputBytes))
  }

  public static hash(
    data: string,
    r: number = 1088,
    c: number = 512,
    outputLength: number = 256,
  ): string {
    const inputBytes = new TextEncoder().encode(data)
    const hashBytes = Keccak.sponge(inputBytes, r, c, outputLength)
    return Array.from(hashBytes)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
  }
}
