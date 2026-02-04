import { config } from 'dotenv'

config()

export default () => ({
  PORT: 3000,
  IS_DEV: process.env.NODE_ENV === 'development',
})
