import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class BcryptService {
  async hashPassword(password: string, saltRound: number = 12) {
    const hashedPassword = await bcrypt.hash(password, saltRound)

    return hashedPassword
  }
  async matchPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword)
  }
}
