import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { Channel } from '../domain/channel-connection.entity.js';

export const channelConnections = pgTable('channel_connections', {
  id: uuid('id').primaryKey(),
  channel: text('channel').$type<Channel>().notNull(),
  connector: text('connector').notNull(),
  connectorSettings: jsonb('connector_settings')
    .$type<Record<string, unknown>>()
    .notNull(),
  connectorSecretsEncrypted: text('connector_secrets_encrypted').notNull(),
  webhookTokenHash: text('webhook_token_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});
