import { logs } from '@opentelemetry/api';
import {
  InMemoryLogRecordExporter,
  LoggerProvider,
  SimpleLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { OtelLogger } from './otel-logger.js';

describe('OtelLogger', () => {
  const exporter = new InMemoryLogRecordExporter();

  beforeEach(() => {
    logs.setGlobalLoggerProvider(
      new LoggerProvider({
        processors: [new SimpleLogRecordProcessor({ exporter })],
      }),
    );
  });

  afterEach(() => {
    logs.disable();
    exporter.reset();
  });

  const logger = new OtelLogger({ json: true });

  it('sends each log line to OpenTelemetry with its fields', () => {
    logger.log('request received', { connectionId: 'c1' }, 'ChannelInbound');

    const [record] = exporter.getFinishedLogRecords();
    expect(record?.body).toBe('request received');
    expect(record?.severityText).toBe('log');
    expect(record?.attributes).toMatchObject({
      connectionId: 'c1',
      context: 'ChannelInbound',
    });
  });

  it('drops sensitive fields before sending', () => {
    logger.log('provider configured', { connectionId: 'c1', apiKey: 'sk-123' });

    const [record] = exporter.getFinishedLogRecords();
    expect(record?.attributes).toHaveProperty('connectionId', 'c1');
    expect(record?.attributes).not.toHaveProperty('apiKey');
  });
});
