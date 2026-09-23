import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), description.trim());
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181818] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-[#282828] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-[#1ed760]" />
            <h3 className="font-bold text-white text-base">Create New Playlist</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#242424] hover:bg-[#333] text-[#b3b3b3] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#b3b3b3] uppercase tracking-wider mb-2">
              Playlist Name
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Late Night Hi-Fi Sanctuary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#242424] focus:bg-[#2a2a2a] text-white text-sm rounded-lg p-3 border border-transparent focus:border-[#1ed760] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#b3b3b3] uppercase tracking-wider mb-2">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add an optional description for this collection..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#242424] focus:bg-[#2a2a2a] text-white text-sm rounded-lg p-3 border border-transparent focus:border-[#1ed760] focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-[#b3b3b3] hover:text-white hover:bg-[#242424] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2 rounded-full bg-[#1ed760] hover:bg-[#34e36a] text-black text-xs font-extrabold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
