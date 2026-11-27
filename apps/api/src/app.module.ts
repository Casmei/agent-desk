import { Global, Module } from '@nestjs/common';
import { AppConfig, parseEnv } from './shared/config/env.js';

@Global()
@Module({
  providers: [
    { provide: AppConfig, useValue: new AppConfig(parseEnv(process.env)) },
  ],
  exports: [AppConfig],
})
export class AppModule {}
