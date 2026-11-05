import { useState, type ReactNode } from 'react';
import { COMPAT_DEVICES } from '../data';
import { Tv2, Smartphone, Zap, Monitor, Package } from 'lucide-react';

const DEVICE_ICONS: Record<string, ReactNode> = {
  'smart-tv':  <Tv2 className="w-5 h-5" />,
  'mobile':    <Smartphone className="w-5 h-5" />,
  'firestick': <Zap className="w-5 h-5" />,
  'pc':        <Monitor className="w-5 h-5" />,
  'mag':       <Package className="w-5 h-5" />,
};

export default function DeviceGuides() {
  const [selectedDevice, setSelectedDevice] = useState(COMPAT_DEVICES[0].id);
  const currentDevice = COMPAT_DEVICES.find(d => d.id === selectedDevice) || COMPAT_DEVICES[0];

  return (
    <div className="space-y-6" id="device-guide-container">

      {/* HEADER */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[10px] text-yellow-400 font-display tracking-widest font-bold uppercase block">Compatible Applications</span>
        <h2 className="text-white font-display font-extrabold text-2xl md:text-3xl tracking-tight uppercase">
          Setup IPTV on <span className="text-yellow-400">All Your Screens</span>
        </h2>
        <p className="text-sm text-slate-400 font-sans leading-relaxed max-w-md mx-auto">
          IPTV UK works across all major players and smart TV ecosystems. Follow the steps below to get started.
        </p>
      </div>

      {/* DEVICE SELECTOR */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 max-w-4xl mx-auto">
        {COMPAT_DEVICES.map((device) => (
          <button
            key={device.id}
            onClick={() => setSelectedDevice(device.id)}
            className={`p-3 rounded-xl border text-center flex flex-col items-center gap-2 cursor-pointer transition-all font-sans ${
              selectedDevice === device.id
                ? 'bg-purple-950/80 border-yellow-400/40 text-white shadow-lg shadow-purple-900/30'
                : 'bg-[#1a0533]/40 border-purple-900/30 text-slate-400 hover:text-white hover:border-purple-700/50'
            }`}
          >
            <span className={`flex items-center justify-center w-8 h-8 rounded-lg ${selectedDevice === device.id ? 'bg-yellow-400/10 text-yellow-400' : 'bg-purple-950 text-purple-400'}`}>
              {DEVICE_ICONS[device.id] ?? <Tv2 className="w-5 h-5" />}
            </span>
            <span className="text-xs font-display font-semibold block truncate w-full">{device.name}</span>
          </button>
        ))}
      </div>

      {/* DETAIL CARD */}
      <div className="max-w-3xl mx-auto bg-[#1a0533]/60 border border-purple-900/40 rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

        {/* Steps */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-yellow-400 font-display uppercase tracking-wide">
              <span>{currentDevice.name}</span>
              <span className="text-emerald-400">● Compatible</span>
            </div>
            <h4 className="text-white font-display font-extrabold text-lg mt-1 uppercase">{currentDevice.name} Installation</h4>
            <p className="text-xs text-slate-400 font-sans mt-1">{currentDevice.description}</p>
          </div>

          <div className="border-t border-purple-900/40 pt-3.5 space-y-3">
            {currentDevice.steps.map((step, idx) => (
              <div key={idx} className="flex gap-3 text-sm leading-relaxed text-slate-300 font-sans">
                <div className="w-5 h-5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-[10px] text-yellow-400 font-display font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="flex-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preview panel */}
        <div className="md:col-span-5 relative rounded-xl border border-purple-900/40 p-4 bg-[#0d0014]/60 select-none overflow-hidden aspect-video flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[8px] text-yellow-400 font-display tracking-wider font-bold uppercase">Portal Check</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="text-center py-2">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-yellow-400/10 text-yellow-400 mx-auto mb-2">
              {DEVICE_ICONS[currentDevice.id] ?? <Tv2 className="w-5 h-5" />}
            </span>
            <span className="text-[10px] font-display font-bold text-white block uppercase tracking-tight">{currentDevice.name} Ready</span>
            <p className="text-[8px] text-slate-400 font-sans mt-0.5 max-w-[150px] mx-auto">Enter your server URL and credentials to activate.</p>
          </div>

          <div className="flex gap-1 justify-center">
            <span className="text-[7px] text-yellow-400/60 font-display bg-yellow-400/5 border border-yellow-400/10 rounded px-1.5 py-0.5">M3U</span>
            <span className="text-[7px] text-yellow-400/60 font-display bg-yellow-400/5 border border-yellow-400/10 rounded px-1.5 py-0.5">XTREAM</span>
            <span className="text-[7px] text-yellow-400/60 font-display bg-yellow-400/5 border border-yellow-400/10 rounded px-1.5 py-0.5">PORTAL</span>
          </div>
        </div>

      </div>

      {/* SUPPORT CARD */}
      <div className="max-w-3xl mx-auto bg-[#1a0533]/60 border border-purple-900/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 flex items-center justify-center text-sm font-display font-bold shrink-0">?</div>
          <div>
            <h5 className="text-sm font-display font-bold text-white">Need help setting up your device?</h5>
            <p className="text-xs text-slate-400 font-sans">Our support team is available 24/7 via WhatsApp.</p>
          </div>
        </div>
        <a
          href="https://wa.me/447449708976?text=Hello!%20I%20need%20help%20setting%20up%20IPTV%20UK%20on%20my%20device."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#1ebe5d] text-white font-display font-bold text-xs py-2 px-5 rounded-full shadow-md hover:scale-105 transition-all cursor-pointer shrink-0"
        >
          WhatsApp Support
        </a>
      </div>

    </div>
  );
}
