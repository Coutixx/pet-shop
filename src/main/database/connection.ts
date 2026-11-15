import { createConnection } from 'mysql2/promise'

export function getMySqlConfig(env: NodeJS.ProcessEnv = process.env) {
  const host = env.DB_HOST?.trim()
  const database = env.DB_NAME?.trim()
  const user = env.DB_USER?.trim()
  const password = env.DB_PASSWORD
  const port = Number(env.DB_PORT || 3306)

  if (!host || !database || !user || password === undefined) {
    throw new Error('Preencha DB_HOST, DB_PORT, DB_NAME, DB_USER e DB_PASSWORD no .env.')
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('DB_PORT precisa ser uma porta válida.')
  }

  return { host, port, database, user, password, connectTimeout: 5000 }
}

export async function testMySqlConnection(env: NodeJS.ProcessEnv = process.env): Promise<void> {
  const connection = await createConnection(getMySqlConfig(env))

  try {
    await connection.ping()
  } finally {
    await connection.end()
  }
}
