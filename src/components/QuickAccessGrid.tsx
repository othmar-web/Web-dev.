import React from 'react';
import { Play, Pause } from 'lucide-react';
import { QuickAccessItem } from '../types';

interface QuickAccessGridProps {
  items: QuickAccessItem[];
  currentTrackId: string;
  isPlaying: boolean;
  onPlayItem: (item: QuickAccessItem) => void;
}

export const QuickAccessGrid: React.FC<QuickAccessGridProps> = ({
  items,
  currentTrackId,
  isPlaying,
  onPlayItem,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8">
      {items.map((item) => {
        const isCurrent = currentTrackId === item.trackId;
        const isActivePlaying = isCurrent && isPlaying;

        return (
          <div
            key={item.id}
            onClick={() => onPlayItem(item)}
            className={`group flex items-center bg-[#201f1f]/80 hover:bg-[#2e2d2d] rounded-md overflow-hidden cursor-pointer transition-all duration-200 relative shadow-sm border border-white/5 hover:border-white/10 ${
              isCurrent ? 'ring-1 ring-[#1ed760]/60 bg-[#282727]' : ''
            }`}
          >
            {/* Thumbnail Art */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 relative bg-[#181818] overflow-hidden">
              <img
                src={item.coverUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0 px-4 py-2">
              <span className="font-bold text-white text-sm sm:text-base line-clamp-2 tracking-tight group-hover:text-white transition-colors">
                {item.title}
              </span>
            </div>

            {/* Floating Green Play/Pause Trigger */}
            <div className="pr-4 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayItem(item);
                }}
                aria-label={isActivePlaying ? `Pause ${item.title}` : `Play ${item.title}`}
                className={`w-11 h-11 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-[0_8px_20px_rgba(30,215,96,0.45)] hover:scale-105 hover:bg-[#34e36a] transition-all duration-200 ${
                  isActivePlaying
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                }`}
              >
                {isActivePlaying ? (
                  <Pause className="w-5 h-5 fill-black stroke-black" />
                ) : (
                  <Play className="w-5 h-5 fill-black stroke-black translate-x-0.5" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
