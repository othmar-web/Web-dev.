import React from 'react';
import { X, Music2 } from 'lucide-react';
import { Track } from '../types';

interface LyricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Track;
  currentTime: number;
}

export const LyricsModal: React.FC<LyricsModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  currentTime,
}) => {
  if (!isOpen) return null;

  const lyrics = currentTrack.lyrics || [
    '[0:00] (Instrumental intro with Hi-Fi stereo depth)',
    '[0:30] Pure analog warmth through electronic air',
    '[1:00] Feel the rhythm resonate everywhere',
    '[1:45] SoundWave lossless master stream',
    '[2:30] Living inside a sonic dream',
  ];

  const parseLyricTime = (line: string): number => {
    const match = line.match(/\[(\d+):(\d+)\]/);
    if (!match) return 0;
    return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181818] border border-white/10 rounded-2xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#282828] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-lg object-cover shadow"
            />
            <div>
              <h3 className="font-bold text-white text-base leading-tight">
                {currentTrack.title}
              </h3>
              <p className="text-xs text-[#b3b3b3]">
                {currentTrack.artist} — Synced Hi-Fi Lyrics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#242424] hover:bg-[#333] text-[#b3b3b3] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lyrics Scroll Area */}
        <div className="p-8 overflow-y-auto space-y-6 flex-1 text-center">
          {lyrics.map((line, idx) => {
            const time = parseLyricTime(line);
            const cleanText = line.replace(/\[\d+:\d+\]\s*/, '');
            const isCurrent = currentTime >= time && (idx === lyrics.length - 1 || currentTime < parseLyricTime(lyrics[idx + 1]));

            return (
              <p
                key={idx}
                className={`transition-all duration-300 ${
                  isCurrent
                    ? 'text-white text-xl sm:text-2xl font-bold scale-105 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                    : 'text-[#6a6a6a] text-base sm:text-lg font-medium hover:text-[#a0a0a0]'
                }`}
              >
                {cleanText}
              </p>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#141414] border-t border-[#242424] flex items-center justify-between text-xs text-[#8e8e8e]">
          <span className="flex items-center gap-1.5">
            <Music2 className="w-3.5 h-3.5 text-[#1ed760]" />
            SoundWave AI Acoustic Sync
          </span>
          <span>FLAC 24-bit / 96kHz Lossless</span>
        </div>
      </div>
    </div>
  );
};
