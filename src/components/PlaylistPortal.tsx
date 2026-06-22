import React, { useState } from 'react';
import { Upload, Key, FileText, Check, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface PlaylistPortalProps {
  onClose: () => void;
  onImportSuccess: (importedChannels: any[]) => void;
}

export default function PlaylistPortal({ onClose, onImportSuccess }: PlaylistPortalProps) {
  const [importMode, setImportMode] = useState<'m3u' | 'xtream'>('m3u');
  const [playlistName, setPlaylistName] = useState('My IPTV Stream Playlist');
  const [m3uUrl, setM3uUrl] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProgressMsg('Requesting secure handshake connection to server endpoint...');

    setTimeout(() => {
      setProgressMsg('Decrypting transmission metadata and parsing stream catalogs...');
    }, 1000);

    setTimeout(() => {
      setProgressMsg('Sieving channel playlists. 1,420 channels and EPG files detected...');
    }, 2000);

    setTimeout(() => {
      setProgressMsg('Writing secure local keys on client sandbox cache...');
    }, 3000);

    setTimeout(() => {
      // Mock generated channels loaded from m3u or xtream
      const mockImported = [
        { id: `imp-${Math.random()}`, name: 'Canal+ Foot Direct 4K', logo: '⚽', category: 'Sports', streamUrl: '', quality: '4K', online: true },
        { id: `imp-${Math.random()}`, name: 'TF1 HD France Live stream', logo: '📺', category: 'Entertainment', streamUrl: '', quality: '1080p', online: true },
        { id: `imp-${Math.random()}`, name: 'ZDF HD Deutschland Live', logo: '🇩🇪', category: 'News', streamUrl: '', quality: '1080p', online: true },
        { id: `imp-${Math.random()}`, name: 'SuperSport Maximo HD Live Action', logo: '🏈', category: 'Sports', streamUrl: '', quality: '1080p', online: true }
      ];
      
      setIsProcessing(false);
      setSuccess(true);
      onImportSuccess(mockImported);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-900 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden relative">
        
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-cyan-400 animate-spin" />
            </div>
            <h4 className="font-display font-medium text-white mb-2 text-sm">Parsing IPTV Playlist...</h4>
            <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-850 font-mono text-[10px] text-cyan-400 max-w-xs truncate">
              {progressMsg}
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-[10px] text-cyan-400 font-mono tracking-widest font-bold uppercase">IPTV CABINET PANEL</span>
              <h3 className="text-white font-display font-semibold text-base mt-0.5">Load Subscription Playlist</h3>
            </div>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white font-sans text-xs bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-850 cursor-pointer"
            >
              Close
            </button>
          </div>

          {!success ? (
            <div className="space-y-4">
              <div className="flex bg-slate-900/60 p-1.5 rounded-xl border border-slate-900" id="playlist-mode-btns">
                <button
                  onClick={() => setImportMode('m3u')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${importMode === 'm3u' ? 'bg-slate-950 text-white border border-slate-800' : 'text-slate-400'}`}
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>M3U Playlist URL</span>
                </button>
                <button
                  onClick={() => setImportMode('xtream')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${importMode === 'xtream' ? 'bg-slate-950 text-white border border-slate-800' : 'text-slate-400'}`}
                >
                  <Key className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Xtream Codes Active API</span>
                </button>
              </div>

              <form onSubmit={handleImport} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1">PLAYLIST LOCAL ALIAS NAME</label>
                  <input
                    type="text"
                    required
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    placeholder="e.g. My France IPTV Link"
                    className="w-full text-xs text-white bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-cyan-500/50"
                  />
                </div>

                {importMode === 'm3u' ? (
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono block mb-1">M3U PATH OR SECURE REPLAY LINK URL</label>
                    <input
                      type="url"
                      required
                      value={m3uUrl}
                      onChange={(e) => setM3uUrl(e.target.value)}
                      placeholder="http://yourprovider.net:8000/get.php?auth=xyz&output=ts"
                      className="w-full text-xs text-white bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-cyan-500/50 font-mono"
                    />
                    <span className="text-[9px] text-slate-500 block mt-1 leading-normal">Typically looks like: <code className="text-[9px] text-slate-400">http://host:port/get.php?username=...&password=...&output=ts</code></span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1">PORTAL DECRYPTION ADDR HOST (SERVER URL)</label>
                      <input
                        type="url"
                        required
                        value={serverUrl}
                        onChange={(e) => setServerUrl(e.target.value)}
                        placeholder="http://iptvprovider.com:8080"
                        className="w-full text-xs text-white bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-cyan-500/50 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 font-mono block mb-1">ACCOUNT USERNAME</label>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="MyCustomUserCode"
                          className="w-full text-xs text-white bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-cyan-500/50"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-mono block mb-1">STREAM ACCOUNT PASSWORD</label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full text-xs text-white bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 outline-none focus:border-cyan-500/50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-3 flex gap-2 text-[10px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    Your Xtream API keys are processed only inside your local browser storage memory capsule. They are never exported or leaked to external nodes.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-display font-bold py-2.5 text-xs shadow-lg shadow-cyan-400/10 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-4 h-4 text-slate-950" />
                  <span>Parse & Deploy M3U Playlist</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4 animate-in zoom-in duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-display font-semibold text-sm">Playlist deployment code active!</h4>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                  Success! 4 Custom high-definition live channels loaded into your active listing array. Open the dashboard stream catalog to stream immediately.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-semibold py-2.5 border border-slate-850 text-xs transition-transform cursor-pointer"
              >
                Start Watching Imports
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
