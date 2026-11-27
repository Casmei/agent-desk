import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const PREFIX = 'ad-v1-';
const IV_BYTES = 12;
const AUTH_TAG_BYTES = 16;

export class SecretCipher {
  constructor(private readonly key: Buffer) {}

  encrypt(plaintext: string): string {
    const iv = randomBytes(IV_BYTES);
    const cipher = createCipheriv(ALGORITHM, this.key, iv);
    const ciphertext = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return (
      PREFIX +
      [iv, authTag, ciphertext].map((part) => part.toString('hex')).join('-')
    );
  }

  decrypt(encrypted: string): string {
    const [iv, authTag, ciphertext, ...extra] = encrypted.startsWith(PREFIX)
      ? encrypted.slice(PREFIX.length).split('-')
      : [];
    if (!iv || !authTag || ciphertext === undefined || extra.length > 0) {
      throw new Error('Value is not an ad-v1 encrypted secret');
    }

    const decipher = createDecipheriv(
      ALGORITHM,
      this.key,
      Buffer.from(iv, 'hex'),
      { authTagLength: AUTH_TAG_BYTES },
    );
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    return Buffer.concat([
      decipher.update(Buffer.from(ciphertext, 'hex')),
      decipher.final(),
    ]).toString('utf8');
  }
}
