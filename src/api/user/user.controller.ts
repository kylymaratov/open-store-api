import { Controller, Get } from '@nestjs/common'

@Controller('user')
export class UserController {
  @Get('me')
  async getMe() {
    return 'Me'
  }
}
