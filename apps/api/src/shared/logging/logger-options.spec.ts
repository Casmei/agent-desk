import { ConsoleLogger } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildLoggerOptions } from './logger-options.ts';

type LogEnv = Parameters<typeof buildLoggerOptions>[0];

function capture(env: LogEnv, write: (logger: ConsoleLogger) => void): string {
  const chunks: string[] = [];
  const collect = (chunk: unknown): boolean => {
    chunks.push(String(chunk));
    return true;
  };
  vi.spyOn(process.stdout, 'write').mockImplementation(collect);
  vi.spyOn(process.stderr, 'write').mockImplementation(collect);
  write(new ConsoleLogger(buildLoggerOptions(env)));
  return chunks.join('');
}

describe('buildLoggerOptions', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const testEnv: LogEnv = { LOG_LEVEL: 'log', NODE_ENV: 'test' };

  it('redacts the authorization param', () => {
    const out = capture(testEnv, (logger) => {
      logger.log('request received', {
        headers: { authorization: 'Bearer secret-value' },
      });
    });
    expect(out).toContain('[REDACTED]');
    expect(out).not.toContain('secret-value');
  });

  it('redacts nested secret fields', () => {
    const out = capture(testEnv, (logger) => {
      logger.log('provider configured', { provider: { apiKey: 'sk-123' } });
    });
    expect(out).toContain('[REDACTED]');
    expect(out).not.toContain('sk-123');
  });

  it('writes json outside development', () => {
    const out = capture(testEnv, (logger) => {
      logger.log('request received');
    });
    expect(JSON.parse(out)).toMatchObject({
      level: 'log',
      message: 'request received',
    });
  });

  it('respects the configured level', () => {
    const warnEnv: LogEnv = { LOG_LEVEL: 'warn', NODE_ENV: 'test' };
    expect(
      capture(warnEnv, (logger) => {
        logger.log('skipped');
      }),
    ).toBe('');
    expect(
      capture(warnEnv, (logger) => {
        logger.warn('kept');
      }),
    ).toContain('kept');
  });
});
