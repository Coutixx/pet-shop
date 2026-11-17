import { contextBridge, ipcRenderer } from 'electron'
import type { DesktopApi } from '../shared/contracts'

const api: DesktopApi = {
  getAppVersion: () => ipcRenderer.invoke('app:get-version'),
  testDatabaseConnection: () => ipcRenderer.invoke('database:test-connection'),
  login: (email, senha) => ipcRenderer.invoke('usuarios:login', email, senha),
  logout: () => ipcRenderer.invoke('usuarios:logout'),
  getUsuarioAtual: () => ipcRenderer.invoke('usuarios:atual'),
  listarClientes: () => ipcRenderer.invoke('clientes:listar'),
  criarCliente: (input) => ipcRenderer.invoke('clientes:criar', input),
  atualizarCliente: (id, input) => ipcRenderer.invoke('clientes:atualizar', id, input),
  excluirCliente: (id) => ipcRenderer.invoke('clientes:excluir', id),
  consultarCep: (cep) => ipcRenderer.invoke('viacep:consultar', cep)
}

contextBridge.exposeInMainWorld('petShop', api)
