export interface ClienteResumo {
  id: number
  nome: string
}

export type NivelAcesso = 'admin' | 'atendente'

export interface UsuarioAutenticado {
  id: number
  nome: string
  email: string
  nivel: NivelAcesso
}

export interface Cliente {
  id: number
  nome: string
  email: string | null
  telefone: string
  cpf: string | null
  cep: string
  logradouro: string
  numero: string
  complemento: string | null
  bairro: string
  cidade: string
  uf: string
}

export type ClienteInput = Omit<Cliente, 'id'>

export interface EnderecoViaCep {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
}

export interface ProdutoResumo {
  id: number
  nome: string
  preco: number
  disponivel: boolean
}

export interface ItemPedidoRascunho {
  produtoId: number
  quantidade: number
}

export interface PedidoRascunho {
  clienteId: number
  entregadorId: number | null
  itens: ItemPedidoRascunho[]
  frete: number
  criadoEm: string
  previsaoEntrega: string | null
}

export interface DesktopApi {
  getAppVersion(): Promise<string>
  testDatabaseConnection(): Promise<DatabaseConnectionTestResult>
  login(email: string, senha: string): Promise<UsuarioAutenticado>
  logout(): Promise<void>
  getUsuarioAtual(): Promise<UsuarioAutenticado | null>
  listarClientes(): Promise<Cliente[]>
  criarCliente(input: ClienteInput): Promise<Cliente>
  atualizarCliente(id: number, input: ClienteInput): Promise<Cliente>
  excluirCliente(id: number): Promise<void>
  consultarCep(cep: string): Promise<EnderecoViaCep>
}

export interface DatabaseConnectionTestResult {
  ok: boolean
  message: string
}
