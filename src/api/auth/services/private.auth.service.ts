import { TJwtAdmin } from '@/@types/shared/jwt.types'
import { TRole } from '@/@types/shared/role.types'
import {
  httpErrorMessages,
  httpSuccessMessages,
} from '@/common/constants/http.messages.constnats'
import { JWT_1_HOUR } from '@/common/constants/time.constants'
import { BcryptService } from '@/common/tools/bcrypt/bcrypt.service'
import { JsonWebTokenService } from '@/common/tools/jwt/jwt.service'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { SessionService } from '@/modules/session/session.service'
import {
  BadRequestException,
  ConflictException,
  Inject,
  NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SignInDto } from '../dto/signIn.dto'
import { SignUpAdminDto } from '../dto/signUpAdmin.dto'

export class PrivateAuthService {
  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(BcryptService) private bcrypt: BcryptService,
    @Inject(JsonWebTokenService) private jwt: JsonWebTokenService,
    @Inject(ConfigService) private config: ConfigService,
    @Inject(SessionService) private session: SessionService,
  ) {}

  async signIn(body: SignInDto) {
    const { email, password } = body

    const admin = await this.prisma.admin.findUnique({ where: { email } })

    if (!admin)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Candidate'))

    const isMatch = await this.bcrypt.matchPassword(password, admin.password)

    if (!isMatch)
      throw new BadRequestException(httpErrorMessages.INVALID_INPUT_DATA)

    const jwtSecret = admin.isRoot
      ? this.config.get<string>('ROOT_TOKEN_SECRET')
      : this.config.get<string>('ADMIN_TOKEN_SECRET')

    const accessToken = await this.jwt.sign<TJwtAdmin>(
      { email, role: admin.role as TRole },
      {
        expiresIn: JWT_1_HOUR,
        secret: jwtSecret,
      },
    )

    return { message: httpSuccessMessages.SUCCESS_LOGGED, accessToken }
  }

  async signUp(body: SignUpAdminDto) {
    const { email, password, firstName, retypePassword, lastName, middleName } =
      body

    if (password !== retypePassword)
      throw new BadRequestException("Password doesn't match")

    const admin = await this.prisma.admin.findUnique({ where: { email } })

    if (admin)
      throw new ConflictException(
        httpErrorMessages.ALREADY_EXISTS('Admin with this email'),
      )

    const hashedPassword = await this.bcrypt.hashPassword(password, 12)

    await this.prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        middleName,
        verified: false,
        isRoot: false,
        role: 'admin',
      },
    })

    return { message: httpSuccessMessages.CREATED('Admin') }
  }
}
