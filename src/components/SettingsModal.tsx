import React, { useState } from 'react';
import { X, Settings, Sliders, CheckCircle, Radio } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [audioQuality, setAudioQuality] = useState<'normal' | 'high' | 'hifi' | 'master'>('master');
  const [crossfade, setCrossfade] = useState(true);
  const [loudnessNorm, setLoudnessNorm] = useState(true);
  const [hardwareAccel, setHardwareAccel] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181818] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-[#282828] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#1ed760]" />
            <h3 className="font-bold text-white text-base">SoundWave Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#242424] hover:bg-[#333] text-[#b3b3b3] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Audio Quality */}
          <div>
            <h4 className="text-xs font-bold text-[#8e8e8e] uppercase tracking-wider mb-3">
              Streaming Audio Quality
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'normal', name: 'Normal', rate: '160 kbit/s AAC' },
                { id: 'high', name: 'High', rate: '320 kbit/s OGG' },
                { id: 'hifi', name: 'Hi-Fi Lossless', rate: '1411 kbit/s 16/44.1' },
                { id: 'master', name: 'Studio Master', rate: '9216 kbit/s 24/192 FLAC' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAudioQuality(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    audioQuality === opt.id
                      ? 'bg-[#201f1f] border-[#1ed760] text-white shadow-xs'
                      : 'bg-[#181818] border-white/5 text-[#8e8e8e] hover:bg-[#201f1f]'
                  }`}
                >
                  <p className="font-bold text-xs text-white">{opt.name}</p>
                  <p className="text-[11px] text-[#34e36a] font-mono mt-0.5">{opt.rate}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Playback Preferences */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-[#8e8e8e] uppercase tracking-wider mb-2">
              Acoustic Playback Engine
            </h4>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#201f1f] border border-white/5">
              <div>
                <p className="text-sm font-bold text-white">Seamless Crossfade</p>
                <p className="text-xs text-[#8e8e8e]">3-second harmonic curve between tracks</p>
              </div>
              <input
                type="checkbox"
                checked={crossfade}
                onChange={(e) => setCrossfade(e.target.checked)}
                className="w-4 h-4 accent-[#1ed760] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#201f1f] border border-white/5">
              <div>
                <p className="text-sm font-bold text-white">Audio Normalization (EBU R128)</p>
                <p className="text-xs text-[#8e8e8e]">Equalize loudness across diverse albums</p>
              </div>
              <input
                type="checkbox"
                checked={loudnessNorm}
                onChange={(e) => setLoudnessNorm(e.target.checked)}
                className="w-4 h-4 accent-[#1ed760] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#201f1f] border border-white/5">
              <div>
                <p className="text-sm font-bold text-white">GPU Hardware Audio Acceleration</p>
                <p className="text-xs text-[#8e8e8e]">Sub-millisecond buffer and zero latency</p>
              </div>
              <input
                type="checkbox"
                checked={hardwareAccel}
                onChange={(e) => setHardwareAccel(e.target.checked)}
                className="w-4 h-4 accent-[#1ed760] cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#141414] border-t border-[#242424] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#1ed760] text-black text-xs font-bold hover:bg-[#34e36a] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
