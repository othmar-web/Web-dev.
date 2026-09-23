import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Track } from '../types';

interface PopularAlbumsSectionProps {
  tracks: Track[];
  currentTrackId: string;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onShowAll?: () => void;
}

export const PopularAlbumsSection: React.FC<PopularAlbumsSectionProps> = ({
  tracks,
  currentTrackId,
  isPlaying,
  onPlayTrack,
  onShowAll,
}) => {
  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Popular Albums & Singles
          </h2>
          <p className="text-xs text-[#b3b3b3] mt-1 font-medium">
            Trending releases curated for your sound profile
          </p>
        </div>
        <button
          onClick={onShowAll}
          className="text-xs font-bold text-[#b3b3b3] hover:text-white hover:underline transition-colors cursor-pointer tracking-wider"
        >
          Show all
        </button>
      </div>

      {/* Grid of Albums */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
        {tracks.slice(0, 5).map((track) => {
          const isCurrent = currentTrackId === track.id;
          const isActivePlaying = isCurrent && isPlaying;

          return (
            <div
              key={track.id}
              onClick={() => onPlayTrack(track)}
              className={`bg-[#181818] hover:bg-[#282828] p-4 rounded-lg transition-all duration-200 group cursor-pointer relative flex flex-col border border-white/[0.04] hover:border-white/[0.08] shadow-md hover:shadow-xl ${
                isCurrent ? 'ring-1 ring-[#1ed760]/50' : ''
              }`}
            >
              {/* Album Art with Floating Play Button */}
              <div className="w-full aspect-square rounded-md overflow-hidden relative mb-3.5 bg-[#201f1f] shadow-inner">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                />
                
                {/* Floating Green Play/Pause Trigger */}
                <div className="absolute right-2.5 bottom-2.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayTrack(track);
                    }}
                    aria-label={isActivePlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                    className={`w-11 h-11 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-[0_8px_24px_-4px_rgba(30,215,96,0.6)] hover:scale-105 hover:bg-[#34e36a] transition-all duration-200 ${
                      isActivePlaying
                        ? 'opacity-100 translate-y-0'
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

              {/* Title */}
              <h3 className="font-bold text-white text-sm sm:text-base truncate tracking-tight mb-1">
                {track.title}
              </h3>

              {/* Unboxed Metadata (Zero-Pill discipline) */}
              <p className="text-xs text-[#b3b3b3] truncate font-normal">
                <span>{track.artist}</span>
                <span className="mx-1.5 opacity-60">·</span>
                <span>{track.releaseYear}</span>
                <span className="mx-1.5 opacity-60">·</span>
                <span>{track.type}</span>
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
