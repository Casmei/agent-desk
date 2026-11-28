import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { env } from './shared/config/env.js';
import { buildLoggerOptions } from './shared/logging/logger-options.js';
import { OtelLogger } from './shared/logging/otel-logger.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: new OtelLogger(buildLoggerOptions(env)),
  });
  app.enableShutdownHooks();
  await app.listen(env.PORT);
}

void bootstrap();
