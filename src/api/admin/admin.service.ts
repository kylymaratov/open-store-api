import {
  httpErrorMessages,
  httpSuccessMessages,
} from '@/common/constants/http.messages.constnats'
import { BcryptService } from '@/common/tools/bcrypt/bcrypt.service'
import { PrismaService } from '@/databases/prisma/prisma.service'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Admin } from '@prisma/client'
import { DeleteAdminDto } from './dto/deleteAdmin.dto'
import { UpdateAdminDto } from './dto/updateAdmin.dto'

@Injectable()
export class AdminService {
  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject(BcryptService) private bcrypt: BcryptService,
  ) {}

  async getMe(admin?: Admin) {
    if (!admin)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Admin'))

    return { ...admin, password: 'null' }
  }

  async isAdmin() {
    return { message: httpSuccessMessages.SUCCESS(`Is admin`) }
  }

  async getAdmins() {
    const admins = await this.prisma.admin.findMany({
      select: {
        password: false,
        id: true,
        email: true,
        verified: true,
        firstName: true,
        lastName: true,
        middleName: true,
        role: true,
        avatar: true,
        isRoot: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!admins.length)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Admins'))

    return admins
  }

  async updateAdmin(body: UpdateAdminDto) {
    const { adminId, ...updateData } = body

    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    })

    if (!admin)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Admin'))

    const updated = await this.prisma.admin.update({
      where: { id: adminId },
      data: updateData,
    })

    return {
      message: httpSuccessMessages.UPDATED('Admin'),
      admin: { ...updated, password: 'null' },
    }
  }

  async deleteAdmin(body: DeleteAdminDto) {
    const { adminId } = body
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    })

    if (!admin)
      throw new NotFoundException(httpErrorMessages.NOT_FOUND('Admin'))

    await this.prisma.admin.delete({
      where: { id: adminId },
    })

    return { message: httpSuccessMessages.DELETED('Admin') }
  }
}
