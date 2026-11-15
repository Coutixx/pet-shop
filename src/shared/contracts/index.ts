export interface ClienteResumo {
  id: number
  nome: string
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
}

export interface DatabaseConnectionTestResult {
  ok: boolean
  message: string
}
