import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const setServerDocs = (app: INestApplication, config: ConfigService) => {
  const isDev = config.get<boolean>('IS_DEV')

  if (!isDev) return

  const swaggerConfig = new DocumentBuilder()
    .setTitle('General Hub Store')
    .setDescription('The General Hub Store API')
    .setVersion('1.0.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, documentFactory)
}
