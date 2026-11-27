import { cleanEnv, makeValidator, num, port, str, url } from 'envalid';

const adminToken = makeValidator((value: string) => {
  if (value.length < 32) throw new Error('must have at least 32 characters');
  return value;
});

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'test', 'production'],
    default: 'development',
  }),
  PORT: port({ default: 3000 }),
  LOG_LEVEL: str({
    choices: ['fatal', 'error', 'warn', 'log', 'debug', 'verbose'],
    default: 'log',
  }),
  DATABASE_URL: url(),
  REDIS_URL: url(),
  ADMIN_TOKEN: adminToken(),
  TOOL_WEBHOOK_TIMEOUT_MS: num({ default: 10000 }),
});
