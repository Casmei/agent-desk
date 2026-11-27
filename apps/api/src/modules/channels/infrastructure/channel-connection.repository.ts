import { Injectable } from '@nestjs/common';
import { DatabaseClient } from '../../../shared/database/database-client.js';
import { SecretCipher } from '../../../shared/secret-encryption/secret-cipher.js';
import { ChannelConnectionPort } from '../application/channel-connection.port.js';
import { ChannelConnection } from '../domain/channel-connection.entity.js';
import { channelConnections } from './channel-connections.schema.js';

type ChannelConnectionRow = typeof channelConnections.$inferSelect;

@Injectable()
export class ChannelConnectionRepository implements ChannelConnectionPort {
  constructor(
    private readonly database: DatabaseClient,
    private readonly cipher: SecretCipher,
  ) {}

  async save(connection: ChannelConnection): Promise<void> {
    await this.database.db
      .insert(channelConnections)
      .values(this.toRow(connection));
  }

  async list(): Promise<ChannelConnection[]> {
    const rows = await this.database.db
      .select()
      .from(channelConnections)
      .orderBy(channelConnections.createdAt);
    return rows.map((row) => this.toEntity(row));
  }

  private toRow(connection: ChannelConnection): ChannelConnectionRow {
    return {
      id: connection.id,
      channel: connection.channel,
      connector: connection.connector,
      connectorSettings: connection.connectorSettings,
      connectorSecretsEncrypted: this.cipher.encrypt(
        JSON.stringify(connection.connectorSecrets),
      ),
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt,
    };
  }

  private toEntity(row: ChannelConnectionRow): ChannelConnection {
    return new ChannelConnection({
      id: row.id,
      channel: row.channel,
      connector: row.connector,
      connectorSettings: row.connectorSettings,
      connectorSecrets: JSON.parse(
        this.cipher.decrypt(row.connectorSecretsEncrypted),
      ) as Record<string, string>,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
