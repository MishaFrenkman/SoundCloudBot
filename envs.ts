// import "https://deno.land/std/dotenv/load.ts";
import * as dotenv from 'dotenv'
dotenv.config()

const CLIENT_ID = process.env.CLIENT_ID;
if (!CLIENT_ID) throw new Error('CLIENT_ID is not provided');

const PLAYLIST_ID = process.env.PLAYLIST_ID;
if (!PLAYLIST_ID) throw new Error('PLAYLIST_ID is not provided');

const PLAYLIST_LINK = process.env.PLAYLIST_LINK;
if (!PLAYLIST_LINK) throw new Error('PLAYLIST_LINK is not provided');

const SC_AUTH_TOKEN = process.env.SC_AUTH_TOKEN;
if (!SC_AUTH_TOKEN) throw new Error('AUTH is not provided');

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("Bot token is not provided");

const WEBHOOK_URL = process.env.WEBHOOK_URL;
if (!WEBHOOK_URL) throw new Error("Webhook url is not provided");

const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
if (!GOOGLE_CLOUD_PROJECT_ID) throw new Error("GOOGLE_CLOUD_PROJECT_ID is not provided");

const GOOGLE_CLOUD_REGION = process.env.GOOGLE_CLOUD_REGION;
if (!GOOGLE_CLOUD_REGION) throw new Error("GOOGLE_CLOUD_REGION is not provided");


export const envs = {
  CLIENT_ID,
  PLAYLIST_ID,
  PLAYLIST_LINK,
  SC_AUTH_TOKEN,
  BOT_TOKEN,
  WEBHOOK_URL,
  GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_CLOUD_REGION
}