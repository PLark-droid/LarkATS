/**
 * Lark API Client Configuration
 */

import * as lark from '@larksuiteoapi/node-sdk';
import 'dotenv/config';

// Lark Client Singleton
let client: lark.Client | null = null;

export function getLarkClient(): lark.Client {
  if (!client) {
    const appId = process.env.LARK_APP_ID;
    const appSecret = process.env.LARK_APP_SECRET;

    if (!appId || !appSecret) {
      throw new Error('LARK_APP_ID and LARK_APP_SECRET must be set in environment variables');
    }

    client = new lark.Client({
      appId,
      appSecret,
      appType: lark.AppType.SelfBuild,
      domain: lark.Domain.Lark, // Use lark.Domain.Feishu for Feishu
    });
  }

  return client;
}

export function getBaseAppToken(): string {
  const appToken = process.env.LARK_BASE_APP_TOKEN;
  if (!appToken) {
    throw new Error('LARK_BASE_APP_TOKEN must be set in environment variables');
  }
  return appToken;
}
