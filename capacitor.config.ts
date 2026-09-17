import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.useakola.app',
  appName: 'Akolá',
  server: process.env.CAPACITOR_SERVER_URL
    ? {
        url: process.env.CAPACITOR_SERVER_URL,
        cleartext: process.env.NODE_ENV !== 'production',
      }
    : undefined,
};

export default config;
