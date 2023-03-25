import { envs } from './envs.ts';

const BASE_URL = 'https://api-v2.soundcloud.com';
const GET_PLAYLIST_URL = `https://api-v2.soundcloud.com/playlists/${envs.PLAYLIST_ID}?representation=full&client_id=${envs.CLIENT_ID}`;
const ADD_TO_PLAYLIST_URL = `${BASE_URL}/playlists/${envs.PLAYLIST_ID}?client_id=${envs.CLIENT_ID}&app_version=1678362857&app_locale=en`;

export const addTrackToPlaylist = async (trackId: number) => {
  try {
    const data = await fetch(GET_PLAYLIST_URL).then(res => res.json());
    const playlistTracks: number[] = data.tracks.map((track: any) => Number(track.id));

    if (playlistTracks.includes(trackId)) {
      return 'Track was already in playlist!'
    }

    const joinedTracks = [...playlistTracks, trackId];

    await fetch(ADD_TO_PLAYLIST_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': envs.SC_AUTH_TOKEN
      },
      body: JSON.stringify({
        playlist: {
          tracks: joinedTracks
        }
      })
    });

    return null;

  } catch (error) {
    console.error(error)
    return 'Could not add track to playlist, please try another time';
  }
}
