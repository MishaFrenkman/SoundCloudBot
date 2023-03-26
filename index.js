"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// main.ts
var import_telegraf = require("telegraf");
var import_filters = require("telegraf/filters");
var import_jsdom = require("jsdom");

// sc.ts
var import_axios = __toESM(require("axios"));

// envs.ts
var dotenv = __toESM(require("dotenv"));
dotenv.config();
var CLIENT_ID = process.env.CLIENT_ID;
if (!CLIENT_ID)
  throw new Error("CLIENT_ID is not provided");
var PLAYLIST_ID = process.env.PLAYLIST_ID;
if (!PLAYLIST_ID)
  throw new Error("PLAYLIST_ID is not provided");
var PLAYLIST_LINK = process.env.PLAYLIST_LINK;
if (!PLAYLIST_LINK)
  throw new Error("PLAYLIST_LINK is not provided");
var SC_AUTH_TOKEN = process.env.SC_AUTH_TOKEN;
if (!SC_AUTH_TOKEN)
  throw new Error("AUTH is not provided");
var BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN)
  throw new Error("Bot token is not provided");
var WEBHOOK_URL = process.env.WEBHOOK_URL;
if (!WEBHOOK_URL)
  throw new Error("Webhook url is not provided");
var GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
if (!GOOGLE_CLOUD_PROJECT_ID)
  throw new Error("GOOGLE_CLOUD_PROJECT_ID is not provided");
var GOOGLE_CLOUD_REGION = process.env.GOOGLE_CLOUD_REGION;
if (!GOOGLE_CLOUD_REGION)
  throw new Error("GOOGLE_CLOUD_REGION is not provided");
var envs = {
  CLIENT_ID,
  PLAYLIST_ID,
  PLAYLIST_LINK,
  SC_AUTH_TOKEN,
  BOT_TOKEN,
  WEBHOOK_URL,
  GOOGLE_CLOUD_PROJECT_ID,
  GOOGLE_CLOUD_REGION
};

// sc.ts
var BASE_URL = "https://api-v2.soundcloud.com";
var GET_PLAYLIST_URL = `https://api-v2.soundcloud.com/playlists/${envs.PLAYLIST_ID}?representation=full&client_id=${envs.CLIENT_ID}`;
var ADD_TO_PLAYLIST_URL = `${BASE_URL}/playlists/${envs.PLAYLIST_ID}?client_id=${envs.CLIENT_ID}&app_version=1678362857&app_locale=en`;
var addTrackToPlaylist = async (trackId) => {
  try {
    const { data } = await import_axios.default.get(GET_PLAYLIST_URL);
    const playlistTracks = data.tracks.map((track) => Number(track.id));
    if (playlistTracks.includes(trackId)) {
      return "Track was already in playlist!";
    }
    const joinedTracks = [...playlistTracks, trackId];
    await import_axios.default.put(ADD_TO_PLAYLIST_URL, {
      playlist: {
        tracks: joinedTracks
      }
    }, {
      headers: {
        Authorization: envs.SC_AUTH_TOKEN
      }
    });
    return null;
  } catch (error) {
    console.error(error);
    return "Could not add track to playlist, please try another time";
  }
};

// main.ts
var import_axios2 = __toESM(require("axios"));
var getTrackId = async (url) => {
  try {
    const { data, status } = await import_axios2.default.get(url);
    if (status >= 300)
      throw new Error("Failed to fetch track");
    const dom = new import_jsdom.JSDOM(data);
    if (!dom)
      throw new Error("Failed to parse track page");
    const trackId = dom.window.document.querySelector('meta[property="twitter:app:url:iphone"]')?.getAttribute("content")?.split(":").pop();
    return trackId ? Number(trackId) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
var getLinkFromChat = (text) => {
  if (!text)
    return void 0;
  const linkMatch = text.match(/https:\/\/on.soundcloud.com\/[a-zA-Z0-9-]+/g);
  return linkMatch?.map((link) => link)[0];
};
var bot = new import_telegraf.Telegraf(envs.BOT_TOKEN);
bot.telegram.setWebhook(`https://${envs.GOOGLE_CLOUD_REGION}-${envs.GOOGLE_CLOUD_PROJECT_ID}.cloudfunctions.net/${process.env.FUNCTION_TARGET}`);
bot.on((0, import_filters.message)("text"), async (ctx) => {
  const scLink = getLinkFromChat(ctx.message?.text);
  if (!scLink) {
    ctx.reply(`I couldn't find a SoundCloud link in your message. Please send me a link to a track or playlist on SoundCloud.`);
    return;
  }
  ctx.reply("Hang on, this might take a few seconds...");
  const trackId = await getTrackId(scLink);
  if (!trackId) {
    ctx.reply("I couldn't find a track id in the link. Please send me a link to a track on SoundCloud.");
    return;
  }
  const result = await addTrackToPlaylist(trackId);
  if (result) {
    ctx.reply(`${result} ${envs.PLAYLIST_LINK}`);
    return;
  }
  ctx.reply(`Thanks, I've added the track to the playlist! ${envs.PLAYLIST_LINK}`);
});
exports.telegramBotWebhook = (req, res) => {
  bot.handleUpdate(req.body, res);
};
