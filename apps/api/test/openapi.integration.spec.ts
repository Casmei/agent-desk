import type { Server } from 'node:http';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { setupOpenApi } from '../src/shared/openapi/setup-openapi.js';

describe('GET /docs-json', () => {
  let app: INestApplication;
  let document: {
    paths: Record<string, Record<string, { security?: unknown }>>;
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    setupOpenApi(app);
    await app.init();

    const response = await request(app.getHttpServer() as Server)
      .get('/docs-json')
      .expect(200);
    document = response.body;
  });

  afterAll(async () => {
    await app.close();
  });

  it('describes every route', () => {
    expect(Object.keys(document.paths).sort()).toEqual([
      '/channel-connections',
      '/channel-connections/evolution',
      '/health',
      '/webhooks/evolution/{connectionId}',
    ]);
  });

  it('asks for the token each route requires', () => {
    expect(document.paths['/health']?.get?.security).toBeUndefined();
    expect(document.paths['/channel-connections']?.get?.security).toEqual([
      { 'admin-token': [] },
    ]);
    expect(
      document.paths['/channel-connections/evolution']?.post?.security,
    ).toEqual([{ 'admin-token': [] }]);
    expect(
      document.paths['/webhooks/evolution/{connectionId}']?.post?.security,
    ).toEqual([{ 'webhook-token': [] }]);
  });
});
