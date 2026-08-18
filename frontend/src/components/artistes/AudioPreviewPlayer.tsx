"use client";

import { useState, useRef, useEffect } from "react";

export function AudioPreviewPlayer({ url, title }: { url: string; title?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const format = (t: number) => {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3 bg-taka-cream border border-taka-gray-light rounded-full px-4 py-2 w-full max-w-md">
      <button
        onClick={toggle}
        aria-label={playing ? "Pause" : `Lire l'extrait ${title || ""}`}
        className="w-10 h-10 rounded-full bg-taka-black text-white flex items-center justify-center hover:bg-taka-red transition-colors flex-shrink-0"
      >
        {playing ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
        ) : (
          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-taka-black truncate">{title || "Écouter un extrait"}</p>
        <div className="h-1 bg-taka-gray-light rounded-full mt-1 overflow-hidden">
          <div
            className="h-full bg-taka-red rounded-full transition-all"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
          />
        </div>
      </div>
      <span className="text-xs text-taka-gray flex-shrink-0">{format(currentTime)} / {format(duration)}</span>
      <audio ref={audioRef} src={url} preload="metadata" className="hidden" />
    </div>
  );
}
