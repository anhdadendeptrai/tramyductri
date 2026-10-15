'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface MusicPlayerProps {
  audioUrl?: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const defaultAudio =
    audioUrl ||
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3';

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Audio play blocked:', err));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2 select-none">
      <audio ref={audioRef} src={defaultAudio} loop preload="auto" />

      {/* Main Music Button */}
      <button
        onClick={togglePlay}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-serif tracking-widest uppercase transition-all duration-300 shadow-xs cursor-pointer ${
          isPlaying
            ? 'bg-[#6E5A4E] text-[#FFFDF7] border-[#6E5A4E]'
            : 'bg-[#FFFDF7]/90 text-[#6E5A4E] border-[#E8DFD8] hover:bg-[#F5EFEB]'
        }`}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        <Music className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
        <span>♫ MUSIC</span>
      </button>

      {/* Mute Toggle if playing */}
      {isPlaying && (
        <button
          onClick={toggleMute}
          className="p-1.5 bg-[#FFFDF7]/90 hover:bg-[#F5EFEB] border border-[#E8DFD8] text-[#6E5A4E] rounded-full transition-colors cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
};
