import type { DesktopApi } from './index'

declare global {
  interface Window {
    petShop: DesktopApi
  }
}

export {}
