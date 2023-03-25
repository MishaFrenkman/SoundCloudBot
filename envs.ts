// import "https://deno.land/std/dotenv/load.ts";

const CLIENT_ID = Deno.env.get('CLIENT_ID');
if(!CLIENT_ID) throw new Error('CLIENT_ID is not provided');

const PLAYLIST_ID = Deno.env.get('PLAYLIST_ID');
if(!PLAYLIST_ID) throw new Error('PLAYLIST_ID is not provided');

const PLAYLIST_LINK = Deno.env.get('PLAYLIST_LINK');
if(!PLAYLIST_LINK) throw new Error('PLAYLIST_LINK is not provided');

const SC_AUTH_TOKEN= Deno.env.get('SC_AUTH_TOKEN');
if(!SC_AUTH_TOKEN) throw new Error('AUTH is not provided');

const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
if (!BOT_TOKEN) throw new Error("Bot token is not provided");

const WEBHOOK_URL = Deno.env.get("WEBHOOK_URL");
if (!WEBHOOK_URL) throw new Error("Webhook url is not provided");

export const envs =  {
  CLIENT_ID,
  PLAYLIST_ID,
  PLAYLIST_LINK,
  SC_AUTH_TOKEN,
  BOT_TOKEN,
  WEBHOOK_URL,
}