import { useEffect, useRef, useState } from "react";

interface TrailerPlayerProps {
  trailerUrl: string;
  title: string;
}

function getTrailerId(url: string): string {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.split("/")[1] ?? "";
    }

    if (parsedUrl.pathname.startsWith("/embed/")) {
      return parsedUrl.pathname.split("/")[2] ?? "";
    }

    return parsedUrl.searchParams.get("v") ?? url;
  } catch {
    return url;
  }
}

function TrailerPlayer({ trailerUrl, title }: TrailerPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const trailerId = getTrailerId(trailerUrl);

  useEffect(() => {
    setIsPlaying(false);
  }, [trailerUrl]);

  function togglePlayback() {
    const player = iframeRef.current?.contentWindow;

    if (!player) return;

    player.postMessage(
      JSON.stringify({
        event: "command",
        func: isPlaying ? "pauseVideo" : "playVideo",
        args: [],
      }),
      "https://www.youtube.com",
    );

    setIsPlaying((previous) => !previous);
  }

  return (
    <section className="movie-trailer" aria-label={`Trailer för ${title}`}>
      <iframe
        ref={iframeRef}
        className="movie-trailer__video"
        src={`https://www.youtube.com/embed/${encodeURIComponent(trailerId)}?enablejsapi=1&controls=0&playsinline=1&rel=0&origin=${encodeURIComponent(window.location.origin)}`}
        title={`Trailer för ${title}`}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />

      <button
        type="button"
        className="movie-trailer__toggle"
        onClick={togglePlayback}
        aria-label={isPlaying ? "Pausa trailern" : "Spela trailern"}
      >
        {isPlaying ? "Ⅱ" : "▶"}
      </button>
    </section>
  );
}

export default TrailerPlayer;
