import { Inject } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'

export class JsonWebTokenService {
  constructor(@Inject(JwtService) private jwt: JwtService) {}

  async sign<T>(data: T, options: JwtSignOptions = {}) {
    const token = await this.jwt.signAsync(data as any, options)

    return token
  }

  decode<T>(token: string): T {
    const decoded = this.jwt.decode<T>(token, { json: true })

    return decoded
  }

  async verify<T>(token: string, secret: string): Promise<T> {
    const decoded = await this.jwt.verifyAsync<Promise<T>>(token, {
      secret,
    })

    return decoded
  }
}
