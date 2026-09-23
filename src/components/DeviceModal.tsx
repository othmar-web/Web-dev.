import React, { useState } from 'react';
import { X, Laptop, Speaker, Headphones, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AudioDevice {
  id: string;
  name: string;
  type: 'computer' | 'speaker' | 'headphones';
  format: string;
  isHiFi: boolean;
}

const DEVICES: AudioDevice[] = [
  {
    id: 'dev-1',
    name: 'SoundWave Hi-Fi Engine (This Web Session)',
    type: 'computer',
    format: 'FLAC 24-bit / 96kHz Master',
    isHiFi: true,
  },
  {
    id: 'dev-2',
    name: 'Living Room Sonos Era 300',
    type: 'speaker',
    format: 'Lossless 24-bit / 48kHz',
    isHiFi: true,
  },
  {
    id: 'dev-3',
    name: 'Studio Reference Monitors (USB DAC)',
    type: 'speaker',
    format: 'Ultra HD 32-bit / 192kHz Direct',
    isHiFi: true,
  },
  {
    id: 'dev-4',
    name: 'AirPods Max (Spatial Audio)',
    type: 'headphones',
    format: 'AAC 256kbps Personalized HRTF',
    isHiFi: false,
  },
];

export const DeviceModal: React.FC<DeviceModalProps> = ({ isOpen, onClose }) => {
  const [selectedId, setSelectedId] = useState('dev-1');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181818] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#282828] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Speaker className="w-5 h-5 text-[#1ed760]" />
            <h3 className="font-bold text-white text-base">Connect to a Device</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#242424] hover:bg-[#333] text-[#b3b3b3] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Device list */}
        <div className="p-4 space-y-2">
          {DEVICES.map((dev) => {
            const isSelected = selectedId === dev.id;
            return (
              <div
                key={dev.id}
                onClick={() => setSelectedId(dev.id)}
                className={`p-3 rounded-xl flex items-center justify-between cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-[#201f1f] border-[#1ed760]/60 shadow-[0_0_15px_rgba(30,215,96,0.15)]'
                    : 'bg-[#181818] border-transparent hover:bg-[#222]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#1ed760] text-black'
                        : 'bg-[#282828] text-[#b3b3b3]'
                    }`}
                  >
                    {dev.type === 'computer' ? (
                      <Laptop className="w-5 h-5" />
                    ) : dev.type === 'speaker' ? (
                      <Speaker className="w-5 h-5" />
                    ) : (
                      <Headphones className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-bold leading-snug ${
                        isSelected ? 'text-[#1ed760]' : 'text-white'
                      }`}
                    >
                      {dev.name}
                    </p>
                    <p className="text-xs text-[#8e8e8e]">{dev.format}</p>
                  </div>
                </div>

                {isSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-[#1ed760]" />
                ) : dev.isHiFi ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#242424] text-[#34e36a]">
                    HI-FI
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Hi-Fi Protocol Badge */}
        <div className="p-4 bg-[#141414] border-t border-[#242424] flex items-center justify-between text-xs text-[#8e8e8e]">
          <span className="flex items-center gap-1.5 text-[#1ed760]">
            <ShieldCheck className="w-4 h-4" />
            Direct bit-perfect streaming active
          </span>
          <span className="font-mono">Bit-depth: 24/96</span>
        </div>
      </div>
    </div>
  );
};
