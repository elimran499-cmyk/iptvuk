import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, Maximize, RotateCcw, Sliders, Shield, AlertCircle, Heart } from 'lucide-react';
import { MediaItem } from '../types';

interface VideoPlayerProps {
  media: MediaItem;
  onClose: () => void;
}

export default function VideoPlayer({ media, onClose }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [quality, setQuality] = useState<'4K' | '1080p' | '720p'>('4K');
  const [audioTrack, setAudioTrack] = useState<'Dolby 5.1' | 'Stereo 2.0'>('Dolby 5.1');
  const [subtitles, setSubtitles] = useState<'English' | 'French' | 'Off'>('English');
  const [currentTime, setCurrentTime] = useState(1280); // seconds
  const [bufferProgress, setBufferProgress] = useState(100);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [antiBufferActive, setAntiBufferActive] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Video element ref (simulated with interactive mock loops, we'll use active video tagging or beautiful visual mock animations)
  const videoRef = useRef<HTMLVideoElement>(null);

  // Convert seconds to human time
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${hours > 0 ? hours + ':' : ''}${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const totalTimeSeconds = media.type === 'live' ? 0 : 5400 + Math.random() * 3200; // random length

  // Simulate video playback state
  useEffect(() => {
    let interval: any;
    if (isPlaying && !isBuffering && media.type !== 'live') {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalTimeSeconds) {
            setIsPlaying(false);
            return totalTimeSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isBuffering, totalTimeSeconds, media.type]);

  // Simulate periodic short buffering triggers according to actual IPTV streams and Anti-buffer tech
  const triggerQualityChange = (newQual: '4K' | '1080p' | '720p') => {
    setQuality(newQual);
    setIsBuffering(true);
    setBufferProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 30) + 15;
      if (progress >= 100) {
        setBufferProgress(100);
        setIsBuffering(false);
        clearInterval(interval);
      } else {
        setBufferProgress(progress);
      }
    }, 120);
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-900 shadow-2xl relative" id="iptv-player-container">
      {/* HEADER INFO */}
      <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold">
            {media.type === 'live' ? 'LIVE STREAM' : 'VOD PLATFORM'}
          </div>
          <div>
            <h3 className="text-white font-display font-semibold text-sm leading-tight">{media.title}</h3>
            <p className="text-[10px] text-slate-300 font-sans mt-0.5">{media.genre.join(', ')} • {media.year}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* ANTI BUFFER SHIELD INDICATOR */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-[10px] font-mono font-medium">
            <Shield className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Anti-Buffer Tech Pro Active</span>
          </div>

          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-rose-500 cursor-pointer border border-slate-800 transition-all"
            title="Bookmark stream"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer border border-slate-800 transition-all font-sans text-xs"
          >
            Close Stream
          </button>
        </div>
      </div>

      {/* THE VIEW GAMEBOX CANVAS (SIMULATED STREAM) */}
      <div className="aspect-video w-full bg-slate-900/80 flex items-center justify-center relative overflow-hidden">
        {/* Background Atmosphere Image */}
        <img
          src={media.backdropUrl}
          alt={media.title}
          className={`w-full h-full object-cover select-none absolute inset-0 opacity-40 transition-transform duration-1000 ${isPlaying && !isBuffering ? 'scale-102 blur-[2px]' : 'scale-100 blur-[8px]'}`}
          referrerPolicy="no-referrer"
        />

        {/* Video Overlay Glow */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-950/80" />

        {/* Live Active Stream Buffering Panel */}
        {isBuffering ? (
          <div className="absolute inset-0 bg-slate-950/90 z-10 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* Outer Spinner */}
              <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-cyan-400 animate-spin" />
              <span className="text-xs font-mono font-bold text-cyan-400">{bufferProgress}%</span>
            </div>
            <h4 className="text-white font-display font-medium text-sm mt-4">Connecting to Secured Streaming Node...</h4>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-1.5 max-w-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>[Anti-Buffer Pro v2] decrypting live h.265 transport packets...</span>
            </div>
          </div>
        ) : null}

        {/* MOCK PLAYER MOVIE ACCENTS */}
        {!isPlaying && !isBuffering && (
          <div className="absolute inset-0 z-10 bg-slate-950/50 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(true)}
              className="w-16 h-16 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:scale-105 cursor-pointer transition-all"
            >
              <Play className="w-8 h-8 fill-slate-950 ml-1" />
            </button>
          </div>
        )}

        {/* Dynamic Static EPG HUD bar for LIVE format */}
        {media.type === 'live' && isPlaying && !isBuffering && (
          <div className="absolute bottom-16 left-4 z-20 glass p-3.5 rounded-xl border border-slate-800/80 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase font-bold">Now Broadcasting Live</p>
            <h5 className="text-xs font-semibold text-white mt-1 leading-normal">{media.title}</h5>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans mt-2 pt-2 border-t border-slate-900">
              <span className="font-mono">Quality: <span className="text-white font-bold">{quality} HDR</span></span>
              <span>Delay: ~0.4s</span>
            </div>
          </div>
        )}

        {/* EPG program list for films */}
        {media.type !== 'live' && isPlaying && !isBuffering && (
          <div className="absolute bottom-16 right-4 z-20 glass-pill px-3 py-1.5 rounded-lg text-[10px] text-slate-300 font-mono flex items-center gap-1.5 border border-white/5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Decoded via H.265 HW-Acceleration</span>
          </div>
        )}

        {/* Settings modal drawer */}
        {showSettings && (
          <div className="absolute bottom-16 right-4 z-30 w-64 rounded-xl bg-slate-950/95 border border-slate-850 p-4 shadow-2xl space-y-3 font-sans animate-in fade-in slide-in-from-bottom-2 max-w-sm">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-cyan-400" /> Decode Settings</h5>
              <button onClick={() => setShowSettings(false)} className="text-[10px] text-slate-400 hover:text-white">Close</button>
            </div>
            
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">STREAMS DECRYPT QUALITY</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['4K', '1080p', '720p'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => { triggerQualityChange(q); setShowSettings(false); }}
                      className={`py-1 rounded text-center text-[10px] uppercase font-mono font-bold font-display ${quality === q ? 'bg-cyan-500 text-slate-950 font-semibold' : 'bg-slate-900 text-slate-300 hover:bg-slate-850'}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">AUDIO TRACK</label>
                <div className="grid grid-cols-2 gap-1">
                  {(['Dolby 5.1', 'Stereo 2.0'] as const).map((track) => (
                    <button
                      key={track}
                      onClick={() => setAudioTrack(track)}
                      className={`py-1 rounded text-center text-[10px] font-mono ${audioTrack === track ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 hover:bg-slate-850'}`}
                    >
                      {track}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">SUBTITLES TRACK</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['English', 'French', 'Off'] as const).map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSubtitles(sub)}
                      className={`py-1 rounded text-center text-[10px] ${subtitles === sub ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 hover:bg-slate-850'}`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1.5 flex items-center justify-between border-t border-slate-900 text-[10px] text-slate-500">
                <span>Buffering shield state:</span>
                <button 
                  onClick={() => setAntiBufferActive(!antiBufferActive)}
                  className={`px-2 py-0.5 rounded font-bold text-[9px] ${antiBufferActive ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}
                >
                  {antiBufferActive ? 'HEURISTIC ON' : 'DISABLED'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER CONTROLS ROW */}
      <div className="bg-slate-950/95 border-t border-slate-900 p-3.5 flex flex-col gap-3">
        {/* PROGRESS BAR TIMELINE (Only if movie/series) */}
        {media.type !== 'live' ? (
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-400">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1.5 bg-slate-900 rounded-full relative cursor-pointer group">
              {/* Buffering zone placeholder */}
              <div className="absolute top-0 bottom-0 left-[20%] right-[30%] bg-slate-800 rounded-full" />
              {/* Play progress */}
              <div 
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full group-hover:from-cyan-400 group-hover:to-indigo-400 transition-colors"
                style={{ width: `${(currentTime / totalTimeSeconds) * 100}%` }}
              />
              <div 
                className="absolute w-3 h-3 rounded-full bg-white border border-cyan-500 -top-0.5 shadow group-hover:scale-125 transition-transform"
                style={{ left: `calc(${(currentTime / totalTimeSeconds) * 100}% - 6px)` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400">{formatTime(totalTimeSeconds)}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs font-mono px-1">
            <div className="flex items-center gap-2">
              <span className="block w-2.5 h-2.5 rounded-full bg-rose-500 pulse-led" />
              <span className="text-rose-400 font-bold tracking-wider">LIVE</span>
            </div>
            <span className="text-slate-500">Live feed time check: {new Date().toLocaleTimeString()}</span>
          </div>
        )}

        {/* BOTTOM BUTTON BAR */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            {isPlaying ? (
              <button 
                onClick={() => setIsPlaying(false)}
                className="p-2 h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-white cursor-pointer transition-all flex items-center justify-center"
                title="Pause Stream"
              >
                <Pause className="w-4 h-4 fill-white" />
              </button>
            ) : (
              <button 
                onClick={() => setIsPlaying(true)}
                className="p-2 h-9 w-9 rounded-xl bg-cyan-500 hover:bg-cyan-400 border border-cyan-600 text-slate-950 cursor-pointer transition-all flex items-center justify-center animate-pulse"
                title="Resume Play"
              >
                <Play className="w-4 h-4 fill-slate-950" />
              </button>
            )}

            {/* Restart Stream if VOD */}
            {media.type !== 'live' && (
              <button 
                onClick={() => setCurrentTime(0)}
                className="p-2 h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors flex items-center justify-center"
                title="Restart stream"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Volume Control widget */}
            <div className="h-4 w-px bg-slate-900 mx-1" />

            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors flex items-center justify-center"
              title="Mute Volume"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="hidden sm:block w-20 h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* RIGHT SIDE STREAM METADATA CONTROLS */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex flex-col items-end text-right font-mono text-[9px] text-slate-500 pr-2">
              <div>AURA IPTV NODE SECURED DECRYPT: PRO_OK</div>
              <div>CONNECTION HOST: LOCALHOST_3000</div>
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`px-3 py-1.5 h-9 rounded-xl border flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${showSettings ? 'bg-cyan-950 text-cyan-400 border-cyan-800' : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'}`}
              title="Decoder settings"
              id="player-settings-btn"
            >
              <Settings className="w-4 h-4 animate-spin-slow" />
              <span>Decoders</span>
            </button>

            <button 
              onClick={() => triggerQualityChange(quality)}
              className="px-3 py-1.5 h-9 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors font-mono text-[10px] font-bold"
              title="Toggle HD quality codec"
            >
              <span>{quality}</span>
            </button>

            <button 
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.requestFullscreen().catch(() => {
                    alert("Mock full-screen expanded. In AI Studio, please view in a new window tab for optimal native sizing properties!");
                  });
                } else {
                  alert("Live stream active. To view native 8K formats, please load these in a full desktop applet!");
                }
              }}
              className="p-2 h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors flex items-center justify-center"
              title="Full screen format"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
