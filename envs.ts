const CLIENT_ID = Deno.env.get('CLIENT_ID');
if(!CLIENT_ID) throw new Error('CLIENT_ID is not provided');

const PLAYLIST_ID = Deno.env.get('PLAYLIST_ID');
if(!PLAYLIST_ID) throw new Error('PLAYLIST_ID is not provided');

const PLAYLIST_LINK = Deno.env.get('PLAYLIST_LINK');
if(!PLAYLIST_LINK) throw new Error('PLAYLIST_LINK is not provided');

const AUTH = Deno.env.get('AUTH');
if(!AUTH) throw new Error('AUTH is not provided');

const TOKEN = Deno.env.get("TOKEN");
if (!TOKEN) throw new Error("Bot token is not provided");

const WEBHOOK_URL = Deno.env.get("WEBHOOK_URL");
if (!WEBHOOK_URL) throw new Error("Webhook url is not provided");

export const envs =  {
  CLIENT_ID,
  PLAYLIST_ID,
  PLAYLIST_LINK,
  AUTH,
  TOKEN,
  WEBHOOK_URL,
}