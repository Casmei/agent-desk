import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { SecretCipher } from './secret-cipher.js';

const secret = 'evo-token-123';

describe('SecretCipher', () => {
  const cipher = new SecretCipher(randomBytes(32));

  it('decrypts the value it encrypted', () => {
    const encrypted = cipher.encrypt(secret);

    expect(cipher.decrypt(encrypted)).toBe(secret);
  });

  it('writes the value as ad-v1-<iv>-<tag>-<ciphertext> in hex', () => {
    const encrypted = cipher.encrypt(secret);

    expect(encrypted).toMatch(/^ad-v1-[0-9a-f]{24}-[0-9a-f]{32}-[0-9a-f]+$/);
    expect(encrypted).not.toContain(secret);
  });

  it('produces a different value for the same secret each time', () => {
    expect(cipher.encrypt(secret)).not.toBe(cipher.encrypt(secret));
  });

  it('rejects a tampered value', () => {
    const encrypted = cipher.encrypt(secret);
    const lastChar = encrypted.at(-1) === '0' ? '1' : '0';
    const tampered = encrypted.slice(0, -1) + lastChar;

    expect(() => cipher.decrypt(tampered)).toThrow();
  });

  it('rejects a value encrypted with another key', () => {
    const otherCipher = new SecretCipher(randomBytes(32));

    expect(() => cipher.decrypt(otherCipher.encrypt(secret))).toThrow();
  });

  it('rejects a value without the ad-v1 prefix', () => {
    expect(() => cipher.decrypt(secret)).toThrow();
  });
});
