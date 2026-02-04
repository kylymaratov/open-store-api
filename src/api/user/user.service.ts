import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name)
}
