import { describe, expect, it } from 'vitest'
import { getMySqlConfig } from '../../src/main/database/connection'

describe('configuração MySQL', () => {
  it('lê os parâmetros do ambiente sem expor credenciais', () => {
    const config = getMySqlConfig({
      DB_HOST: 'db.example.test',
      DB_PORT: '3306',
      DB_NAME: 'petshop_test',
      DB_USER: 'aluno_test',
      DB_PASSWORD: 'senha-de-teste'
    })

    expect(config).toEqual({
      host: 'db.example.test',
      port: 3306,
      database: 'petshop_test',
      user: 'aluno_test',
      password: 'senha-de-teste',
      connectTimeout: 5000
    })
  })

  it('rejeita configuração incompleta', () => {
    expect(() => getMySqlConfig({})).toThrow('Preencha DB_HOST')
  })

  it('rejeita porta inválida', () => {
    expect(() => getMySqlConfig({
      DB_HOST: 'db.example.test',
      DB_PORT: 'porta',
      DB_NAME: 'petshop_test',
      DB_USER: 'aluno_test',
      DB_PASSWORD: 'senha-de-teste'
    })).toThrow('DB_PORT precisa ser uma porta válida')
  })
})
