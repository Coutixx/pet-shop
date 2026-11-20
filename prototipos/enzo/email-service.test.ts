import { describe, expect, it } from 'vitest'
import {
  criarServicoEmail,
  tentarEnviarReciboVenda,
  type MensagemEmail,
  type VendaConfirmada,
} from './email-service'

const reciboExemplo = {
  destinatario: 'maria@example.test',
  vendaId: '00042',
  cliente: 'Mariana Oliveira',
  totalCentavos: 12800,
}

describe('serviço de e-mail', () => {
  it('envia recibo usando modo mock por padrão', async () => {
    const servico = criarServicoEmail()
    const resultado = await servico.enviarRecibo(reciboExemplo)

    expect(resultado).toEqual({
      modo: 'mock',
      destinatario: 'maria@example.test',
      vendaId: '00042',
    })
  })

  it('permite injetar transporte e envia somente dados do recibo', async () => {
    let mensagemEnviada: MensagemEmail | undefined
    const servico = criarServicoEmail(async (mensagem) => {
      mensagemEnviada = mensagem
      return { modo: 'teste' }
    })

    expect(await servico.enviarRecibo(reciboExemplo)).toEqual({ modo: 'teste' })
    expect(mensagemEnviada).toMatchObject({
      destinatario: reciboExemplo.destinatario,
      assunto: 'Recibo da venda #00042',
    })
    expect(mensagemEnviada?.corpo).toContain('128,00')
  })

  it('rejeita destinatário e total inválidos', async () => {
    const servico = criarServicoEmail()

    await expect(
      servico.enviarRecibo({ ...reciboExemplo, destinatario: 'invalido' })
    ).rejects.toThrow(/e-mail/)
    await expect(
      servico.enviarRecibo({ ...reciboExemplo, totalCentavos: 12.5 })
    ).rejects.toThrow(/centavos/)
  })

  it('propaga falhas do transporte para o fluxo chamador', async () => {
    const servico = criarServicoEmail(async () => {
      throw new Error('Transporte indisponível.')
    })

    await expect(servico.enviarRecibo(reciboExemplo)).rejects.toThrow(
      'Transporte indisponível.'
    )
  })

  it('mantém a venda confirmada quando o envio do recibo falha', async () => {
    const vendaConfirmada: VendaConfirmada = Object.freeze({
      id: '00042',
      cliente: 'Mariana Oliveira',
      email: 'maria@example.test',
      totalCentavos: 12800,
      status: 'confirmada',
    })
    const estadoAntes = { ...vendaConfirmada }
    const servico = criarServicoEmail(async () => {
      throw new Error('Transporte indisponível.')
    })

    const resultado = await tentarEnviarReciboVenda(vendaConfirmada, servico)

    expect(resultado.enviado).toBe(false)
    if (!resultado.enviado) {
      expect(resultado.erro.message).toMatch(/Transporte indisponível/)
    }
    expect(vendaConfirmada).toEqual(estadoAntes)
  })
})
