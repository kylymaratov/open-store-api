// src/types/express/index.d.ts

import { Admin, User } from '@prisma/client'
import 'express'
import { TSession } from '../shared/session.types'

declare module 'express' {
  export interface Request {
    admin?: Admin
    user?: User
    session?: TSession
  }
}
