import { BcryptService } from '@/common/tools/bcrypt/bcrypt.service'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { rootProvider } from './root.provider'

@Injectable()
export class RootService {
  private readonly logger = new Logger(RootService.name)

  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(BcryptService) private bcrypt: BcryptService,
  ) {
    void this.createSuperAdmin()
  }

  private async createSuperAdmin() {
    try {
      const { email, firstName, isRoot, role, verified, password } =
        rootProvider

      const superAdmin = await this.prisma.admin.findUnique({
        where: { email },
      })

      if (superAdmin) return

      if (!password) throw new Error('Root password is required')
      if (!email) throw new Error('Root email is required')

      const hashedPassword = await this.bcrypt.hashPassword(password)

      await this.prisma.admin.create({
        data: {
          email,
          firstName,
          isRoot,
          role,
          verified,
          password: hashedPassword,
        },
      })
      this.logger.log('Root admin has been created')
    } catch (error) {
      this.logger.error(error)
    }
  }
}
