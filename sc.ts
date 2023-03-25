import axios from 'npm:axios';
import { envs } from './envs.ts';

const BASE_URL = 'https://api-v2.soundcloud.com';
const GET_PLAYLIST_URL = `https://api-v2.soundcloud.com/playlists/${envs.PLAYLIST_ID}?representation=full&client_id=${envs.CLIENT_ID}`;
const ADD_TO_PLAYLIST_URL = `${BASE_URL}/playlists/${envs.PLAYLIST_ID}?client_id=${envs.CLIENT_ID}&app_version=1678362857&app_locale=en`;

export const addTracksToPlaylist = async (trackIDs: number[] | string[]) => {
  try {
    const { data } = await axios.get(GET_PLAYLIST_URL)
    const playlistTracks: string[] = data.tracks.map((track: any) => track.id);

    console.log(`Tracks in playlist: ${playlistTracks}`);
    console.log(`Tracks to add: ${trackIDs}`);

    const joinedTracks = [...playlistTracks, ...trackIDs];

    await axios.put(ADD_TO_PLAYLIST_URL, {
      playlist: {
        tracks: joinedTracks
      }
    }, {
      headers: {
        Authorization: envs.SC_AUTH_TOKEN
      }
    });

    return true;

  } catch (error) {
    console.error(error)
    return false;
  }
}
