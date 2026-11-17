import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import type { Cliente, ClienteInput } from '../../../shared/contracts'
import { getMySqlPool } from '../../database/connection'

interface ClienteRow extends RowDataPacket, Cliente {}

export interface ClienteRepository {
  listar(): Promise<Cliente[]>
  buscarPorId(id: number): Promise<Cliente | null>
  criar(input: ClienteInput): Promise<Cliente>
  atualizar(id: number, input: ClienteInput): Promise<Cliente | null>
  excluir(id: number): Promise<boolean>
}

const selectFields = 'id, nome, email, telefone, cpf, cep, logradouro, numero, complemento, bairro, cidade, uf'

export class MySqlClienteRepository implements ClienteRepository {
  async listar(): Promise<Cliente[]> {
    const [rows] = await getMySqlPool().execute<ClienteRow[]>(
      `SELECT ${selectFields} FROM clientes ORDER BY nome, id`
    )
    return rows
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    const [rows] = await getMySqlPool().execute<ClienteRow[]>(
      `SELECT ${selectFields} FROM clientes WHERE id = ? LIMIT 1`,
      [id]
    )
    return rows[0] ?? null
  }

  async criar(input: ClienteInput): Promise<Cliente> {
    const [result] = await getMySqlPool().execute<ResultSetHeader>(
      `INSERT INTO clientes (nome, email, telefone, cpf, cep, logradouro, numero, complemento, bairro, cidade, uf)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values(input)
    )
    const created = await this.buscarPorId(result.insertId)
    if (!created) throw new Error('Não foi possível carregar o cliente criado.')
    return created
  }

  async atualizar(id: number, input: ClienteInput): Promise<Cliente | null> {
    await getMySqlPool().execute<ResultSetHeader>(
      `UPDATE clientes SET nome = ?, email = ?, telefone = ?, cpf = ?, cep = ?, logradouro = ?, numero = ?,
       complemento = ?, bairro = ?, cidade = ?, uf = ? WHERE id = ?`,
      [...values(input), id]
    )
    return this.buscarPorId(id)
  }

  async excluir(id: number): Promise<boolean> {
    const [result] = await getMySqlPool().execute<ResultSetHeader>(
      'DELETE FROM clientes WHERE id = ?',
      [id]
    )
    return result.affectedRows > 0
  }
}

function values(input: ClienteInput): Array<string | null> {
  return [
    input.nome,
    input.email,
    input.telefone,
    input.cpf,
    input.cep,
    input.logradouro,
    input.numero,
    input.complemento,
    input.bairro,
    input.cidade,
    input.uf
  ]
}