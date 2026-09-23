import React, { useState } from 'react';
import { X, Check, Sparkles, Zap, Shield, Headphones } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<'individual' | 'duo' | 'family'>('individual');
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#181818] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in">
        {/* Banner with emerald glow */}
        <div className="relative p-8 bg-gradient-to-br from-emerald-950/70 via-[#181818] to-[#121212] border-b border-[#282828] flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1ed760]/20 border border-[#1ed760]/40 text-[#1ed760] text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              SOUNDWAVE HI-FI PRO
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Experience Sound Without Compromise.
            </h2>
            <p className="text-sm text-[#b3b3b3] mt-2">
              Lossless 24-bit / 192kHz studio master quality, ad-free unlimited skips, and immersive 3D spatial staging.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#242424] hover:bg-[#333] text-[#b3b3b3] hover:text-white flex items-center justify-center cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-[#242424]">
          <div className="p-3 rounded-xl bg-[#201f1f] border border-white/5">
            <Zap className="w-5 h-5 text-[#1ed760] mb-2" />
            <h4 className="font-bold text-white text-sm">FLAC Studio Master</h4>
            <p className="text-xs text-[#8e8e8e] mt-1">
              Uncompressed studio grade audio up to 9216 kbps.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#201f1f] border border-white/5">
            <Headphones className="w-5 h-5 text-[#1ed760] mb-2" />
            <h4 className="font-bold text-white text-sm">Zero Interruptions</h4>
            <p className="text-xs text-[#8e8e8e] mt-1">
              Pure music focus without advertisements or limits.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#201f1f] border border-white/5">
            <Shield className="w-5 h-5 text-[#1ed760] mb-2" />
            <h4 className="font-bold text-white text-sm">Offline Downloads</h4>
            <p className="text-xs text-[#8e8e8e] mt-1">
              Save favorite albums in pristine lossless offline.
            </p>
          </div>
        </div>

        {/* Plans */}
        <div className="p-6">
          <h4 className="text-xs font-bold text-[#8e8e8e] uppercase tracking-wider mb-3">
            Choose Your Tier (30 Days Free Trial)
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedPlan('individual')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedPlan === 'individual'
                  ? 'bg-[#201f1f] border-[#1ed760] shadow-[0_0_12px_rgba(30,215,96,0.2)]'
                  : 'bg-[#181818] border-white/5 hover:bg-[#201f1f]'
              }`}
            >
              <span className="block text-xs font-bold text-white">Individual</span>
              <span className="block text-base font-extrabold text-[#1ed760] mt-1">$10.99</span>
              <span className="block text-[11px] text-[#8e8e8e]">/month</span>
            </button>

            <button
              onClick={() => setSelectedPlan('duo')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedPlan === 'duo'
                  ? 'bg-[#201f1f] border-[#1ed760] shadow-[0_0_12px_rgba(30,215,96,0.2)]'
                  : 'bg-[#181818] border-white/5 hover:bg-[#201f1f]'
              }`}
            >
              <span className="block text-xs font-bold text-white">Duo Hi-Fi</span>
              <span className="block text-base font-extrabold text-[#1ed760] mt-1">$14.99</span>
              <span className="block text-[11px] text-[#8e8e8e]">2 accounts</span>
            </button>

            <button
              onClick={() => setSelectedPlan('family')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedPlan === 'family'
                  ? 'bg-[#201f1f] border-[#1ed760] shadow-[0_0_12px_rgba(30,215,96,0.2)]'
                  : 'bg-[#181818] border-white/5 hover:bg-[#201f1f]'
              }`}
            >
              <span className="block text-xs font-bold text-white">Family 6x</span>
              <span className="block text-base font-extrabold text-[#1ed760] mt-1">$17.99</span>
              <span className="block text-[11px] text-[#8e8e8e]">up to 6 users</span>
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => {
                setIsSubscribed(true);
                setTimeout(() => {
                  onClose();
                  setIsSubscribed(false);
                }, 1500);
              }}
              className="w-full py-3.5 px-6 rounded-full bg-[#1ed760] hover:bg-[#34e36a] text-black font-extrabold text-sm tracking-wide transition-all shadow-[0_8px_24px_rgba(30,215,96,0.4)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {isSubscribed ? '✓ Premium Activated!' : 'Start 30-Day Free Trial'}
            </button>
            <p className="text-[11px] text-[#727272] text-center">
              Renews automatically. Cancel anytime in account settings before trial ends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
