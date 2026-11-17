import { describe, expect, it, vi } from 'vitest'
import { ViaCepError, ViaCepService } from '../../src/main/modules/viacep/viacep-service'

describe('consulta ViaCEP', () => {
  it('converte resposta válida para o contrato do aplicativo', async () => {
    const service = new ViaCepService(async () => response({
      cep: '13083-000', logradouro: 'Rua de Exemplo', complemento: '',
      bairro: 'Centro', localidade: 'Campinas', uf: 'SP'
    }))

    await expect(service.consultar('13083-000')).resolves.toEqual({
      cep: '13083000', logradouro: 'Rua de Exemplo', complemento: '',
      bairro: 'Centro', cidade: 'Campinas', uf: 'SP'
    })
  })

  it('rejeita CEP malformado antes de fazer a chamada', async () => {
    const request = vi.fn()
    const service = new ViaCepService(request as unknown as typeof fetch)

    await expect(service.consultar('123')).rejects.toBeInstanceOf(ViaCepError)
    expect(request).not.toHaveBeenCalled()
  })

  it('trata CEP inexistente, resposta incompleta e falha de rede', async () => {
    const missing = new ViaCepService(async () => response({ erro: true }))
    const malformed = new ViaCepService(async () => response({ cep: '13083000' }))
    const offline = new ViaCepService(async () => { throw new TypeError('offline') })

    await expect(missing.consultar('00000000')).rejects.toThrow('CEP não encontrado')
    await expect(malformed.consultar('13083000')).rejects.toThrow('dados incompletos')
    await expect(offline.consultar('13083000')).rejects.toThrow('conexão')
  })
})

function response(payload: unknown): Response {
  return { ok: true, json: async () => payload } as Response
}
