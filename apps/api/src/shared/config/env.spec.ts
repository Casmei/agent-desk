import { describe, expect, it } from 'vitest';
import { InvalidEnvError, parseEnv } from './env.js';

const valid = {
  DATABASE_URL: 'postgres://u:p@localhost:5432/agent_desk',
  REDIS_URL: 'redis://localhost:6379',
  ADMIN_TOKEN: 'a'.repeat(32),
};

function captureError(run: () => unknown): InvalidEnvError {
  try {
    run();
  } catch (error) {
    if (error instanceof InvalidEnvError) return error;
    throw error;
  }
  throw new Error('expected the call to throw');
}

describe('parseEnv', () => {
  it('applies defaults', () => {
    expect(parseEnv(valid)).toMatchObject({
      NODE_ENV: 'development',
      PORT: 3000,
      LOG_LEVEL: 'log',
      TOOL_WEBHOOK_TIMEOUT_MS: 10000,
    });
  });

  it('lists every invalid key', () => {
    const error = captureError(() =>
      parseEnv({ ...valid, DATABASE_URL: undefined, ADMIN_TOKEN: 'short' }),
    );
    expect(error).toBeInstanceOf(InvalidEnvError);
    expect(error.invalidKeys.sort()).toEqual(['ADMIN_TOKEN', 'DATABASE_URL']);
    expect(error.message).toContain('ADMIN_TOKEN');
    expect(error.message).toContain('DATABASE_URL');
  });

  it('coerces numeric values', () => {
    expect(parseEnv({ ...valid, PORT: '8080' }).PORT).toBe(8080);
  });

  it('rejects a non-postgres database url', () => {
    expect(() => parseEnv({ ...valid, DATABASE_URL: 'mysql://x' })).toThrow(
      InvalidEnvError,
    );
  });
});
