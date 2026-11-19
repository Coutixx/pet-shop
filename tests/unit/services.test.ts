import { describe, expect, it } from 'vitest'
import { CarrinhoService } from '../../src/services/CarrinhoService'
import { FreteService } from '../../src/services/FreteService'
import { CheckoutService } from '../../src/services/CheckoutService'
import { EntregadorService } from '../../src/services/EntregadorService'

describe('CarrinhoService', () => {
  it('adiciona produtos e calcula o subtotal', () => {
    const carrinho = new CarrinhoService()

    carrinho.adicionarItem({
      produtoId: 1,
      nome: 'Ração',
      precoUnitario: 50,
      quantidade: 2
    })

    expect(carrinho.calcularSubtotal()).toBe(100)
  })

  it('soma a quantidade quando o produto já existe', () => {
    const carrinho = new CarrinhoService()
    const produto = {
      produtoId: 1,
      nome: 'Ração',
      precoUnitario: 50,
      quantidade: 1
    }

    carrinho.adicionarItem(produto)
    carrinho.adicionarItem({ ...produto, quantidade: 2 })

    expect(carrinho.listarItens()[0].quantidade).toBe(3)
    expect(carrinho.calcularSubtotal()).toBe(150)
  })

  it('rejeita quantidade inválida', () => {
    const carrinho = new CarrinhoService()

    expect(() => carrinho.adicionarItem({
      produtoId: 1,
      nome: 'Ração',
      precoUnitario: 50,
      quantidade: 0
    })).toThrow('A quantidade deve ser um número inteiro positivo.')
  })

  it('remove produtos e limpa o carrinho', () => {
    const carrinho = new CarrinhoService()

    carrinho.adicionarItem({
      produtoId: 1,
      nome: 'Ração',
      precoUnitario: 50,
      quantidade: 1
    })

    expect(carrinho.removerItem(1)).toBe(true)
    expect(carrinho.calcularSubtotal()).toBe(0)

    carrinho.limparCarrinho()
    expect(carrinho.listarItens()).toHaveLength(0)
  })
})

describe('FreteService', () => {
  const frete = new FreteService()

  it('calcula o frete nas faixas de distância', () => {
    expect(frete.calcular(2)).toBe(5)
    expect(frete.calcular(5)).toBe(10)
    expect(frete.calcular(10)).toBe(15)
    expect(frete.calcular(20)).toBe(20)
  })

  it('rejeita distância negativa ou inválida', () => {
    expect(() => frete.calcular(-1)).toThrow()
    expect(() => frete.calcular(NaN)).toThrow()
  })
})

describe('CheckoutService', () => {
  it('calcula subtotal, frete e total', () => {
    const checkout = new CheckoutService()

    checkout.adicionarProduto(1, 'Ração', 50, 2)

    expect(checkout.calcularTotal(5)).toEqual({
      subtotal: 100,
      frete: 10,
      total: 110
    })
  })

  it('cria pedido conforme o contrato compartilhado', () => {
    const checkout = new CheckoutService()

    checkout.adicionarProduto(1, 'Ração', 50, 2)

    const pedido = checkout.criarPedido(10, null, 5)

    expect(pedido).toMatchObject({
      clienteId: 10,
      entregadorId: null,
      itens: [{ produtoId: 1, quantidade: 2 }],
      frete: 10,
      previsaoEntrega: null
    })

    expect(Number.isNaN(Date.parse(pedido.criadoEm))).toBe(false)
  })

  it('não permite criar pedido com carrinho vazio', () => {
    const checkout = new CheckoutService()

    expect(() => checkout.criarPedido(10, null, 5))
      .toThrow('O carrinho está vazio.')
  })

  it('rejeita cliente inválido', () => {
    const checkout = new CheckoutService()

    expect(() => checkout.criarPedido(0, null, 5))
      .toThrow('Cliente inválido.')
  })
})

describe('EntregadorService', () => {
  it('lista e busca entregadores', () => {
    const service = new EntregadorService()
    const entregadores = service.listar()

    expect(entregadores.length).toBeGreaterThan(0)
    expect(service.buscarPorId(entregadores[0].id)).toBeDefined()
  })

  it('adiciona entregador e impede ID duplicado', () => {
    const service = new EntregadorService()
    const id = Math.max(...service.listar().map(e => e.id)) + 1

    const entregador = {
      id,
      nome: 'Teste',
      telefone: '11999999999',
      veiculo: 'Moto',
      disponivel: true
    }

    expect(service.adicionar(entregador)).toEqual(entregador)
    expect(() => service.adicionar(entregador))
      .toThrow('Já existe um entregador com esse ID.')
  })

  it('atualiza e remove entregador', () => {
    const service = new EntregadorService()
    const id = Math.max(...service.listar().map(e => e.id)) + 1

    service.adicionar({
      id,
      nome: 'Teste',
      telefone: '11999999999',
      veiculo: 'Moto',
      disponivel: true
    })

    const atualizado = service.atualizar(id, {
      id: id + 100,
      nome: 'Teste Atualizado',
      telefone: '11888888888',
      veiculo: 'Carro',
      disponivel: false
    })

    expect(atualizado?.id).toBe(id)
    expect(atualizado?.nome).toBe('Teste Atualizado')
    expect(service.remover(id)).toBe(true)
    expect(service.buscarPorId(id)).toBeUndefined()
  })
})
