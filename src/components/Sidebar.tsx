import React from 'react';
import {
  Home,
  Search,
  Library,
  PlusSquare,
  Heart,
  ArrowDownCircle,
  Settings,
  Shield,
  Volume2
} from 'lucide-react';
import { Playlist } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  playlists: Playlist[];
  selectedPlaylistId: string | null;
  onSelectPlaylist: (playlistId: string) => void;
  onCreatePlaylistClick: () => void;
  onOpenSettings: () => void;
  onOpenLegal: () => void;
  onInstallApp: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  playlists,
  selectedPlaylistId,
  onSelectPlaylist,
  onCreatePlaylistClick,
  onOpenSettings,
  onOpenLegal,
  onInstallApp,
}) => {
  return (
    <aside className="w-64 bg-[#121212] flex flex-col justify-between h-full select-none border-r border-[#1c1b1b] shrink-0 text-[#b3b3b3]">
      <div className="flex flex-col h-[calc(100%-110px)]">
        {/* Brand Header */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 px-6 pt-6 pb-6 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-[#1ed760] text-black flex items-center justify-center shadow-[0_0_16px_rgba(30,215,96,0.35)] group-hover:scale-105 transition-transform">
            <Volume2 className="w-5 h-5 fill-black stroke-black stroke-2" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-white text-lg tracking-tight leading-tight">
              SoundWave
            </span>
            <span className="text-[10px] font-bold text-[#34e36a] tracking-wider uppercase">
              PREMIUM HI-FI
            </span>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="px-3 space-y-1 mb-6">
          <button
            onClick={() => onNavigate('home')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
              currentView === 'home'
                ? 'bg-[#201f1f] text-white shadow-sm'
                : 'text-[#b3b3b3] hover:text-white hover:bg-[#181818]'
            }`}
          >
            <Home className={`w-5 h-5 ${currentView === 'home' ? 'text-[#1ed760]' : ''}`} />
            <span>Home</span>
          </button>

          <button
            onClick={() => onNavigate('search')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
              currentView === 'search'
                ? 'bg-[#201f1f] text-white shadow-sm'
                : 'text-[#b3b3b3] hover:text-white hover:bg-[#181818]'
            }`}
          >
            <Search className={`w-5 h-5 ${currentView === 'search' ? 'text-[#1ed760]' : ''}`} />
            <span>Search</span>
          </button>

          <button
            onClick={() => onNavigate('library')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
              currentView === 'library'
                ? 'bg-[#201f1f] text-white shadow-sm'
                : 'text-[#b3b3b3] hover:text-white hover:bg-[#181818]'
            }`}
          >
            <Library className={`w-5 h-5 ${currentView === 'library' ? 'text-[#1ed760]' : ''}`} />
            <span>Your Library</span>
          </button>
        </nav>

        {/* Playlist Actions */}
        <div className="px-3 space-y-1 mb-4">
          <button
            onClick={onCreatePlaylistClick}
            className="w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#b3b3b3] hover:text-white hover:bg-[#181818] transition-all group"
          >
            <div className="w-6 h-6 rounded bg-[#2a2a2a] group-hover:bg-white text-white group-hover:text-black flex items-center justify-center transition-colors">
              <PlusSquare className="w-4 h-4" />
            </div>
            <span>Create Playlist</span>
          </button>

          <button
            onClick={() => onNavigate('liked')}
            className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all group ${
              currentView === 'liked' ? 'text-white bg-[#201f1f]' : 'text-[#b3b3b3] hover:text-white hover:bg-[#181818]'
            }`}
          >
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-xs">
              <Heart className="w-3.5 h-3.5 fill-white" />
            </div>
            <span>Liked Songs</span>
          </button>
        </div>

        <div className="mx-6 border-t border-[#242424] my-2" />

        {/* Playlists Scroll Area */}
        <div className="px-6 py-2 overflow-y-auto space-y-3 text-sm flex-1">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => onSelectPlaylist(pl.id)}
              className={`cursor-pointer truncate transition-colors ${
                selectedPlaylistId === pl.id
                  ? 'text-[#1ed760] font-semibold'
                  : 'text-[#8e8e8e] hover:text-white'
              }`}
            >
              {pl.name}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer Controls */}
      <div className="px-6 py-4 border-t border-[#1c1b1b] space-y-3 bg-[#121212]">
        <button
          onClick={onInstallApp}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-[#201f1f] hover:bg-[#2a2a2a] text-white text-xs font-bold transition-all border border-[#2e2e2e]"
        >
          <ArrowDownCircle className="w-4 h-4 text-[#1ed760]" />
          <span>Install App</span>
        </button>

        <div className="flex items-center justify-between text-xs text-[#727272] pt-1">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
          <button
            onClick={onOpenLegal}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Legal</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
