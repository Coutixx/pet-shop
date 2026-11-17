import type { UsuarioAutenticado } from '../../../shared/contracts'
import { verifyPassword } from './password'
import type { UsuarioRepository } from './usuario-repository'

export class CredenciaisInvalidasError extends Error {
  constructor() {
    super('E-mail ou senha inválidos.')
    this.name = 'CredenciaisInvalidasError'
  }
}

export class UsuarioService {
  constructor(private readonly repository: UsuarioRepository) {}

  async autenticar(email: string, senha: string): Promise<UsuarioAutenticado> {
    const emailNormalizado = typeof email === 'string' ? email.trim().toLowerCase() : ''
    if (!emailNormalizado || typeof senha !== 'string' || !senha) {
      throw new CredenciaisInvalidasError()
    }

    const usuario = await this.repository.buscarPorEmail(emailNormalizado)
    if (!usuario || !usuario.ativo || !(await verifyPassword(senha, usuario.senhaHash))) {
      throw new CredenciaisInvalidasError()
    }

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      nivel: usuario.nivel
    }
  }
}
