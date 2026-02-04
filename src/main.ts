import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { setServerCors } from './server/server.cors'
import { setServerDocs } from './server/server.docs'
import { HttpExceptionFilter } from './server/server.exception'
import { getServerLogger } from './server/server.logs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: getServerLogger() })
  const config = app.get(ConfigService)
  const port = Number(config.get<number>('PORT'))

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.setGlobalPrefix('api')
  app.use(cookieParser())

  setServerCors(app)
  setServerDocs(app, config)

  await app.listen(port)
}
bootstrap()
