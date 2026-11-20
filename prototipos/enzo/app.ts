import {
  calcularResumoVendas,
  filtrarVendas,
  type VendaHistorico,
} from './historico'
import {
  criarServicoEmail,
  tentarEnviarReciboVenda,
  type VendaConfirmada,
} from './email-service'

interface VendaComElemento extends VendaHistorico {
  element: HTMLDetailsElement
}

const emailService = criarServicoEmail()
const sales: VendaComElemento[] = Array.from(
  document.querySelectorAll<HTMLDetailsElement>('.sale-card')
).map((element) => {
  const id = element.dataset.saleId
  const cliente = element.dataset.customer
  const totalCentavos = Number(element.dataset.totalCents)

  if (!id || !cliente || !Number.isSafeInteger(totalCentavos) || totalCentavos < 0) {
    throw new Error('Os dados da venda simulada são inválidos.')
  }

  return { id, cliente, totalCentavos, element }
})

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element) {
    throw new Error(`Elemento obrigatório não encontrado: ${selector}`)
  }
  return element
}

const searchInput = requireElement<HTMLInputElement>('#sales-search')
const emptyMessage = requireElement<HTMLElement>('#sales-empty')
const salesCount = requireElement<HTMLElement>('#sales-count')
const salesTotal = requireElement<HTMLElement>('#sales-total')
const salesAverage = requireElement<HTMLElement>('#sales-average')
const resultCount = requireElement<HTMLElement>('#sales-result-count')

const moneyFormat = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function renderSales(consulta: string): void {
  const filtradas = filtrarVendas(sales, consulta)
  const resumo = calcularResumoVendas(filtradas)
  const idsVisiveis = new Set(filtradas.map((venda) => venda.id))

  for (const venda of sales) {
    venda.element.hidden = !idsVisiveis.has(venda.id)
  }

  salesCount.textContent = String(resumo.quantidade)
  salesTotal.textContent = moneyFormat.format(resumo.totalCentavos / 100)
  salesAverage.textContent = moneyFormat.format(resumo.ticketMedioCentavos / 100)
  resultCount.textContent = `${resumo.quantidade} ${
    resumo.quantidade === 1 ? 'venda' : 'vendas'
  }`
  emptyMessage.hidden = resumo.quantidade !== 0
}

searchInput.addEventListener('input', () => renderSales(searchInput.value))
renderSales('')

document.addEventListener('click', (event: MouseEvent) => {
  if (!(event.target instanceof Element)) return

  const printButton = event.target.closest<HTMLButtonElement>('[data-print-receipt]')
  if (!printButton) return

  const selectedSale = printButton.closest<HTMLDetailsElement>('.sale-card')
  if (!selectedSale) {
    throw new Error('O recibo precisa estar dentro de um pedido.')
  }

  selectedSale.open = true
  window.print()
})

document.addEventListener('click', async (event: MouseEvent) => {
  if (!(event.target instanceof Element)) return

  const sendButton = event.target.closest<HTMLButtonElement>('[data-send-receipt]')
  if (!sendButton) return

  const selectedSale = sendButton.closest<HTMLDetailsElement>('.sale-card')
  const status = selectedSale?.querySelector<HTMLElement>('[data-email-status]')
  if (!selectedSale || !status) {
    throw new Error('O pedido não possui os controles de envio do recibo.')
  }

  const venda: VendaConfirmada = Object.freeze({
    id: selectedSale.dataset.saleId ?? '',
    cliente: selectedSale.dataset.customer ?? '',
    email: selectedSale.dataset.email ?? '',
    totalCentavos: Number(selectedSale.dataset.totalCents),
    status: 'confirmada',
  })

  sendButton.disabled = true
  status.hidden = false
  status.className = 'email-status'
  status.textContent = 'Processando envio em modo de teste...'

  try {
    const resultado = await tentarEnviarReciboVenda(venda, emailService)
    if (resultado.enviado) {
      status.classList.add('success')
      status.textContent =
        `Recibo da venda #${venda.id} processado em modo mock. Nenhum e-mail real foi enviado.`
    } else {
      status.classList.add('error')
      status.textContent =
        `A venda #${venda.id} continua confirmada. O recibo não foi enviado: ${resultado.erro.message} Tente novamente.`
    }
  } finally {
    sendButton.disabled = false
  }
})
