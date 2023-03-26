import TelegramBot from 'node-telegram-bot-api';
import { JSDOM } from 'jsdom';
import { addTrackToPlaylist } from './sc'
import { envs } from "./envs";

import axios from 'axios';

const getTrackId = async (url: string) => {
  try {
    const { data, status } = await axios.get(url);
    if (status >= 300) throw new Error('Failed to fetch track');

    const dom = new JSDOM(data);
    if (!dom) throw new Error('Failed to parse track page');

    const trackId = dom.window.document.querySelector('meta[property="twitter:app:url:iphone"]')?.getAttribute('content')?.split(':').pop();
    return trackId ? Number(trackId) : null
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getLinkFromChat = (text: string | undefined) => {
  if (!text) return undefined;
  const linkMatch = text.match(/https:\/\/on.soundcloud.com\/[a-zA-Z0-9-]+/g);
  return linkMatch?.map(link => link)[0];
};

const bot = new TelegramBot(envs.BOT_TOKEN);
bot.setWebHook(`${envs.WEBHOOK_URL}/${envs.BOT_TOKEN}`);

bot.on('message', async message => {
  const chatId = message.chat.id;
  const scLink = getLinkFromChat(message.text);
  if (!scLink) {
    bot.sendMessage(chatId, `I couldn't find a SoundCloud link in your message. Please send me a link to a track or playlist on SoundCloud.`,);
    return;
  }

  bot.sendMessage(chatId, `Hang on, this might take a few seconds...`);

  const trackId = await getTrackId(scLink);
  if (!trackId) {
    bot.sendMessage(chatId, `I couldn't find a track id in the link. Please send me a link to a track on SoundCloud.`);
    return;
  }

  const result = await addTrackToPlaylist(trackId);
  if (result) {
    bot.sendMessage(chatId, `${result} ${envs.PLAYLIST_LINK}`);
    return;
  }

  bot.sendMessage(chatId, `Thanks, I've added the track to the playlist! ${envs.PLAYLIST_LINK}`);
});