import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'

export const getServerLogger = () =>
  WinstonModule.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: 'logs/api-error.log',
        level: 'error',
      }),
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message, context }) => {
        return `[${timestamp}] [${context ?? 'App'}] ${level.toUpperCase()}: ${message}`
      }),
    ),
  })
