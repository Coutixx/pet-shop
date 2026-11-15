import 'dotenv/config'
import { app, BrowserWindow, session } from 'electron'
import { join } from 'node:path'
import { registerAppHandlers } from './ipc/app-handlers'

const rendererUrl = process.env.ELECTRON_RENDERER_URL

function installContentSecurityPolicy(): void {
  const connectSource = rendererUrl
    ? "connect-src 'self' ws://localhost:* http://localhost:*"
    : "connect-src 'self'"
  const policy = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    connectSource,
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'"
  ].join('; ')

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = Object.fromEntries(
      Object.entries(details.responseHeaders ?? {}).filter(
        ([name]) => name.toLowerCase() !== 'content-security-policy'
      )
    )
    responseHeaders['Content-Security-Policy'] = [policy]
    callback({ responseHeaders })
  })
}

function createWindow(): void {
  const window = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  if (rendererUrl) {
    void window.loadURL(rendererUrl)
  } else {
    void window.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  installContentSecurityPolicy()
  registerAppHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
