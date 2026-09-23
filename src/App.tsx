/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  Search,
  CheckCircle,
  Bell,
  History,
  Shield,
  Download,
  Music,
  Share2,
  SlidersHorizontal,
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { QuickAccessGrid } from './components/QuickAccessGrid';
import { PopularAlbumsSection } from './components/PopularAlbumsSection';
import { PopularArtistsSection } from './components/PopularArtistsSection';
import { PlayerDock } from './components/PlayerDock';
import { LyricsModal } from './components/LyricsModal';
import { QueueModal } from './components/QueueModal';
import { DeviceModal } from './components/DeviceModal';
import { PremiumModal } from './components/PremiumModal';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { SettingsModal } from './components/SettingsModal';
import { FullscreenVisualizer } from './components/FullscreenVisualizer';
import {
  TRACKS,
  QUICK_ACCESS_ITEMS,
  ARTISTS,
  INITIAL_PLAYLISTS,
} from './data/musicData';
import { Track, QuickAccessItem, Artist, Playlist } from './types';
import { audioEngine } from './utils/audioEngine';

export default function App() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'library' | 'liked'>('home');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Music' | 'Podcasts' | 'Live Hi-Fi'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Playback state
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]); // Neon Horizon
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(134); // 2:14 matching screenshot
  const [volume, setVolume] = useState<number>(0.82);
  const [isShuffle, setIsShuffle] = useState<boolean>(true); // Active green in screenshot
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set(['track-neon-horizon']));
  const [queue, setQueue] = useState<Track[]>(TRACKS.slice(1));
  const [historyTracks, setHistoryTracks] = useState<Track[]>([TRACKS[0]]);

  // Playlists state
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  // Modals state
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isDeviceOpen, setIsDeviceOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const mainScrollRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Playback progress timer
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentTrack.duration) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  // Handle Play/Pause
  const handlePlayPause = () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.resume(currentTrack.audioChordFrequencies);
      setIsPlaying(true);
    }
  };

  // Play specific track
  const handlePlayTrack = (track: Track) => {
    if (currentTrack.id === track.id) {
      handlePlayPause();
      return;
    }
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);
    audioEngine.playTrack(track.audioChordFrequencies);

    // Add to history
    setHistoryTracks((prev) => [track, ...prev.filter((t) => t.id !== track.id)].slice(0, 15));
    // Update queue
    setQueue(TRACKS.filter((t) => t.id !== track.id));
  };

  // Next Track
  const handleNextTrack = () => {
    if (repeatMode === 'one') {
      setCurrentTime(0);
      audioEngine.playTrack(currentTrack.audioChordFrequencies);
      return;
    }

    if (queue.length > 0) {
      const nextTrack = isShuffle
        ? queue[Math.floor(Math.random() * queue.length)]
        : queue[0];
      handlePlayTrack(nextTrack);
    } else {
      // Loop back to beginning of track list
      const nextIndex = (TRACKS.findIndex((t) => t.id === currentTrack.id) + 1) % TRACKS.length;
      handlePlayTrack(TRACKS[nextIndex]);
    }
  };

  // Prev Track
  const handlePrevTrack = () => {
    if (currentTime > 4) {
      setCurrentTime(0);
      return;
    }
    const currIndex = TRACKS.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currIndex - 1 + TRACKS.length) % TRACKS.length;
    handlePlayTrack(TRACKS[prevIndex]);
  };

  // Seek
  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
  };

  // Volume
  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    audioEngine.setVolume(vol);
  };

  // Toggle Like
  const handleToggleLike = () => {
    setLikedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentTrack.id)) {
        next.delete(currentTrack.id);
        showToast(`Removed "${currentTrack.title}" from Liked Songs`);
      } else {
        next.add(currentTrack.id);
        showToast(`Added "${currentTrack.title}" to Liked Songs`);
      }
      return next;
    });
  };

  // Quick Access Click
  const handlePlayQuickAccess = (item: QuickAccessItem) => {
    const track = TRACKS.find((t) => t.id === item.trackId) || TRACKS[0];
    handlePlayTrack(track);
  };

  // Artist Click
  const handlePlayArtist = (artist: Artist) => {
    const track = TRACKS.find((t) => t.id === artist.popularTrackId) || TRACKS[0];
    handlePlayTrack(track);
  };

  // Create Playlist
  const handleCreatePlaylist = (name: string, description: string) => {
    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}`,
      name,
      trackCount: 0,
      isCustom: true,
    };
    setPlaylists((prev) => [newPlaylist, ...prev]);
    setSelectedPlaylistId(newPlaylist.id);
    showToast(`Playlist "${name}" created!`);
  };

  // Filter content based on category and search
  const filteredAlbums = TRACKS.filter((track) => {
    const matchesCategory =
      activeCategory === 'All'
        ? true
        : activeCategory === 'Music'
        ? track.category === 'music'
        : activeCategory === 'Podcasts'
        ? track.category === 'podcasts'
        : track.category === 'live';

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.album.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const filteredArtists = ARTISTS.filter((artist) => {
    if (!searchQuery.trim()) return true;
    return (
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#121212] text-[#e5e2e1] font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1ed760] text-black px-4 py-2 rounded-full font-bold text-xs shadow-xl animate-in fade-in slide-in-from-top duration-200 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 fill-black stroke-[#1ed760]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Workspace (Sidebar + Stage) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar
            currentView={currentView}
            onNavigate={(v) => {
              setCurrentView(v as any);
              setSelectedPlaylistId(null);
            }}
            playlists={playlists}
            selectedPlaylistId={selectedPlaylistId}
            onSelectPlaylist={(id) => {
              setSelectedPlaylistId(id);
              const pl = playlists.find((p) => p.id === id);
              if (pl) showToast(`Loaded "${pl.name}" playlist`);
            }}
            onCreatePlaylistClick={() => setIsCreatePlaylistOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenLegal={() => setIsLegalOpen(true)}
            onInstallApp={() => showToast('SoundWave Hi-Fi is ready for offline caching.')}
          />
        </div>

        {/* Mobile Slide-Over Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/70 backdrop-blur-sm flex">
            <div className="w-72 bg-[#121212] h-full shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#242424] text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <Sidebar
                currentView={currentView}
                onNavigate={(v) => {
                  setCurrentView(v as any);
                  setSelectedPlaylistId(null);
                  setMobileMenuOpen(false);
                }}
                playlists={playlists}
                selectedPlaylistId={selectedPlaylistId}
                onSelectPlaylist={(id) => {
                  setSelectedPlaylistId(id);
                  setMobileMenuOpen(false);
                }}
                onCreatePlaylistClick={() => {
                  setIsCreatePlaylistOpen(true);
                  setMobileMenuOpen(false);
                }}
                onOpenSettings={() => {
                  setIsSettingsOpen(true);
                  setMobileMenuOpen(false);
                }}
                onOpenLegal={() => {
                  setIsLegalOpen(true);
                  setMobileMenuOpen(false);
                }}
                onInstallApp={() => {
                  showToast('SoundWave Hi-Fi is ready for offline caching.');
                  setMobileMenuOpen(false);
                }}
              />
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Fluid Content Stage */}
        <div
          ref={mainScrollRef}
          className="flex-1 flex flex-col h-full overflow-y-auto relative bg-[#131313]"
        >
          {/* Dynamic Hero Atmospheric Backdrop Glow */}
          <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-[#1a3822] via-[#14261a]/60 to-transparent pointer-events-none z-0" />

          {/* Sticky Top Header */}
          <div className="sticky top-0 z-30 bg-[#131313]/90 backdrop-blur-md border-b border-white/[0.04]">
            <div className="flex items-center">
              {/* Mobile Hamburger Menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden ml-4 p-2 text-white bg-[#201f1f] rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex-1">
                <Header
                  searchQuery={searchQuery}
                  onSearchChange={(q) => setSearchQuery(q)}
                  onExplorePremiumClick={() => setIsPremiumOpen(true)}
                  onNotificationsClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  onHistoryClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  onProfileClick={() => setIsSettingsOpen(true)}
                  canGoBack={true}
                  canGoForward={false}
                  onGoBack={() => {
                    setCurrentView('home');
                    setSelectedPlaylistId(null);
                    setSearchQuery('');
                  }}
                  onGoForward={() => {}}
                />
              </div>
            </div>

            {/* Notifications Popover */}
            {isNotificationsOpen && (
              <div className="absolute right-16 top-16 w-80 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl p-4 z-40 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-[#2e2e2e]">
                  <span className="font-bold text-sm text-white">What's New in Hi-Fi</span>
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-[#8e8e8e] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3 pt-3 text-xs">
                  <div className="p-2 rounded-lg bg-[#262626] border border-white/5">
                    <p className="font-bold text-white text-xs">Julian Vance - New Album</p>
                    <p className="text-[#8e8e8e] mt-0.5">Midnight Resonance in 24-bit 96kHz Master FLAC.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#262626] border border-white/5">
                    <p className="font-bold text-white text-xs">Weekly Hi-Fi Mix Ready</p>
                    <p className="text-[#8e8e8e] mt-0.5">Curated dynamic tracks tailored to your frequency profile.</p>
                  </div>
                </div>
              </div>
            )}

            {/* History Popover */}
            {isHistoryOpen && (
              <div className="absolute right-6 top-16 w-80 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl p-4 z-40 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-[#2e2e2e]">
                  <span className="font-bold text-sm text-white">Recently Played</span>
                  <button
                    onClick={() => setIsHistoryOpen(false)}
                    className="text-[#8e8e8e] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 pt-3 max-h-60 overflow-y-auto">
                  {historyTracks.map((tr) => (
                    <div
                      key={tr.id}
                      onClick={() => {
                        handlePlayTrack(tr);
                        setIsHistoryOpen(false);
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#282828] cursor-pointer"
                    >
                      <img
                        src={tr.coverUrl}
                        alt={tr.title}
                        className="w-8 h-8 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-bold text-white truncate">{tr.title}</p>
                        <p className="text-[#8e8e8e] truncate">{tr.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Stage Content */}
          <main className="px-6 md:px-8 py-6 relative z-10">
            {/* View Title & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {selectedPlaylistId
                  ? playlists.find((p) => p.id === selectedPlaylistId)?.name
                  : currentView === 'liked'
                  ? 'Liked Songs'
                  : currentView === 'library'
                  ? 'Your Library'
                  : currentView === 'search'
                  ? 'Explore & Search'
                  : 'Good evening'}
              </h1>

              {/* Filter Tabs Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {(['All', 'Music', 'Podcasts', 'Live Hi-Fi'] as const).map((tab) => {
                  const isActive = activeCategory === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveCategory(tab)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-white text-black shadow-md scale-102'
                          : 'bg-[#242424] hover:bg-[#303030] text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Access Grid (6 Items) */}
            <QuickAccessGrid
              items={QUICK_ACCESS_ITEMS}
              currentTrackId={currentTrack.id}
              isPlaying={isPlaying}
              onPlayItem={handlePlayQuickAccess}
            />

            {/* Section 1: Popular Albums & Singles */}
            <PopularAlbumsSection
              tracks={filteredAlbums}
              currentTrackId={currentTrack.id}
              isPlaying={isPlaying}
              onPlayTrack={handlePlayTrack}
              onShowAll={() => showToast('Displaying full trending album catalog.')}
            />

            {/* Section 2: Popular Artists */}
            <PopularArtistsSection
              artists={filteredArtists}
              currentTrackId={currentTrack.id}
              isPlaying={isPlaying}
              onPlayArtist={handlePlayArtist}
              onShowAll={() => showToast('Displaying all certified Hi-Fi artists.')}
            />
          </main>
        </div>
      </div>

      {/* Anchored Bottom Playback Dock */}
      <PlayerDock
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPauseToggle={handlePlayPause}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        isLiked={likedTrackIds.has(currentTrack.id)}
        onLikeToggle={handleToggleLike}
        currentTime={currentTime}
        onSeek={handleSeek}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        isShuffle={isShuffle}
        onShuffleToggle={() => {
          setIsShuffle(!isShuffle);
          showToast(!isShuffle ? 'Shuffle mode enabled' : 'Shuffle mode disabled');
        }}
        repeatMode={repeatMode}
        onRepeatToggle={() => {
          const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
          const nextIndex = (modes.indexOf(repeatMode) + 1) % modes.length;
          setRepeatMode(modes[nextIndex]);
          showToast(`Repeat: ${modes[nextIndex]}`);
        }}
        onOpenLyrics={() => setIsLyricsOpen(true)}
        onOpenQueue={() => setIsQueueOpen(true)}
        onOpenDevices={() => setIsDeviceOpen(true)}
        onOpenFullscreen={() => setIsFullscreenOpen(true)}
        onToggleMiniPlayer={() => setIsFullscreenOpen(true)}
      />

      {/* Synced Lyrics Modal */}
      <LyricsModal
        isOpen={isLyricsOpen}
        onClose={() => setIsLyricsOpen(false)}
        currentTrack={currentTrack}
        currentTime={currentTime}
      />

      {/* Queue Modal */}
      <QueueModal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        currentTrack={currentTrack}
        queue={queue}
        onPlayQueueItem={(track) => {
          handlePlayTrack(track);
        }}
      />

      {/* Connect to Device Modal */}
      <DeviceModal
        isOpen={isDeviceOpen}
        onClose={() => setIsDeviceOpen(false)}
      />

      {/* Explore Premium Modal */}
      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
      />

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onCreate={handleCreatePlaylist}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Fullscreen Visualizer */}
      <FullscreenVisualizer
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPauseToggle={handlePlayPause}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        currentTime={currentTime}
      />

      {/* Legal Modal */}
      {isLegalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#282828]">
              <span className="font-bold text-white text-sm">SoundWave Legal & Compliance</span>
              <button
                onClick={() => setIsLegalOpen(false)}
                className="text-[#8e8e8e] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[#b3b3b3]">
              SoundWave Premium Hi-Fi operates under global audio licensing frameworks adhering to high-resolution PCM and FLAC lossless distribution guidelines.
            </p>
            <p className="text-[#8e8e8e]">
              All sound synthesizers and frequencies comply with International Standard IEC 61672 audio emission standards.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsLegalOpen(false)}
                className="px-4 py-1.5 rounded-full bg-[#282828] text-white hover:bg-[#333]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
