import { describe, expect, it } from 'vitest'
import {
  calcularSubtotalItem,
  calcularSubtotalPedido,
  calcularTotalPedido,
  criarItemPedido,
  itensExemploVenda42,
  type ItemPedido,
} from './item-pedido'

describe('itens do pedido', () => {
  it('preserva o preço unitário e a quantidade do item', () => {
    const dadosVenda: ItemPedido = {
      produtoId: 'PROD-001',
      nomeProduto: 'Ração premium',
      precoUnitario: 89.9,
      quantidade: 2,
    }
    const item = criarItemPedido(dadosVenda)

    dadosVenda.precoUnitario = 99.9
    dadosVenda.quantidade = 5

    expect(item.precoUnitario).toBe(89.9)
    expect(item.quantidade).toBe(2)
    expect(calcularSubtotalItem(item)).toBe(179.8)
    expect(Object.isFrozen(item)).toBe(true)
  })

  it('calcula subtotal de um item', () => {
    const item = criarItemPedido({
      produtoId: 'PROD-002',
      nomeProduto: 'Petisco natural',
      precoUnitario: 19.05,
      quantidade: 2,
    })

    expect(calcularSubtotalItem(item)).toBe(38.1)
  })

  it('calcula subtotal e total da venda 00042', () => {
    expect(calcularSubtotalPedido(itensExemploVenda42)).toBe(128)
    expect(calcularTotalPedido(itensExemploVenda42)).toBe(128)
    expect(calcularTotalPedido(itensExemploVenda42, 12.5)).toBe(140.5)
  })

  it('rejeita quantidade inválida', () => {
    expect(() =>
      criarItemPedido({
        produtoId: 'PROD-003',
        nomeProduto: 'Shampoo neutro',
        precoUnitario: 32.5,
        quantidade: 0,
      })
    ).toThrow(/quantidade/)
  })
})
