import { TJwtRefreshToken, TJwtUser } from '@/@types/shared/jwt.types'
import {
  httpErrorMessages,
  httpSuccessMessages,
} from '@/common/constants/http.messages.constnats'
import {
  DAYS_20_IN_MS,
  JWT_10_DAYS,
  JWT_20_DAYS,
} from '@/common/constants/time.constants'
import { BcryptService } from '@/common/tools/bcrypt/bcrypt.service'
import { HelperService } from '@/common/tools/helper/helper.service'
import { JsonWebTokenService } from '@/common/tools/jwt/jwt.service'
import { PrismaService } from '@/databases/prisma/prisma.service'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Response } from 'express'
import { SignInDto } from './dto/signIn.dto'
import { SignUpDto } from './dto/signUp.dto'

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(BcryptService) private bcrypt: BcryptService,
    @Inject(JsonWebTokenService) private jwt: JsonWebTokenService,
    @Inject(HelperService) private helper: HelperService,
  ) {}

  async signIn(body: SignInDto, res: Response) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Candidate'))

    const isMatch = await this.bcrypt.matchPassword(password, user.password)

    if (!isMatch) throw new BadRequestException(httpErrorMessages.BAD_REQUEST)

    const accessToken = this.jwt.sign<TJwtUser>(
      { email, role: 'user' },
      { expiresIn: JWT_10_DAYS },
    )

    const refreshToken = this.jwt.sign<TJwtRefreshToken>(
      {
        email,
      },
      {
        expiresIn: JWT_20_DAYS,
      },
    )

    return res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/',
        secure: !this.helper.isDevMode(),
        maxAge: DAYS_20_IN_MS,
      })
      .json({ message: httpSuccessMessages.SUCCESS_LOGGED, accessToken })
  }

  async signUp(body: SignUpDto) {
    const {} = body
    return body
  }
}
