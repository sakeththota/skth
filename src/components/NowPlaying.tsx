import React, { useEffect, useState } from "react";

export const NowPlaying = () => {
  const [data, setData] = useState<any>(null);

  const fetchNowPlaying = async () => {
    const res = await fetch("http://localhost:4321/api/spotify/now-playing");
    return res.json();
  };

  useEffect(() => {
    fetchNowPlaying().then((data) => {
      console.log(data);
      setData(data);
    });
  }, []);

  return (
    <div>
      <h2>Now Playing</h2>
      {data && (
        <div>
          <div>{data.title}</div>
          <div>{data.artist}</div>
          <img src={data.albumImageUrl} alt="album cover" />
        </div>
      )}
    </div>
  );
};
