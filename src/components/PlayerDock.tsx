import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Mic2,
  ListMusic,
  Speaker,
  Volume2,
  VolumeX,
  Volume1,
  Maximize2,
  PictureInPicture2
} from 'lucide-react';
import { Track } from '../types';

interface PlayerDockProps {
  currentTrack: Track;
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  isLiked: boolean;
  onLikeToggle: () => void;
  currentTime: number;
  onSeek: (seconds: number) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isShuffle: boolean;
  onShuffleToggle: () => void;
  repeatMode: 'off' | 'all' | 'one';
  onRepeatToggle: () => void;
  onOpenLyrics: () => void;
  onOpenQueue: () => void;
  onOpenDevices: () => void;
  onOpenFullscreen: () => void;
  onToggleMiniPlayer?: () => void;
}

export const PlayerDock: React.FC<PlayerDockProps> = ({
  currentTrack,
  isPlaying,
  onPlayPauseToggle,
  onNextTrack,
  onPrevTrack,
  isLiked,
  onLikeToggle,
  currentTime,
  onSeek,
  volume,
  onVolumeChange,
  isShuffle,
  onShuffleToggle,
  repeatMode,
  onRepeatToggle,
  onOpenLyrics,
  onOpenQueue,
  onOpenDevices,
  onOpenFullscreen,
  onToggleMiniPlayer,
}) => {
  const [isScrubberHovered, setIsScrubberHovered] = useState(false);
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume || 0.8);

  const formatTime = (sec: number) => {
    const totalSec = Math.floor(sec);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = currentTrack.duration > 0
    ? (currentTime / currentTrack.duration) * 100
    : 0;

  const handleVolumeMuteToggle = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      onVolumeChange(0);
    } else {
      onVolumeChange(previousVolume || 0.8);
    }
  };

  return (
    <footer className="h-[88px] bg-[#000000] border-t border-[#1c1b1b] px-4 md:px-6 flex items-center justify-between z-40 select-none">
      {/* Zone 1: Current Track Info */}
      <div className="flex items-center gap-3.5 w-[28%] min-w-[180px]">
        <div className="relative group w-14 h-14 rounded-md overflow-hidden bg-[#181818] shrink-0 shadow-md">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col min-w-0 mr-1">
          <span className="font-bold text-sm text-white hover:underline cursor-pointer truncate tracking-tight">
            {currentTrack.title}
          </span>
          <span className="text-xs text-[#b3b3b3] hover:text-white hover:underline cursor-pointer truncate mt-0.5">
            {currentTrack.artist}
          </span>
        </div>

        <div className="flex items-center gap-1.5 ml-1">
          <button
            onClick={onLikeToggle}
            aria-label={isLiked ? "Unlike song" : "Like song"}
            className="p-1 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isLiked
                  ? 'fill-[#1ed760] text-[#1ed760] drop-shadow-[0_0_6px_rgba(30,215,96,0.6)]'
                  : 'text-[#b3b3b3] hover:text-white'
              }`}
            />
          </button>
          
          {onToggleMiniPlayer && (
            <button
              onClick={onToggleMiniPlayer}
              aria-label="Picture in Picture"
              className="p-1 text-[#b3b3b3] hover:text-white transition-colors hidden sm:inline-block cursor-pointer"
            >
              <PictureInPicture2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Zone 2: Main Playback Controls & Scrubber */}
      <div className="flex flex-col items-center max-w-[620px] w-[44%]">
        {/* Buttons Row */}
        <div className="flex items-center gap-5 mb-1.5">
          <button
            onClick={onShuffleToggle}
            aria-label="Shuffle"
            className={`p-1 transition-colors relative cursor-pointer ${
              isShuffle ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            {isShuffle && (
              <span className="w-1 h-1 rounded-full bg-[#1ed760] absolute -bottom-1 left-1/2 -translate-x-1/2" />
            )}
          </button>

          <button
            onClick={onPrevTrack}
            aria-label="Previous track"
            className="p-1 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Primary Play/Pause Button */}
          <button
            onClick={onPlayPauseToggle}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-9 h-9 rounded-full bg-white hover:scale-105 active:scale-95 text-black flex items-center justify-center transition-all shadow-md cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black stroke-black" />
            ) : (
              <Play className="w-4 h-4 fill-black stroke-black translate-x-0.5" />
            )}
          </button>

          <button
            onClick={onNextTrack}
            aria-label="Next track"
            className="p-1 text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={onRepeatToggle}
            aria-label="Repeat mode"
            className={`p-1 transition-colors relative cursor-pointer ${
              repeatMode !== 'off' ? 'text-[#1ed760]' : 'text-[#b3b3b3] hover:text-white'
            }`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            {repeatMode !== 'off' && (
              <span className="w-1 h-1 rounded-full bg-[#1ed760] absolute -bottom-1 left-1/2 -translate-x-1/2" />
            )}
          </button>
        </div>

        {/* Scrubber Row */}
        <div className="w-full flex items-center gap-2.5 text-xs text-[#8e8e8e] font-mono tabular-nums">
          <span className="w-9 text-right">{formatTime(currentTime)}</span>
          
          <div
            className="relative flex-1 h-4 flex items-center cursor-pointer group"
            onMouseEnter={() => setIsScrubberHovered(true)}
            onMouseLeave={() => setIsScrubberHovered(false)}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              onSeek(ratio * currentTrack.duration);
            }}
          >
            {/* Background Track */}
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              {/* Progress Fill */}
              <div
                className={`h-full rounded-full transition-all duration-75 ${
                  isScrubberHovered ? 'bg-[#1ed760]' : 'bg-white'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Scrubber Thumb */}
            <div
              className={`absolute w-3 h-3 bg-white rounded-full -ml-1.5 shadow-md transition-opacity pointer-events-none ${
                isScrubberHovered ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <span className="w-9">{formatTime(currentTrack.duration)}</span>
        </div>
      </div>

      {/* Zone 3: Secondary Utilities */}
      <div className="flex items-center justify-end gap-3 w-[28%] min-w-[180px] text-[#b3b3b3]">
        <button
          onClick={onOpenLyrics}
          title="Lyrics"
          aria-label="Lyrics"
          className="p-1 hover:text-white transition-colors cursor-pointer"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenQueue}
          title="Queue"
          aria-label="Queue"
          className="p-1 hover:text-white transition-colors cursor-pointer"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenDevices}
          title="Hi-Fi Output Device"
          aria-label="Audio Devices"
          className="p-1 text-[#1ed760] hover:scale-105 transition-transform cursor-pointer relative"
        >
          <Speaker className="w-4 h-4 stroke-[#1ed760]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#1ed760] absolute top-0.5 right-0.5" />
        </button>

        {/* Volume Scrubber */}
        <div
          className="flex items-center gap-2 w-28 group"
          onMouseEnter={() => setIsVolumeHovered(true)}
          onMouseLeave={() => setIsVolumeHovered(false)}
        >
          <button
            onClick={handleVolumeMuteToggle}
            aria-label={volume === 0 ? "Unmute" : "Mute"}
            className="p-1 hover:text-white transition-colors cursor-pointer"
          >
            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <div
            className="relative flex-1 h-3 flex items-center cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              onVolumeChange(ratio);
            }}
          >
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-75 ${
                  isVolumeHovered ? 'bg-[#1ed760]' : 'bg-white'
                }`}
                style={{ width: `${volume * 100}%` }}
              />
            </div>
            <div
              className={`absolute w-3 h-3 bg-white rounded-full -ml-1.5 shadow-sm transition-opacity pointer-events-none ${
                isVolumeHovered ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ left: `${volume * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={onOpenFullscreen}
          title="Fullscreen Visualizer"
          aria-label="Fullscreen"
          className="p-1 hover:text-white transition-colors hidden lg:inline-block cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
};
