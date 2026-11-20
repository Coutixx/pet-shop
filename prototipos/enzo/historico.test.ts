import { describe, expect, it } from 'vitest'
import { calcularResumoVendas, filtrarVendas } from './historico'

const vendas = [
  { id: '00042', cliente: 'Mariana Oliveira', totalCentavos: 12800 },
  { id: '00041', cliente: 'Rafael Santos', totalCentavos: 7450 },
  { id: '00040', cliente: 'Camila Ferreira', totalCentavos: 21980 },
]

describe('histórico de vendas', () => {
  it('filtra pedidos por número e cliente ignorando acentos e caixa', () => {
    expect(filtrarVendas(vendas, '00042')).toEqual([vendas[0]])
    expect(filtrarVendas(vendas, 'camíla')).toEqual([vendas[2]])
    expect(filtrarVendas(vendas, 'MARIANA')).toEqual([vendas[0]])
  })

  it('calcula resumo para vendas filtradas e lista vazia', () => {
    expect(calcularResumoVendas([vendas[0], vendas[1]])).toEqual({
      quantidade: 2,
      totalCentavos: 20250,
      ticketMedioCentavos: 10125,
    })
    expect(calcularResumoVendas([])).toEqual({
      quantidade: 0,
      totalCentavos: 0,
      ticketMedioCentavos: 0,
    })
  })

  it('rejeita total de venda inválido', () => {
    expect(() =>
      calcularResumoVendas([{ totalCentavos: 12.5 }])
    ).toThrow(/centavos/)
  })
})
