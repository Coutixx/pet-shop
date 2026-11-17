import 'bootstrap/dist/css/bootstrap.min.css'
import type { Cliente, ClienteInput, UsuarioAutenticado } from '../../shared/contracts'

const version = requiredElement<HTMLElement>('#app-version')
const testDatabaseButton = requiredElement<HTMLButtonElement>('#test-db')
const databaseStatus = requiredElement<HTMLElement>('#db-status')
const loginView = requiredElement<HTMLElement>('#login-view')
const loginForm = requiredElement<HTMLFormElement>('#login-form')
const loginSubmit = requiredElement<HTMLButtonElement>('#login-submit')
const clientsView = requiredElement<HTMLElement>('#clients-view')
const clientsList = requiredElement<HTMLTableSectionElement>('#clients-list')
const clientsEmpty = requiredElement<HTMLElement>('#clients-empty')
const clientForm = requiredElement<HTMLFormElement>('#client-form')
const saveClientButton = requiredElement<HTMLButtonElement>('#save-client')
const sessionActions = requiredElement<HTMLElement>('#session-actions')
const sessionUser = requiredElement<HTMLElement>('#session-user')
const appStatus = requiredElement<HTMLElement>('#app-status')
const lookupCepButton = requiredElement<HTMLButtonElement>('#lookup-cep')
const logoutButton = requiredElement<HTMLButtonElement>('#logout')
let usuarioAtual: UsuarioAutenticado | null = null
let clienteEmEdicao: number | null = null

window.petShop.getAppVersion()
  .then((appVersion) => {
    version.textContent = `Versão ${appVersion}`
  })
  .catch(() => {
    version.textContent = 'Versão indisponível'
  })

testDatabaseButton.addEventListener('click', async () => {
  testDatabaseButton.disabled = true
  databaseStatus.className = 'small text-secondary'
  databaseStatus.textContent = 'Testando conexão...'

  try {
    const result = await window.petShop.testDatabaseConnection()
    databaseStatus.className = result.ok ? 'small text-success' : 'small text-danger'
    databaseStatus.textContent = result.message
  } catch {
    databaseStatus.className = 'small text-danger'
    databaseStatus.textContent = 'Falha ao testar a conexão MySQL.'
  } finally {
    testDatabaseButton.disabled = false
  }
})

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  loginSubmit.disabled = true
  setStatus('Validando acesso...', 'secondary')
  const formData = new FormData(loginForm)

  try {
    usuarioAtual = await window.petShop.login(
      String(formData.get('email') ?? ''),
      String(formData.get('senha') ?? '')
    )
    renderSession()
    await carregarClientes()
    setStatus('', 'secondary')
    loginForm.reset()
  } catch (error) {
    setStatus(errorMessage(error, 'Não foi possível entrar.'), 'danger')
  } finally {
    loginSubmit.disabled = false
  }
})

logoutButton.addEventListener('click', async () => {
  await window.petShop.logout()
  usuarioAtual = null
  clientsList.replaceChildren()
  fecharFormulario()
  renderSession()
  setStatus('Sessão encerrada.', 'secondary')
})

requiredElement<HTMLButtonElement>('#new-client').addEventListener('click', () => abrirFormulario())
requiredElement<HTMLButtonElement>('#cancel-client').addEventListener('click', fecharFormulario)

clientForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (!clientForm.reportValidity()) return

  saveClientButton.disabled = true
  const formData = new FormData(clientForm)
  const cliente: ClienteInput = {
    nome: stringValue(formData, 'nome'),
    email: optionalString(formData, 'email'),
    telefone: stringValue(formData, 'telefone'),
    cpf: optionalString(formData, 'cpf'),
    cep: stringValue(formData, 'cep'),
    logradouro: stringValue(formData, 'logradouro'),
    numero: stringValue(formData, 'numero'),
    complemento: optionalString(formData, 'complemento'),
    bairro: stringValue(formData, 'bairro'),
    cidade: stringValue(formData, 'cidade'),
    uf: stringValue(formData, 'uf')
  }

  try {
    if (clienteEmEdicao) {
      await window.petShop.atualizarCliente(clienteEmEdicao, cliente)
      setStatus('Cliente atualizado.', 'success')
    } else {
      await window.petShop.criarCliente(cliente)
      setStatus('Cliente cadastrado.', 'success')
    }
    fecharFormulario()
    await carregarClientes()
  } catch (error) {
    setStatus(errorMessage(error, 'Não foi possível salvar o cliente.'), 'danger')
  } finally {
    saveClientButton.disabled = false
  }
})

lookupCepButton.addEventListener('click', async () => {
  lookupCepButton.disabled = true
  setStatus('Consultando CEP...', 'secondary')

  try {
    const endereco = await window.petShop.consultarCep(
      requiredElement<HTMLInputElement>('#client-cep').value
    )
    requiredElement<HTMLInputElement>('#client-cep').value = endereco.cep
    requiredElement<HTMLInputElement>('#client-street').value = endereco.logradouro
    requiredElement<HTMLInputElement>('#client-complement').value = endereco.complemento
    requiredElement<HTMLInputElement>('#client-neighborhood').value = endereco.bairro
    requiredElement<HTMLInputElement>('#client-city').value = endereco.cidade
    requiredElement<HTMLInputElement>('#client-state').value = endereco.uf
    setStatus('Endereço preenchido pelo ViaCEP.', 'success')
  } catch (error) {
    setStatus(errorMessage(error, 'Não foi possível consultar o CEP.'), 'danger')
  } finally {
    lookupCepButton.disabled = false
  }
})

