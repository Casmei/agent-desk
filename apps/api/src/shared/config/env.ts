import { cleanEnv, EnvMissingError, makeValidator, port, str } from 'envalid';

export class InvalidEnvError extends Error {
  constructor(
    readonly invalidKeys: string[],
    reasons: string[],
  ) {
    super(`Invalid environment variables:\n${reasons.join('\n')}`);
    this.name = 'InvalidEnvError';
  }
}

const postgresUrl = makeValidator((input: string) => {
  if (!/^postgres(ql)?:\/\/.+/.test(input)) {
    throw new Error('must be a postgres:// or postgresql:// url');
  }
  return input;
});

const redisUrl = makeValidator((input: string) => {
  if (!/^redis:\/\/.+/.test(input)) {
    throw new Error('must be a redis:// url');
  }
  return input;
});

const adminToken = makeValidator((input: string) => {
  if (input.length < 32) {
    throw new Error('must have at least 32 characters');
  }
  return input;
});

const positiveInt = makeValidator((input: string) => {
  const value = Number(input);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error('must be an integer greater than 0');
  }
  return value;
});

const specs = {
  NODE_ENV: str({
    choices: ['development', 'test', 'production'],
    default: 'development',
  }),
  PORT: port({ default: 3000 }),
  LOG_LEVEL: str({
    choices: ['fatal', 'error', 'warn', 'log', 'debug', 'verbose'],
    default: 'log',
  }),
  DATABASE_URL: postgresUrl(),
  REDIS_URL: redisUrl(),
  ADMIN_TOKEN: adminToken(),
  TOOL_WEBHOOK_TIMEOUT_MS: positiveInt({ default: 10000 }),
};

export type Env = ReturnType<typeof cleanEnv<typeof specs>>;

function describe(error: unknown): string {
  if (error instanceof EnvMissingError) return 'is required';
  return error instanceof Error ? error.message : 'is invalid';
}

export function parseEnv(source: Record<string, string | undefined>): Env {
  return cleanEnv(source, specs, {
    reporter: ({ errors }) => {
      const entries = Object.entries(errors);
      if (entries.length === 0) return;
      throw new InvalidEnvError(
        entries.map(([key]) => key),
        entries.map(([key, error]) => `${key}: ${describe(error)}`),
      );
    },
  });
}

export class AppConfig {
  constructor(readonly values: Env) {}
}
