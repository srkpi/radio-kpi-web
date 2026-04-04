'use client';

import { useEffect, useRef, useState } from 'react';

export function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onError = () => {
      setError(true);
      setPlaying(false);
    };

    audio.addEventListener('error', onError);
    return () => audio.removeEventListener('error', onError);
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setError(false);

    if (playing) {
      audio.pause();
      audio.src = '';
      setPlaying(false);
    } else {
      audio.src = '/api/bot/stream';
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setError(true);
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      <audio ref={audioRef} preload="none" />
      <button
        onClick={toggle}
        className="inline-flex items-center gap-3 border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
      >
        {playing ? (
          <>
            <span className="flex gap-0.5 items-end h-4">
              <span
                className="w-0.5 bg-current"
                style={{ height: '60%', animation: 'pulse 0.6s ease-in-out infinite alternate' }}
              />
              <span
                className="w-0.5 bg-current"
                style={{
                  height: '100%',
                  animation: 'pulse 0.6s ease-in-out 0.2s infinite alternate',
                }}
              />
              <span
                className="w-0.5 bg-current"
                style={{
                  height: '40%',
                  animation: 'pulse 0.6s ease-in-out 0.4s infinite alternate',
                }}
              />
              <span
                className="w-0.5 bg-current"
                style={{
                  height: '80%',
                  animation: 'pulse 0.6s ease-in-out 0.1s infinite alternate',
                }}
              />
            </span>
            <span className="text-sm font-semibold tracking-widest uppercase">Зупинити</span>
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <polygon points="0,0 14,7 0,14" />
            </svg>
            <span className="text-sm font-semibold tracking-widest uppercase">Онлайн радіо</span>
          </>
        )}
      </button>
      {error && <span className="text-xs text-red-500 tracking-wide">Радіо зараз недоступне</span>}
    </div>
  );
}
