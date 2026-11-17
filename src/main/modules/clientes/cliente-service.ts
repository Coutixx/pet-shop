import type { Cliente, ClienteInput } from '../../../shared/contracts'
import type { ClienteRepository } from './cliente-repository'

export class EntradaInvalidaError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EntradaInvalidaError'
  }
}

export class ClienteNaoEncontradoError extends Error {
  constructor() {
    super('Cliente não encontrado.')
    this.name = 'ClienteNaoEncontradoError'
  }
}

export class ClienteService {
  constructor(private readonly repository: ClienteRepository) {}

  listar(): Promise<Cliente[]> {
    return this.repository.listar()
  }

  async criar(input: ClienteInput): Promise<Cliente> {
    return this.repository.criar(validarCliente(input))
  }

  async atualizar(id: number, input: ClienteInput): Promise<Cliente> {
    validarId(id)
    const cliente = await this.repository.atualizar(id, validarCliente(input))
    if (!cliente) throw new ClienteNaoEncontradoError()
    return cliente
  }

  async excluir(id: number): Promise<void> {
    validarId(id)
    if (!(await this.repository.excluir(id))) throw new ClienteNaoEncontradoError()
  }
}

function validarCliente(input: ClienteInput): ClienteInput {
  if (!input || typeof input !== 'object') {
    throw new EntradaInvalidaError('Dados do cliente inválidos.')
  }

  const cliente: ClienteInput = {
    nome: normalizar(input.nome),
    email: normalizarOpcional(input.email)?.toLowerCase() ?? null,
    telefone: normalizar(input.telefone),
    cpf: normalizarOpcional(input.cpf)?.replace(/\D/g, '') ?? null,
    cep: normalizar(input.cep).replace(/\D/g, ''),
    logradouro: normalizar(input.logradouro),
    numero: normalizar(input.numero),
    complemento: normalizarOpcional(input.complemento) ?? null,
    bairro: normalizar(input.bairro),
    cidade: normalizar(input.cidade),
    uf: normalizar(input.uf).toUpperCase()
  }

  if (cliente.nome.length < 2 || cliente.nome.length > 120) {
    throw new EntradaInvalidaError('Informe um nome entre 2 e 120 caracteres.')
  }
  if (cliente.email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email) || cliente.email.length > 254)) {
    throw new EntradaInvalidaError('Informe um e-mail válido.')
  }
  if (cliente.telefone.replace(/\D/g, '').length < 10 || cliente.telefone.length > 20) {
    throw new EntradaInvalidaError('Informe um telefone válido com DDD.')
  }
  if (cliente.cpf && !cpfValido(cliente.cpf)) {
    throw new EntradaInvalidaError('Informe um CPF válido.')
  }
  if (!/^\d{8}$/.test(cliente.cep)) throw new EntradaInvalidaError('O CEP deve conter 8 dígitos.')
  if (!cliente.logradouro || !cliente.numero || !cliente.bairro || !cliente.cidade) {
    throw new EntradaInvalidaError('Preencha logradouro, número, bairro e cidade.')
  }
  if (!/^[A-Z]{2}$/.test(cliente.uf)) throw new EntradaInvalidaError('Informe uma UF válida com 2 letras.')
  if (
    cliente.telefone.length > 20 || cliente.logradouro.length > 160 || cliente.numero.length > 20 ||
    (cliente.complemento?.length ?? 0) > 100 || cliente.bairro.length > 100 || cliente.cidade.length > 100
  ) {
    throw new EntradaInvalidaError('Um ou mais campos excedem o tamanho permitido.')
  }

  return cliente
}

function cpfValido(cpf: string): boolean {
  if (!/^\d{11}$/.test(cpf) || /^([0-9])\1{10}$/.test(cpf)) return false

  const calcularDigito = (tamanho: number): number => {
    const soma = cpf.slice(0, tamanho).split('').reduce(
      (total, digito, indice) => total + Number(digito) * (tamanho + 1 - indice),
      0
    )
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }

  return calcularDigito(9) === Number(cpf[9]) && calcularDigito(10) === Number(cpf[10])
}

function normalizar(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizarOpcional(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function validarId(id: number): void {
  if (!Number.isSafeInteger(id) || id < 1) throw new EntradaInvalidaError('Identificador de cliente inválido.')
}
