import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AppConfig } from './shared/config/env.js';

async function bootstrap(): Promise<void> {
  // Nest declares its options as a class, so a plain object literal trips this rule.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-class-instance-assignment
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableShutdownHooks();
  await app.listen(app.get(AppConfig).values.PORT);
}

void bootstrap();
