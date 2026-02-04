import { DAY_1_IN_MS } from './time.constants'

export const DEFAULT_SESSION_MAX_AGE = DAY_1_IN_MS
export const REQUEST_IGNORE_AGENTS = [
  'curl',
  'PostmanRuntime',
  'Googlebot',
  'Bingbot',
  'bingpreview',
]
export const LOCK_SESSION_RACE_CONDITION_DURATION = 5000
