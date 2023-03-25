import {
  TelegramBot,
  UpdateType,
} from "https://deno.land/x/telegram_bot_api@0.3.1/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { addTrackToPlaylist } from './sc.ts'
import { envs } from "./envs.ts";

const getTrackId = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res || !res.ok) throw new Error('Failed to fetch track', { cause: res.statusText });
    const html = await res.text();

    const page = new DOMParser().parseFromString(html, 'text/html');
    if (!page) throw new Error('Failed to parse track page');
    const trackId = page.querySelector('meta[property="twitter:app:url:iphone"]')?.getAttribute('content')?.split(':').pop();
    return trackId ? Number(trackId): null
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getLinkFromChat = (text: string | undefined) => {
  if(!text) return undefined;
  const linkMatch = text.match(/https:\/\/on.soundcloud.com\/[a-zA-Z0-9-]+/g);
  return linkMatch?.map(link => link)[0];
};

const bot = new TelegramBot(envs.BOT_TOKEN);

bot.on(UpdateType.Message, async ({ message }) => {
  const scLink = getLinkFromChat(message.text);
  if(!scLink) {
    await bot.sendMessage({
      chat_id: message.chat.id,
      text: `I couldn't find a SoundCloud link in your message. Please send me a link to a track or playlist on SoundCloud.`,
    });

    return;
  }

  await bot.sendMessage({
    chat_id: message.chat.id,
    text: `Hang on, this might take a few seconds...`,
  });

  const trackId = await getTrackId(scLink);
  if (!trackId) {
    await bot.sendMessage({
      chat_id: message.chat.id,
      text: `I couldn't find a track id in the link. Please send me a link to a track on SoundCloud.`,
    });

    return;
  }

  const result = await addTrackToPlaylist(trackId);
  if(result) {
    await bot.sendMessage({
      chat_id: message.chat.id,
      text: `${result} ${envs.PLAYLIST_LINK}`
    })
    return;
  }

  await bot.sendMessage({
    chat_id: message.chat.id,
    text: `Thanks, I've added the track to the playlist! ${envs.PLAYLIST_LINK}`,
  });
});

bot.setWebhook({
  url: `${envs.WEBHOOK_URL}/${envs.BOT_TOKEN}`,
});

bot.run({
  webhook: {
    pathname: `/${envs.BOT_TOKEN}`
  }
})