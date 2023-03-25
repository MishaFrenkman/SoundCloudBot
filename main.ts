import {
  TelegramBot,
  UpdateType,
} from "https://deno.land/x/telegram_bot_api@0.4.0/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { addTracksToPlaylist } from './sc.ts'
import { envs } from "./envs.ts";

const getTrackId = async (url: string) => {
  try {
    const res = await fetch(url);
    if (!res || !res.ok) throw new Error('Failed to fetch track', { cause: res.statusText });
    const html = await res.text();

    const page = new DOMParser().parseFromString(html, 'text/html');
    if (!page) return;
    const trackId = page.querySelector('meta[property="twitter:app:url:iphone"]')?.getAttribute('content')?.split(':').pop();
    return trackId;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getLinkFromChat = (text: string | undefined) => {
  if(!text) return undefined;
  const linkMatch = text.match(/https:\/\/on.soundcloud.com\/[a-zA-Z0-9-]+/g);
  return linkMatch?.map(link => link);
};

const bot = new TelegramBot(envs.TOKEN);

bot.on(UpdateType.Message, async ({ message }) => {
  const scLinks = getLinkFromChat(message.text);
  if(!scLinks) {
    await bot.sendMessage({
      chat_id: message.chat.id,
      text: `I couldn't find a SoundCloud link in your message. Please send me a link to a track or playlist on SoundCloud.`,
    });

    return;
  }

  const trackIdsMaybe = await Promise.all(scLinks.map(link => getTrackId(link)));
  const trackIds = trackIdsMaybe.map(Number).filter(Boolean) as number[];
  if (!trackIds.length) {
    await bot.sendMessage({
      chat_id: message.chat.id,
      text: `I couldn't find a track id in the link. Please send me a link to a track on SoundCloud.`,
    });

    return;
  }

  const ok = await addTracksToPlaylist(trackIds);
  if(!ok) {
    await bot.sendMessage({
      chat_id: message.chat.id,
      text: `I couldn't add the track to the playlist. Please try again later.`,
    })
    return;
  }

  await bot.sendMessage({
    chat_id: message.chat.id,
    text: `Thanks, I've added the track to the playlist! ${envs.PLAYLIST_LINK}`,
  });
});

bot.setWebhook({
  url: `${envs.WEBHOOK_URL}/${envs.TOKEN}`,
});

bot.run({
  webhook: {
    pathname: `/${envs.TOKEN}`
  }
})


if (import.meta.main) {
  const links = Deno.readTextFileSync('links.txt')?.split('\n') ?? [];
  if (!links.length) throw new Error('No links found');

  const trackIdsMaybe = await Promise.all(links.map(link => getTrackId(link)));
  const trackIds = trackIdsMaybe.map(Number).filter(Boolean) as number[];
  if (!trackIds.length) throw new Error('No track ids found');
  await addTracksToPlaylist(trackIds);
}