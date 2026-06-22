import { useState } from 'react';
import { Search } from 'lucide-react';

interface HeaderProps {
  activeTab: 'catalog' | 'dashboard' | 'pricing' | 'guide';
  setActiveTab: (tab: 'catalog' | 'dashboard' | 'pricing' | 'guide') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAddPlaylist: () => void;
  subscriptionCount: number;
}

export default function Header({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenAddPlaylist,
  subscriptionCount
}: HeaderProps) {
  return (
    <>
      {/* TOP BANNER */}
      <div className="bg-yellow-400 py-2.5 px-4 flex items-center justify-center gap-3 flex-wrap text-center select-none">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[10px] font-mono font-black text-yellow-900 tracking-widest uppercase">IPTV UK VIP</span>
        </span>
        <span className="text-[11px] font-sans text-yellow-950">
          <strong>85,000+ Live Channels • 200,000+ VOD</strong> — Stream in 4K Ultra HD on any device, anywhere.
        </span>
        <span className="hidden sm:block text-yellow-600 text-xs">|</span>
        <span className="text-[10px] font-mono text-yellow-900 font-black tracking-wide">12 + 3 MONTHS FREE</span>
        <a
          href="https://wa.me/447449708976"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-yellow-950 hover:bg-yellow-900 text-yellow-300 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md hover:scale-105 transition-transform cursor-pointer inline-block"
        >
          Order Now →
        </a>
      </div>

      <header className="sticky top-0 z-40 bg-[#0d0014]/90 backdrop-blur-md border-b border-purple-900/30 px-4 py-3 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* LOGO */}
          <div
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-2.5 cursor-pointer group"
            id="hdr-logo"
          >
            <div className="relative group-hover:scale-105 transition-transform">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logo-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#7C3AED"/>
                    <stop offset="100%" stopColor="#EAB308"/>
                  </linearGradient>
                </defs>
                {/* Circle background */}
                <circle cx="20" cy="20" r="20" fill="url(#logo-bg)"/>
                {/* Outer ring */}
                <circle cx="20" cy="20" r="17" fill="none" stroke="white" strokeWidth="0.8" strokeOpacity="0.2"/>
                {/* Diagonal slash accent */}
                <line x1="28" y1="6" x2="12" y2="34" stroke="white" strokeWidth="1" strokeOpacity="0.12"/>
                {/* Bold play triangle */}
                <path d="M15 12L15 28L30 20Z" fill="white"/>
                {/* Notch cut into triangle for style */}
                <path d="M15 20L22 16L22 24Z" fill="url(#logo-bg)" fillOpacity="0.6"/>
              </svg>
            </div>
            <div>
              <h1 className="font-display font-black text-base tracking-tight text-white flex items-center leading-none gap-0.5">
                IPTV<span className="text-primary font-mono font-bold tracking-widest text-sm pl-1">UK</span>
              </h1>
            </div>
          </div>

        {/* SEARCH BAR (Only visible on Catalog mode) */}
        <div className="hidden md:flex relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search channels, films, series..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeTab !== 'catalog') setActiveTab('catalog');
            }}
            className="w-full text-slate-200 placeholder-slate-500 bg-slate-900/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl py-2 pl-10 pr-4 text-xs font-sans outline-none focus:ring-2 focus:ring-cyan-500/10 transition-all"
            id="hdr-search-input"
          />
        </div>

        {/* NAVIGATION MENUS */}
        <nav className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'catalog' 
                ? 'bg-slate-900 text-white border border-slate-800/80 shadow-inner' 
                : 'text-slate-400 hover:text-white'
            }`}
            id="nav-catalog"
          >
            Browse Shows
          </button>
          
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'pricing' 
                ? 'bg-slate-900 text-white border border-slate-800/80 shadow-inner' 
                : 'text-slate-400 hover:text-white'
            }`}
            id="nav-plans"
          >
            Pricing & Plans
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'guide' 
                ? 'bg-slate-900 text-white border border-slate-800/80 shadow-inner' 
                : 'text-slate-400 hover:text-white'
            }`}
            id="nav-setup"
          >
            Setup Guide
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1.5 hidden sm:block" />

        </nav>
      </div>
    </header>
    </>
  );
}
