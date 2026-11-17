import { describe, expect, it } from 'vitest'
import { hashPassword, verifyPassword } from '../../src/main/modules/usuarios/password'

describe('hash de senha', () => {
  it('armazena scrypt com salt e verifica a senha sem guardar texto puro', async () => {
    const hash = await hashPassword('senha-forte-de-teste')

    expect(hash).toMatch(/^scrypt\$[a-f\d]{32}\$[a-f\d]{128}$/)
    expect(hash).not.toContain('senha-forte-de-teste')
    await expect(verifyPassword('senha-forte-de-teste', hash)).resolves.toBe(true)
    await expect(verifyPassword('senha-incorreta', hash)).resolves.toBe(false)
  })

  it('recusa hashes malformados', async () => {
    await expect(verifyPassword('qualquer', 'hash-invalido')).resolves.toBe(false)
  })
})