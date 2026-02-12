import type { APIRoute } from "astro";
import { getNowPlaying } from "@/lib/spotify";

function notPlaying() {
  return new Response(JSON.stringify({ isPlaying: false }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

export const GET: APIRoute = async () => {
  try {
    const response = await getNowPlaying();

    if (!response || response.status === 204 || response.status > 400) {
      return notPlaying();
    }

    const song = await response.json();

    if (song.item === null) {
      return notPlaying();
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists
      .map((_artist: any) => _artist.name)
      .join(", ");
    const album = song.item.album.name;
    const albumImageUrl = song.item.album.images[0].url;
    const songUrl = song.item.external_urls.spotify;

    return new Response(
      JSON.stringify({
        album,
        albumImageUrl,
        artist,
        isPlaying,
        songUrl,
        title,
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          "cache-control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      },
    );
  } catch (err) {
    console.error("Now playing fetch failed:", err);
    return notPlaying();
  }
};
