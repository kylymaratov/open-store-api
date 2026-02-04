import { TRole } from './role.types'

export interface TJwtAdmin {
  email: string
  role: TRole
}

export interface TJwtUser {
  email: string
  role: TRole
}

export interface TJwtRefreshToken {
  email: string
}
