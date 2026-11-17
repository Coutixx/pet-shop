import type { EnderecoViaCep } from '../../../shared/contracts'

export class ViaCepError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ViaCepError'
  }
}

type Fetcher = typeof fetch

export class ViaCepService {
  constructor(private readonly request: Fetcher = fetch) {}

  async consultar(cepInput: string): Promise<EnderecoViaCep> {
    const cep = typeof cepInput === 'string' ? cepInput.replace(/\D/g, '') : ''
    if (!/^\d{8}$/.test(cep)) throw new ViaCepError('Informe um CEP válido com 8 dígitos.')

    let response: Response
    try {
      response = await this.request(`https://viacep.com.br/ws/${cep}/json/`, {
        signal: AbortSignal.timeout(5000)
      })
    } catch {
      throw new ViaCepError('Não foi possível consultar o ViaCEP. Verifique a conexão e tente novamente.')
    }

    if (!response.ok) throw new ViaCepError('O ViaCEP está indisponível no momento. Tente novamente.')

    let payload: unknown
    try {
      payload = await response.json()
    } catch {
      throw new ViaCepError('O ViaCEP retornou uma resposta inválida.')
    }

    if (!payload || typeof payload !== 'object') {
      throw new ViaCepError('O ViaCEP retornou uma resposta inválida.')
    }

    const data = payload as Record<string, unknown>
    if (data.erro === true) throw new ViaCepError('CEP não encontrado.')
    if (
      typeof data.cep !== 'string' || typeof data.logradouro !== 'string' ||
      typeof data.bairro !== 'string' || typeof data.localidade !== 'string' ||
      typeof data.uf !== 'string'
    ) {
      throw new ViaCepError('O ViaCEP retornou dados incompletos.')
    }

    return {
      cep: data.cep.replace(/\D/g, ''),
      logradouro: data.logradouro,
      complemento: typeof data.complemento === 'string' ? data.complemento : '',
      bairro: data.bairro,
      cidade: data.localidade,
      uf: data.uf
    }
  }
}
