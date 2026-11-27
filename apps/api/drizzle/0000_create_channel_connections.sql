CREATE TABLE "channel_connections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"channel" text NOT NULL,
	"connector" text NOT NULL,
	"connector_settings" jsonb NOT NULL,
	"connector_secrets_encrypted" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
