import 'bootstrap/dist/css/bootstrap.min.css'

const version = document.querySelector<HTMLElement>('#app-version')
const testDatabaseButton = document.querySelector<HTMLButtonElement>('#test-db')
const databaseStatus = document.querySelector<HTMLElement>('#db-status')

if (version) {
  window.petShop.getAppVersion()
    .then((appVersion) => {
      version.textContent = `Versão ${appVersion}`
    })
    .catch(() => {
      version.textContent = 'Versão indisponível'
    })
}

if (testDatabaseButton && databaseStatus) {
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
}
