import { describe, expect, it } from 'vitest'
import { exigirAdmin, exigirLogin, NaoAutorizadoError } from '../../src/main/modules/usuarios/authorization'
import { hashPassword } from '../../src/main/modules/usuarios/password'
import type { UsuarioCredencial, UsuarioRepository } from '../../src/main/modules/usuarios/usuario-repository'
import { CredenciaisInvalidasError, UsuarioService } from '../../src/main/modules/usuarios/usuario-service'
import type { UsuarioAutenticado } from '../../src/shared/contracts'

describe('autenticação e níveis de acesso', () => {
  it('autentica por e-mail normalizado e não retorna o hash', async () => {
    const hash = await hashPassword('senha-de-teste-123')
    const service = new UsuarioService(repository({ senhaHash: hash }))

    await expect(service.autenticar(' TESTE@EXAMPLE.COM ', 'senha-de-teste-123')).resolves.toEqual({
      id: 4,
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      nivel: 'atendente'
    })
  })

  it('não autentica senha incorreta ou usuário inativo', async () => {
    const hash = await hashPassword('senha-de-teste-123')
    const service = new UsuarioService(repository({ senhaHash: hash, ativo: false }))

    await expect(service.autenticar('teste@example.com', 'senha-de-teste-123'))
      .rejects.toBeInstanceOf(CredenciaisInvalidasError)
  })

  it('permite exclusão apenas ao administrador e exige sessão', () => {
    const admin: UsuarioAutenticado = { id: 1, nome: 'Admin', email: 'admin@example.com', nivel: 'admin' }
    const atendente: UsuarioAutenticado = { ...admin, nivel: 'atendente' }

    expect(() => exigirAdmin(admin)).not.toThrow()
    expect(() => exigirAdmin(atendente)).toThrow(NaoAutorizadoError)
    expect(() => exigirLogin(null)).toThrow('Faça login')
  })
})

function repository(overrides: Partial<UsuarioCredencial> = {}): UsuarioRepository {
  return {
    buscarPorEmail: async () => ({
      id: 4,
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senhaHash: '',
      nivel: 'atendente',
      ativo: true,
      ...overrides
    })
  }
}
