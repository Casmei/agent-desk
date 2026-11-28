import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupOpenApi(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('agent-desk')
    .setDescription('API de gestão e webhooks do agent-desk.')
    .addApiKey(
      { type: 'apiKey', in: 'header', name: 'x-admin-token' },
      'admin-token',
    )
    .addApiKey(
      { type: 'apiKey', in: 'header', name: 'x-webhook-token' },
      'webhook-token',
    )
    .build();

  SwaggerModule.setup('docs', app, () =>
    SwaggerModule.createDocument(app, config),
  );
}
