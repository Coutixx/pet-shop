import { app, ipcMain } from 'electron'
import { testMySqlConnection } from '../database/connection'

export function registerAppHandlers(): void {
  ipcMain.handle('app:get-version', () => app.getVersion())
  ipcMain.handle('database:test-connection', async () => {
    try {
      await testMySqlConnection()
      return { ok: true, message: 'Conexão MySQL estabelecida.' }
    } catch (error) {
      const code = error instanceof Error && 'code' in error ? String(error.code) : 'UNKNOWN'
      console.error(`Falha no teste MySQL (${code}).`)
      return {
        ok: false,
        message: 'Não foi possível conectar. Confira o .env e o acesso à rede da escola.'
      }
    }
  })
}
