import { contextBridge, ipcRenderer } from 'electron'
import type { DesktopApi } from '../shared/contracts'

const api: DesktopApi = {
  getAppVersion: () => ipcRenderer.invoke('app:get-version'),
  testDatabaseConnection: () => ipcRenderer.invoke('database:test-connection')
}

contextBridge.exposeInMainWorld('petShop', api)
