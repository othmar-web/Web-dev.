import React, { useEffect, useState } from 'react';
import { Minimize2, Play, Pause, SkipBack, SkipForward, Heart, Volume2 } from 'lucide-react';
import { Track } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface FullscreenVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Track;
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  currentTime: number;
}

export const FullscreenVisualizer: React.FC<FullscreenVisualizerProps> = ({
  isOpen,
  onClose,
  currentTrack,
  isPlaying,
  onPlayPauseToggle,
  onNextTrack,
  onPrevTrack,
  currentTime,
}) => {
  const [freqData, setFreqData] = useState<number[]>(new Array(32).fill(10));

  useEffect(() => {
    if (!isOpen) return;
    let animId: number;
    const update = () => {
      const data = audioEngine.getVisualizerData();
      if (data && data.length > 0) {
        // Sample 32 frequency bins
        const sample: number[] = [];
        const step = Math.max(1, Math.floor(data.length / 32));
        for (let i = 0; i < 32; i++) {
          sample.push(data[i * step] || (isPlaying ? 15 + Math.random() * 40 : 8));
        }
        setFreqData(sample);
      } else {
        // Fallback pulsing bars when playing
        setFreqData(
          Array.from({ length: 32 }, (_, i) =>
            isPlaying ? Math.sin((Date.now() / 150) + i) * 35 + 50 : 8
          )
        );
      }
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0c0c] flex flex-col justify-between p-8 sm:p-12 animate-in fade-in select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1ed760] text-black flex items-center justify-center font-bold">
            <Volume2 className="w-4 h-4 fill-black" />
          </div>
          <div>
            <span className="text-white font-bold text-sm tracking-wide">SoundWave Hi-Fi Stage</span>
            <span className="text-xs text-[#1ed760] font-mono ml-3">FLAC 24-bit / 96kHz</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-[#242424] hover:bg-[#333] text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Center Stage: Artwork and Frequency Equalizer */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="relative group mb-8">
          <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(30,215,96,0.3)] ring-1 ring-white/10">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Real-Time Frequency Waveform */}
        <div className="flex items-end justify-center gap-1.5 h-20 w-full max-w-lg mb-6">
          {freqData.map((val, idx) => (
            <div
              key={idx}
              className="w-2 rounded-t-full transition-all duration-75"
              style={{
                height: `${Math.max(6, (val / 255) * 80)}px`,
                backgroundColor: isPlaying ? '#1ed760' : '#4d4d4d',
                boxShadow: isPlaying ? '0 0 8px rgba(30,215,96,0.6)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Track Title and Artist */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            {currentTrack.title}
          </h1>
          <p className="text-lg text-[#b3b3b3]">
            {currentTrack.artist} — {currentTrack.album}
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-center gap-8 max-w-md mx-auto w-full">
        <button
          onClick={onPrevTrack}
          className="text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
        >
          <SkipBack className="w-7 h-7 fill-current" />
        </button>

        <button
          onClick={onPlayPauseToggle}
          className="w-14 h-14 rounded-full bg-white hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-xl transition-all cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-black stroke-black" />
          ) : (
            <Play className="w-6 h-6 fill-black stroke-black translate-x-0.5" />
          )}
        </button>

        <button
          onClick={onNextTrack}
          className="text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
        >
          <SkipForward className="w-7 h-7 fill-current" />
        </button>
      </div>
    </div>
  );
};
