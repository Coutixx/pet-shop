import type { RowDataPacket } from 'mysql2'
import type { NivelAcesso } from '../../../shared/contracts'
import { getMySqlPool } from '../../database/connection'

export interface UsuarioCredencial {
  id: number
  nome: string
  email: string
  senhaHash: string
  nivel: NivelAcesso
  ativo: boolean
}

interface UsuarioRow extends RowDataPacket {
  id: number
  nome: string
  email: string
  senha_hash: string
  nivel: NivelAcesso
  ativo: number
}

export interface UsuarioRepository {
  buscarPorEmail(email: string): Promise<UsuarioCredencial | null>
}

export class MySqlUsuarioRepository implements UsuarioRepository {
  async buscarPorEmail(email: string): Promise<UsuarioCredencial | null> {
    const [rows] = await getMySqlPool().execute<UsuarioRow[]>(
      'SELECT id, nome, email, senha_hash, nivel, ativo FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    )
    const row = rows[0]

    return row
      ? {
          id: row.id,
          nome: row.nome,
          email: row.email,
          senhaHash: row.senha_hash,
          nivel: row.nivel,
          ativo: row.ativo === 1
        }
      : null
  }
}
