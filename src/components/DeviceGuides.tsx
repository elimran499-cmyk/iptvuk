import { useState, type ReactNode } from 'react';
import { COMPAT_DEVICES } from '../data';
import { Tv2, Smartphone, Zap, Monitor, Package } from 'lucide-react';

const DEVICE_ICONS: Record<string, ReactNode> = {
  'smart-tv':   <Tv2 className="w-5 h-5" />,
  'mobile':     <Smartphone className="w-5 h-5" />,
  'firestick':  <Zap className="w-5 h-5" />,
  'pc':         <Monitor className="w-5 h-5" />,
  'mag':        <Package className="w-5 h-5" />,
};

export default function DeviceGuides() {
  const [selectedDevice, setSelectedDevice] = useState(COMPAT_DEVICES[0].id);
  const currentDevice = COMPAT_DEVICES.find(d => d.id === selectedDevice) || COMPAT_DEVICES[0];

  return (
    <div className="space-y-6 font-sans" id="device-guide-container">

      {/* HEADER */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[10px] text-purple-400 font-mono tracking-widest font-bold uppercase block">Compatible Applications</span>
        <h2 className="text-white font-display font-bold text-2xl tracking-tight leading-normal">Setup IPTV on All Your Screens</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          IPTV UK works across all major players and smart TV ecosystems. Follow the steps below to get started on your device.
        </p>
      </div>

      {/* DEVICE SELECTOR */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 max-w-4xl mx-auto" id="device-selection-grid">
        {COMPAT_DEVICES.map((device) => (
          <button
            key={device.id}
            onClick={() => setSelectedDevice(device.id)}
            className={`p-3 rounded-xl border text-center flex flex-col items-center gap-2 cursor-pointer transition-all ${
              selectedDevice === device.id
                ? 'bg-purple-950/60 border-purple-500/40 text-white shadow-lg'
                : 'bg-slate-950/20 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-purple-400">
              {DEVICE_ICONS[device.id] ?? <Tv2 className="w-5 h-5" />}
            </span>
            <span className="text-xs font-semibold block truncate w-full font-display">{device.name}</span>
          </button>
        ))}
      </div>

      {/* DETAIL CARD */}
      <div className="max-w-3xl mx-auto bg-slate-950/80 border border-slate-800 rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

        {/* Steps */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-purple-400 font-mono uppercase tracking-wide">
              <span>{currentDevice.name}</span>
              <span className="text-emerald-400">● Compatible</span>
            </div>
            <h4 className="text-white font-display font-semibold text-lg mt-1">{currentDevice.name} Installation</h4>
            <p className="text-xs text-slate-400 mt-1">{currentDevice.description}</p>
          </div>

          <div className="border-t border-slate-800 pt-3.5 space-y-3">
            {currentDevice.steps.map((step, idx) => (
              <div key={idx} className="flex gap-3 text-xs leading-relaxed text-slate-300">
                <div className="w-5 h-5 rounded-full bg-purple-950 border border-purple-800 text-[10px] text-purple-300 font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="flex-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preview panel */}
        <div className="md:col-span-5 relative rounded-xl border border-slate-800 p-4 bg-slate-900/40 select-none overflow-hidden aspect-video flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[8px] text-purple-400 font-mono tracking-wider font-bold">PORTAL CHECK</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="text-center py-2">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-950 text-purple-300 mx-auto mb-2">
              {DEVICE_ICONS[currentDevice.id] ?? <Tv2 className="w-5 h-5" />}
            </span>
            <span className="text-[10px] font-display font-bold text-white block uppercase tracking-tight">{currentDevice.name} Ready</span>
            <p className="text-[8px] text-slate-400 mt-0.5 max-w-[150px] mx-auto">Enter your server URL and credentials to activate.</p>
          </div>

          <div className="flex gap-1 justify-center">
            <span className="text-[7px] text-slate-500 font-mono bg-slate-950/80 rounded px-1.5 py-0.5">M3U</span>
            <span className="text-[7px] text-slate-500 font-mono bg-slate-950/80 rounded px-1.5 py-0.5">XTREAM API</span>
            <span className="text-[7px] text-slate-500 font-mono bg-slate-950/80 rounded px-1.5 py-0.5">PORTAL</span>
          </div>
        </div>

      </div>

      {/* SUPPORT CARD */}
      <div className="max-w-3xl mx-auto bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-950 border border-purple-800 text-purple-300 flex items-center justify-center text-sm font-semibold shrink-0">?</div>
          <div>
            <h5 className="text-xs font-display font-semibold text-white">Need help setting up your device?</h5>
            <p className="text-[10px] text-slate-400">Our support team is available 24/7 to help you configure your IPTV app via WhatsApp.</p>
          </div>
        </div>

        <a
          href="https://wa.me/447449708976?text=Hello!%20I%20need%20help%20setting%20up%20IPTV%20UK%20on%20my%20device."
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-display font-bold py-2 px-4 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white transition-colors cursor-pointer shrink-0"
        >
          WhatsApp Support
        </a>
      </div>

    </div>
  );
}
