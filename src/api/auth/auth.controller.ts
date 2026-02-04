import { RootGuard } from '@/common/guards/root.guard'
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/signIn.dto'
import { SignUpDto } from './dto/signUp.dto'
import { SignUpAdminDto } from './dto/signUpAdmin.dto'
import { PrivateAuthService } from './services/private.auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly privateAuthService: PrivateAuthService,
  ) {}

  @Post('admin/signin')
  adminSignIn(@Body() body: SignInDto) {
    return this.privateAuthService.signIn(body)
  }
  @UseGuards(RootGuard)
  @HttpCode(201)
  @Post('admin/signup')
  async signUpAdmin(@Body() body: SignUpAdminDto) {
    return this.privateAuthService.signUp(body)
  }

  @Post('signin')
  signIn(@Body() body: SignInDto, @Res() res: Response) {
    return this.authService.signIn(body, res)
  }

  @Post('signup')
  @HttpCode(201)
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body)
  }
}
