import { Global, Module } from '@nestjs/common';
import { env } from '../config/env.js';
import { SecretCipher } from './secret-cipher.js';

@Global()
@Module({
  providers: [
    {
      provide: SecretCipher,
      useFactory: () => new SecretCipher(env.SECRET_ENCRYPTION_KEY),
    },
  ],
  exports: [SecretCipher],
})
export class SecretEncryptionModule {}
