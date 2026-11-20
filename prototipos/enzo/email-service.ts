export interface ReciboEmail {
  destinatario: string
  vendaId: string
  cliente: string
  totalCentavos: number
}

export interface MensagemEmail {
  destinatario: string
  assunto: string
  corpo: string
  vendaId: string
  totalCentavos: number
}

export interface ResultadoEmailMock {
  modo: 'mock'
  destinatario: string
  vendaId: string
}

export type TransporteEmail = (mensagem: MensagemEmail) => Promise<unknown>

export interface ServicoEmail {
  enviarRecibo(recibo: ReciboEmail): Promise<unknown>
}

export interface VendaConfirmada {
  id: string
  cliente: string
  email: string
  totalCentavos: number
  status: 'confirmada'
}

export type ResultadoEnvioRecibo =
  | { enviado: true; resultado: unknown }
  | { enviado: false; erro: Error }

function validarRecibo(recibo: ReciboEmail): void {
  if (
    typeof recibo.destinatario !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recibo.destinatario)
  ) {
    throw new TypeError('O e-mail do destinatário é inválido.')
  }

  if (!recibo.vendaId || !recibo.cliente) {
    throw new TypeError('A venda e o cliente são obrigatórios.')
  }

  if (!Number.isSafeInteger(recibo.totalCentavos) || recibo.totalCentavos < 0) {
    throw new TypeError('O total da venda deve ser informado em centavos.')
  }
}

async function transporteSimulado(mensagem: MensagemEmail): Promise<ResultadoEmailMock> {
  return Object.freeze({
    modo: 'mock',
    destinatario: mensagem.destinatario,
    vendaId: mensagem.vendaId,
  })
}

export function criarServicoEmail(transporte?: TransporteEmail): ServicoEmail {
  const enviar = transporte ?? transporteSimulado

  return Object.freeze({
    async enviarRecibo(recibo: ReciboEmail): Promise<unknown> {
      validarRecibo(recibo)
      const totalFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(recibo.totalCentavos / 100)
      const mensagem: MensagemEmail = Object.freeze({
        destinatario: recibo.destinatario.trim(),
        assunto: `Recibo da venda #${recibo.vendaId}`,
        corpo: [
          `Olá, ${recibo.cliente}.`,
          `O total da venda #${recibo.vendaId} foi ${totalFormatado}.`,
          'Este envio é uma simulação de teste.',
        ].join('\n'),
        vendaId: String(recibo.vendaId),
        totalCentavos: recibo.totalCentavos,
      })

      return enviar(mensagem)
    },
  })
}

export async function tentarEnviarReciboVenda(
  venda: VendaConfirmada,
  servico: ServicoEmail
): Promise<ResultadoEnvioRecibo> {
  if (!venda || typeof venda !== 'object') {
    throw new TypeError('Os dados da venda são obrigatórios.')
  }

  if (!servico || typeof servico.enviarRecibo !== 'function') {
    throw new TypeError('O serviço de e-mail é inválido.')
  }

  try {
    const resultado = await servico.enviarRecibo({
      destinatario: venda.email,
      vendaId: venda.id,
      cliente: venda.cliente,
      totalCentavos: venda.totalCentavos,
    })
    return Object.freeze({ enviado: true, resultado })
  } catch (error) {
    const erro = error instanceof Error ? error : new Error('Falha desconhecida no envio do recibo.')
    return Object.freeze({ enviado: false, erro })
  }
}
