import React from 'react';
import { X, Play, Music, ListOrdered } from 'lucide-react';
import { Track } from '../types';

interface QueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Track;
  queue: Track[];
  onPlayQueueItem: (track: Track) => void;
}

export const QueueModal: React.FC<QueueModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  queue,
  onPlayQueueItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181818] border border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#282828] flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <ListOrdered className="w-5 h-5 text-[#1ed760]" />
            <span>Play Queue</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#242424] hover:bg-[#333] text-[#b3b3b3] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Now Playing */}
          <div>
            <h4 className="text-xs font-bold text-[#8e8e8e] uppercase tracking-wider mb-3">
              Now Playing
            </h4>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#242424] border border-[#1ed760]/30">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm truncate text-[#1ed760]">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-[#b3b3b3] truncate">
                  {currentTrack.artist}
                </p>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#1ed760] animate-pulse" />
            </div>
          </div>

          {/* Next In Queue */}
          <div>
            <h4 className="text-xs font-bold text-[#8e8e8e] uppercase tracking-wider mb-3">
              Next In Queue ({queue.length})
            </h4>
            <div className="space-y-2">
              {queue.map((track, idx) => (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => onPlayQueueItem(track)}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#242424] group cursor-pointer transition-colors"
                >
                  <span className="w-5 text-center text-xs font-mono text-[#8e8e8e] group-hover:hidden">
                    {idx + 1}
                  </span>
                  <div className="w-5 text-center hidden group-hover:block text-[#1ed760]">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate group-hover:text-[#1ed760]">
                      {track.title}
                    </p>
                    <p className="text-xs text-[#b3b3b3] truncate">
                      {track.artist}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-[#8e8e8e]">
                    {Math.floor(track.duration / 60)}:
                    {(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#141414] border-t border-[#242424] text-xs text-[#8e8e8e] text-center">
          Auto-play will transition seamlessly between tracks
        </div>
      </div>
    </div>
  );
};
