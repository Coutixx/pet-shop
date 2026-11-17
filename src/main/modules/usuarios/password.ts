import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)
const keyLength = 64

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const hash = (await scrypt(password, salt, keyLength)) as Buffer
  return `scrypt$${salt}$${hash.toString('hex')}`
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [algorithm, salt, hashHex] = storedHash.split('$')
  if (algorithm !== 'scrypt' || !salt || !hashHex || !/^[a-f\d]{128}$/i.test(hashHex)) return false

  const expected = Buffer.from(hashHex, 'hex')
  const actual = (await scrypt(password, salt, keyLength)) as Buffer
  return timingSafeEqual(actual, expected)
}