import fs from 'fs';
import yaml from 'js-yaml';

const requiredEnvs = ['CLIENT_ID', 'PLAYLIST_ID', 'PLAYLIST_LINK', 'SC_AUTH_TOKEN', 'SC_AUTH_TOKEN', 'BOT_TOKEN', 'GOOGLE_CLOUD_PROJECT_ID', 'GOOGLE_CLOUD_REGION'] as const;

const envFile = fs.readFileSync('.env.yaml', 'utf8');
export const envs = yaml.load(envFile) as any;

for (const env of requiredEnvs) {
  if (!envs[env]) {
    throw new Error(`Missing ${env} in .env.yaml`);
  }
}