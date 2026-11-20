export interface VendaHistorico {
  id: string
  cliente: string
  totalCentavos: number
}

export interface ResumoVendas {
  quantidade: number
  totalCentavos: number
  ticketMedioCentavos: number
}

function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim()
}

export function filtrarVendas<T extends Pick<VendaHistorico, 'id' | 'cliente'>>(
  vendas: readonly T[],
  consulta: string
): T[] {
  if (!Array.isArray(vendas)) {
    throw new TypeError('As vendas devem ser fornecidas em uma lista.')
  }

  const termo = normalizarTexto(consulta)
  if (!termo) return vendas.slice()

  return vendas.filter((venda) => {
    const textoVenda = normalizarTexto(`${venda.id} ${venda.cliente}`)
    return textoVenda.includes(termo)
  })
}

export function calcularResumoVendas(
  vendas: readonly Pick<VendaHistorico, 'totalCentavos'>[]
): ResumoVendas {
  if (!Array.isArray(vendas)) {
    throw new TypeError('As vendas devem ser fornecidas em uma lista.')
  }

  const totalCentavos = vendas.reduce((total, venda) => {
    if (!Number.isSafeInteger(venda.totalCentavos) || venda.totalCentavos < 0) {
      throw new TypeError('O total da venda deve ser informado em centavos.')
    }

    return total + venda.totalCentavos
  }, 0)

  return Object.freeze({
    quantidade: vendas.length,
    totalCentavos,
    ticketMedioCentavos: vendas.length ? Math.round(totalCentavos / vendas.length) : 0,
  })
}
