import { filterLogLevels, type ConsoleLoggerOptions } from '@nestjs/common';
import type { env } from '../config/env.js';

export const REDACTED_KEYS = [
  'authorization',
  'x-admin-token',
  'apiKey',
  'token',
  'password',
  'secret',
];

export function buildLoggerOptions(
  config: Pick<typeof env, 'LOG_LEVEL' | 'NODE_ENV'>,
): ConsoleLoggerOptions {
  return {
    json: config.NODE_ENV !== 'development',
    colors: config.NODE_ENV === 'development',
    logLevels: filterLogLevels(`>=${config.LOG_LEVEL}`),
    redact: REDACTED_KEYS,
  };
}
