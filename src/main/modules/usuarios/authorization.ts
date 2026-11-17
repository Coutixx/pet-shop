import type { UsuarioAutenticado } from '../../../shared/contracts'

export class NaoAutorizadoError extends Error {
  constructor(message = 'Faça login para continuar.') {
    super(message)
    this.name = 'NaoAutorizadoError'
  }
}

export function exigirLogin(usuario: UsuarioAutenticado | null): asserts usuario is UsuarioAutenticado {
  if (!usuario) throw new NaoAutorizadoError()
}

export function exigirAdmin(usuario: UsuarioAutenticado | null): void {
  exigirLogin(usuario)
  if (usuario.nivel !== 'admin') {
    throw new NaoAutorizadoError('Somente administradores podem excluir clientes.')
  }
}