export interface ItemPedido {
  produtoId: string
  nomeProduto: string
  precoUnitario: number
  quantidade: number
}

function paraCentavos(valor: number): number {
  if (!Number.isFinite(valor) || valor < 0) {
    throw new TypeError('O valor monetário deve ser um número não negativo.')
  }

  return Math.round(valor * 100)
}

function deCentavos(valorCentavos: number): number {
  return valorCentavos / 100
}

export function criarItemPedido(dados: ItemPedido): Readonly<ItemPedido> {
  if (!dados.produtoId || !dados.nomeProduto) {
    throw new TypeError('produtoId e nomeProduto são obrigatórios.')
  }

  if (!Number.isInteger(dados.quantidade) || dados.quantidade <= 0) {
    throw new TypeError('A quantidade deve ser um número inteiro positivo.')
  }

  paraCentavos(dados.precoUnitario)

  return Object.freeze({
    produtoId: dados.produtoId,
    nomeProduto: dados.nomeProduto,
    precoUnitario: dados.precoUnitario,
    quantidade: dados.quantidade,
  })
}

export function calcularSubtotalItem(item: Readonly<ItemPedido>): number {
  return deCentavos(paraCentavos(item.precoUnitario) * item.quantidade)
}

export function calcularSubtotalPedido(
  itens: ReadonlyArray<Readonly<ItemPedido>>
): number {
  if (!Array.isArray(itens) || itens.length === 0) {
    throw new TypeError('O pedido deve conter pelo menos um item.')
  }

  const subtotalCentavos = itens.reduce(
    (total, item) => total + paraCentavos(item.precoUnitario) * item.quantidade,
    0
  )

  return deCentavos(subtotalCentavos)
}

export function calcularTotalPedido(
  itens: ReadonlyArray<Readonly<ItemPedido>>,
  frete = 0
): number {
  const subtotalCentavos = paraCentavos(calcularSubtotalPedido(itens))
  const totalCentavos = subtotalCentavos + paraCentavos(frete)
  return deCentavos(totalCentavos)
}

export const itensExemploVenda42: ReadonlyArray<Readonly<ItemPedido>> = Object.freeze([
  criarItemPedido({
    produtoId: 'PROD-001',
    nomeProduto: 'Ração premium para cães',
    precoUnitario: 89.9,
    quantidade: 1,
  }),
  criarItemPedido({
    produtoId: 'PROD-002',
    nomeProduto: 'Petisco natural',
    precoUnitario: 19.05,
    quantidade: 2,
  }),
])
