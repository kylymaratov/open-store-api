import { AdminGuard } from '@/common/guards/admin.guard'
import { RootGuard } from '@/common/guards/root.guard'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common'
import { Request } from 'express'
import { AdminService } from './admin.service'
import { DeleteAdminDto } from './dto/deleteAdmin.dto'
import { UpdateAdminDto } from './dto/updateAdmin.dto'

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AdminGuard)
  @Get('is-admin')
  isAdmin() {
    return this.adminService.isAdmin()
  }

  @UseGuards(RootGuard)
  @Get('list')
  getAdmins() {
    return this.adminService.getAdmins()
  }

  @UseGuards(RootGuard)
  @Patch('update')
  updateAdmin(@Body() body: UpdateAdminDto) {
    return this.adminService.updateAdmin(body)
  }

  @UseGuards(RootGuard)
  @Delete('delete/:adminId')
  deleteAdmin(@Param() param: DeleteAdminDto) {
    return this.adminService.deleteAdmin(param)
  }

  @UseGuards(AdminGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return this.adminService.getMe(req.admin)
  }
}
