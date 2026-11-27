import { cleanEnv, makeValidator, num, port, str, url } from 'envalid';

const adminToken = makeValidator((value: string) => {
  if (value.length < 32) throw new Error('must have at least 32 characters');
  return value;
});

const secretEncryptionKey = makeValidator((value: string) => {
  if (!/^[0-9a-f]{64}$/i.test(value)) {
    throw new Error('must have 64 hexadecimal characters (32 bytes)');
  }
  return Buffer.from(value, 'hex');
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
  SECRET_ENCRYPTION_KEY: secretEncryptionKey(),
  TOOL_WEBHOOK_TIMEOUT_MS: num({ default: 10000 }),
});
