import { describe, expect, it } from 'vitest'
import type { ClienteResumo, PedidoRascunho, ProdutoResumo } from '../../src/shared/contracts'

describe('contratos compartilhados', () => {
  it('mantém os dados do pedido serializáveis para comunicação IPC', () => {
    const cliente: ClienteResumo = { id: 1, nome: 'Ana Costa' }
    const produto: ProdutoResumo = { id: 7, nome: 'Ração', preco: 89.9, disponivel: true }
    const pedido: PedidoRascunho = {
      clienteId: cliente.id,
      entregadorId: null,
      itens: [{ produtoId: produto.id, quantidade: 2 }],
      frete: 12,
      criadoEm: '2026-11-15T12:00:00.000Z',
      previsaoEntrega: null
    }

    expect(JSON.parse(JSON.stringify({ cliente, produto, pedido }))).toEqual({
      cliente,
      produto,
      pedido
    })
  })
})