async function carregarClientes(): Promise<void> {
  try {
    const clientes = await window.petShop.listarClientes()
    renderClientes(clientes)
  } catch (error) {
    setStatus(errorMessage(error, 'Não foi possível carregar os clientes.'), 'danger')
  }
}

function renderClientes(clientes: Cliente[]): void {
  clientsList.replaceChildren()
  clientsEmpty.classList.toggle('d-none', clientes.length > 0)

  for (const cliente of clientes) {
    const row = document.createElement('tr')
    const nameCell = document.createElement('th')
    nameCell.scope = 'row'
    nameCell.textContent = cliente.nome
    row.append(nameCell)

    const contactCell = document.createElement('td')
    contactCell.textContent = cliente.email ? `${cliente.telefone} · ${cliente.email}` : cliente.telefone
    row.append(contactCell)

    const cityCell = document.createElement('td')
    cityCell.textContent = `${cliente.cidade}/${cliente.uf}`
    row.append(cityCell)

    const actionsCell = document.createElement('td')
    actionsCell.className = 'text-end text-nowrap'
    const editButton = document.createElement('button')
    editButton.type = 'button'
    editButton.className = 'btn btn-outline-secondary btn-sm me-2'
    editButton.textContent = 'Editar'
    editButton.addEventListener('click', () => abrirFormulario(cliente))
    actionsCell.append(editButton)

    if (usuarioAtual?.nivel === 'admin') {
      const deleteButton = document.createElement('button')
      deleteButton.type = 'button'
      deleteButton.className = 'btn btn-outline-danger btn-sm'
      deleteButton.textContent = 'Excluir'
      deleteButton.addEventListener('click', () => void excluirCliente(cliente))
      actionsCell.append(deleteButton)
    }
    row.append(actionsCell)
    clientsList.append(row)
  }
}

async function excluirCliente(cliente: Cliente): Promise<void> {
  if (!window.confirm(`Excluir o cadastro de ${cliente.nome}?`)) return

  try {
    await window.petShop.excluirCliente(cliente.id)
    await carregarClientes()
    setStatus('Cliente excluído.', 'success')
  } catch (error) {
    setStatus(errorMessage(error, 'Não foi possível excluir o cliente.'), 'danger')
  }
}

function abrirFormulario(cliente?: Cliente): void {
  clientForm.reset()
  clienteEmEdicao = cliente?.id ?? null
  requiredElement<HTMLInputElement>('#client-id').value = cliente ? String(cliente.id) : ''
  requiredElement<HTMLElement>('#client-form-title').textContent = cliente ? 'Editar cliente' : 'Novo cliente'
  requiredElement<HTMLButtonElement>('#save-client').textContent = cliente ? 'Salvar alterações' : 'Salvar cliente'

  if (cliente) {
    requiredElement<HTMLInputElement>('#client-name').value = cliente.nome
    requiredElement<HTMLInputElement>('#client-email').value = cliente.email ?? ''
    requiredElement<HTMLInputElement>('#client-phone').value = cliente.telefone
    requiredElement<HTMLInputElement>('#client-cpf').value = cliente.cpf ?? ''
    requiredElement<HTMLInputElement>('#client-cep').value = cliente.cep
    requiredElement<HTMLInputElement>('#client-street').value = cliente.logradouro
    requiredElement<HTMLInputElement>('#client-number').value = cliente.numero
    requiredElement<HTMLInputElement>('#client-complement').value = cliente.complemento ?? ''
    requiredElement<HTMLInputElement>('#client-neighborhood').value = cliente.bairro
    requiredElement<HTMLInputElement>('#client-city').value = cliente.cidade
    requiredElement<HTMLInputElement>('#client-state').value = cliente.uf
  }

  clientForm.classList.remove('d-none')
  requiredElement<HTMLInputElement>('#client-name').focus()
}

function fecharFormulario(): void {
  clienteEmEdicao = null
  clientForm.reset()
  clientForm.classList.add('d-none')
}

function renderSession(): void {
  const autenticado = usuarioAtual !== null
  loginView.classList.toggle('d-none', autenticado)
  clientsView.classList.toggle('d-none', !autenticado)
  sessionActions.classList.toggle('d-none', !autenticado)
  sessionActions.classList.toggle('d-flex', autenticado)
  sessionUser.textContent = usuarioAtual
    ? `${usuarioAtual.nome} · ${usuarioAtual.nivel === 'admin' ? 'Administrador' : 'Atendente'}`
    : ''
}

function setStatus(message: string, tone: 'secondary' | 'success' | 'danger'): void {
  appStatus.className = `small mb-3 text-${tone}`
  appStatus.textContent = message
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback
}

function stringValue(data: FormData, key: string): string {
  return String(data.get(key) ?? '').trim()
}

function optionalString(data: FormData, key: string): string | null {
  return stringValue(data, key) || null
}

function requiredElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element) throw new Error(`Elemento obrigatório não encontrado: ${selector}`)
  return element
}

window.petShop.getUsuarioAtual().then((usuario) => {
  usuarioAtual = usuario
  renderSession()
  if (usuarioAtual) void carregarClientes()
}).catch(() => {
  setStatus('Não foi possível restaurar a sessão.', 'danger')
})
