import { INestApplication } from '@nestjs/common'

export const setServerCors = (app: INestApplication) => {
  app.enableCors({
    origin: ['http://localhost:3001'],
    method: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true,
  })
}
