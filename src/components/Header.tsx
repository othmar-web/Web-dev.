import React from 'react';
import { ChevronLeft, ChevronRight, Search, Bell, History, X, Check } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExplorePremiumClick: () => void;
  onNotificationsClick: () => void;
  onHistoryClick: () => void;
  onProfileClick: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onGoBack?: () => void;
  onGoForward?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onExplorePremiumClick,
  onNotificationsClick,
  onHistoryClick,
  onProfileClick,
  canGoBack = true,
  canGoForward = false,
  onGoBack,
  onGoForward,
}) => {
  return (
    <header className="h-16 px-6 flex items-center justify-between gap-4 bg-transparent z-20">
      {/* Left History Arrows */}
      <div className="flex items-center gap-2">
        <button
          onClick={onGoBack}
          disabled={!canGoBack}
          aria-label="Go back"
          className="w-8 h-8 rounded-full bg-[#181818] hover:bg-[#282828] text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={onGoForward}
          disabled={!canGoForward}
          aria-label="Go forward"
          className="w-8 h-8 rounded-full bg-[#181818] hover:bg-[#282828] text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Middle Search Input */}
      <div className="flex-1 max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757575]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="What do you want to play?"
          className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white placeholder-[#757575] text-sm rounded-full py-2.5 pl-10 pr-10 border border-transparent focus:border-white focus:outline-none transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#757575] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onExplorePremiumClick}
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#727272] hover:border-white text-white text-xs font-bold hover:scale-105 transition-all shadow-xs"
        >
          Explore Premium
        </button>

        <button
          onClick={onNotificationsClick}
          aria-label="Notifications"
          className="w-9 h-9 rounded-full bg-[#181818] hover:bg-[#282828] text-[#b3b3b3] hover:text-white flex items-center justify-center relative transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[#1ed760] absolute top-2 right-2 ring-2 ring-[#121212]" />
        </button>

        <button
          onClick={onHistoryClick}
          aria-label="Listening History"
          className="w-9 h-9 rounded-full bg-[#181818] hover:bg-[#282828] text-[#b3b3b3] hover:text-white flex items-center justify-center transition-colors"
        >
          <History className="w-4 h-4" />
        </button>

        {/* User Profile Pill */}
        <div
          onClick={onProfileClick}
          className="flex items-center gap-2 bg-[#181818] hover:bg-[#282828] pl-1 pr-3 py-1 rounded-full cursor-pointer transition-all border border-[#2a2a2a]"
        >
          <img
            src="/src/assets/images/avatar_alex_rivera_1790129436924.jpg"
            alt="Alex Rivera"
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-full object-cover ring-1 ring-[#1ed760]/50"
          />
          <span className="text-xs font-bold text-white hidden md:inline">
            Alex Rivera
          </span>
        </div>
      </div>
    </header>
  );
};
