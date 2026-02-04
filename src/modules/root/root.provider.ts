import { config } from 'dotenv'

config()

export const rootProvider = {
  firstName: process.env.ROOT_NAME || 'root',
  email: process.env.ROOT_EMAIL,
  verified: true,
  secret: process.env.ROOT_SECRET,
  password: process.env.ROOT_PASSWORD,
  role: 'root',
  isRoot: true,
}
