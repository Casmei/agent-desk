import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseClient } from '../../../shared/database/database-client.js';
import { DatabaseModule } from '../../../shared/database/database.module.js';
import { SecretEncryptionModule } from '../../../shared/secret-encryption/secret-encryption.module.js';
import { ChannelConnection } from '../domain/channel-connection.entity.js';
import { ChannelConnectionRepository } from './channel-connection.repository.js';
import { channelConnections } from './channel-connections.schema.js';

const apiKey = 'evo-api-key-123';

function evolutionConnection(): ChannelConnection {
  return ChannelConnection.create({
    channel: 'whatsapp',
    connector: 'evolution',
    connectorSettings: {
      baseUrl: 'http://localhost:8080',
      instanceName: 'store',
    },
    connectorSecrets: { apiKey },
    webhookTokenHash: 'a-token-hash',
  });
}

describe('ChannelConnectionRepository', () => {
  let app: INestApplication;
  let repository: ChannelConnectionRepository;
  let database: DatabaseClient;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule, SecretEncryptionModule],
      providers: [ChannelConnectionRepository],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    repository = app.get(ChannelConnectionRepository);
    database = app.get(DatabaseClient);
  });

  beforeEach(async () => {
    await database.db.delete(channelConnections);
  });

  afterAll(async () => {
    await app.close();
  });

  it('lists a saved connection with its decrypted secrets', async () => {
    const connection = evolutionConnection();

    await repository.save(connection);

    expect(await repository.list()).toContainEqual(connection);
  });

  it('finds a connection by id', async () => {
    const connection = evolutionConnection();
    await repository.save(connection);

    expect(await repository.findById(connection.id)).toEqual(connection);
  });

  it('returns null for an unknown id', async () => {
    expect(await repository.findById(randomUUID())).toBeNull();
  });

  it('stores the connector secrets encrypted', async () => {
    const connection = evolutionConnection();

    await repository.save(connection);

    const [row] = await database.db
      .select()
      .from(channelConnections)
      .where(eq(channelConnections.id, connection.id));
    expect(row?.connectorSecretsEncrypted).toMatch(/^ad-v1-/);
    expect(row?.connectorSecretsEncrypted).not.toContain(apiKey);
  });
});
