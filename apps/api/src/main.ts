import 'reflect-metadata';
import { ConsoleLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.ts';
import { env } from './shared/config/env.ts';
import { buildLoggerOptions } from './shared/logging/logger-options.ts';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger(buildLoggerOptions(env)),
  });
  app.enableShutdownHooks();
  await app.listen(env.PORT);
}

void bootstrap();
