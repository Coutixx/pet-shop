import { describe, expect, it, vi } from 'vitest'
import type { Cliente, ClienteInput } from '../../src/shared/contracts'
import { ClienteNaoEncontradoError, ClienteService, EntradaInvalidaError } from '../../src/main/modules/clientes/cliente-service'
import type { ClienteRepository } from '../../src/main/modules/clientes/cliente-repository'

const clienteInput: ClienteInput = {
  nome: '  Ana Costa  ',
  email: ' ANA@EXAMPLE.COM ',
  telefone: '(19) 99999-0000',
  cpf: '529.982.247-25',
  cep: '13083-000',
  logradouro: 'Rua de Exemplo',
  numero: '10',
  complemento: null,
  bairro: 'Centro',
  cidade: 'Campinas',
  uf: 'sp'
}

describe('serviço de clientes', () => {
  it('normaliza dados antes de persistir', async () => {
    const repository = createRepository()
    const service = new ClienteService(repository)

    await service.criar(clienteInput)

    expect(repository.criar).toHaveBeenCalledWith({
      ...clienteInput,
      nome: 'Ana Costa',
      email: 'ana@example.com',
      cpf: '52998224725',
      cep: '13083000',
      uf: 'SP'
    })
  })

  it('rejeita entrada inválida antes de chamar o repositório', async () => {
    const repository = createRepository()
    const service = new ClienteService(repository)

    await expect(service.criar({ ...clienteInput, cep: '123' })).rejects.toBeInstanceOf(EntradaInvalidaError)
    expect(repository.criar).not.toHaveBeenCalled()
  })

  it('rejeita CPF com dígitos verificadores inválidos', async () => {
    const service = new ClienteService(createRepository())

    await expect(service.criar({ ...clienteInput, cpf: '111.111.111-11' }))
      .rejects.toThrow('CPF válido')
  })

  it('sinaliza edição de cliente inexistente', async () => {
    const service = new ClienteService(createRepository({ atualizar: async () => null }))

    await expect(service.atualizar(99, clienteInput)).rejects.toBeInstanceOf(ClienteNaoEncontradoError)
  })
})

function createRepository(overrides: Partial<ClienteRepository> = {}): ClienteRepository {
  const cliente: Cliente = { id: 1, ...clienteInput }
  return {
    listar: vi.fn(async () => [cliente]),
    buscarPorId: vi.fn(async () => cliente),
    criar: vi.fn(async (input) => ({ id: 1, ...input })),
    atualizar: vi.fn(async (id, input) => ({ id, ...input })),
    excluir: vi.fn(async () => true),
    ...overrides
  }
}