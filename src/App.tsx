import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import VideoPlayer from './components/VideoPlayer';
import PaymentWizard from './components/PaymentWizard';
import PlaylistPortal from './components/PlaylistPortal';
import DeviceGuides from './components/DeviceGuides';
import { IPTV_PLANS, MEDIA_ITEMS, MOCK_IPTV_CHANNELS, MOCK_GENRES } from './data';
import { MediaItem, Plan, Subscription, PlaylistChannel, PaymentMethod } from './types';
import { 
  Play, 
  Tv, 
  HelpCircle, 
  Plus, 
  ShieldCheck, 
  Copy, 
  ExternalLink, 
  SlidersHorizontal,
  Flame, 
  Sparkles, 
  Wifi, 
  Check, 
  Bookmark, 
  Heart,
  Grid2X2,
  Trash2,
  Cpu,
  MonitorCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function App() {
  // Navigation & Searches
  const [activeTab, setActiveTab] = useState<'catalog' | 'dashboard' | 'pricing' | 'guide'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('All');
  
  // Streaming Player State
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  // Configurator pricing states
  const [pricingTier, setPricingTier] = useState<'standard' | 'vip'>('vip');
  const [selectedScreens, setSelectedScreens] = useState<number>(1);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, dir: 'left' | 'right') => {
    if (ref.current) ref.current.scrollBy({ left: dir === 'right' ? 340 : -340, behavior: 'smooth' });
  };

  // Dynamic promo countdown timer for pricing (e.g. 14:21:20 matching the screenshot context)
  const [promoTime, setPromoTime] = useState(51680); // ~14h 21m 20s
  useEffect(() => {
    const timer = setInterval(() => {
      setPromoTime((prev) => (prev > 0 ? prev - 1 : 51680));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatPromoTime = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Lists & Persistence (via localStorage)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [channels, setChannels] = useState<PlaylistChannel[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedSubscriptionId, setCopiedSubscriptionId] = useState<string | null>(null);

  // Modals
  const [showPlaylistPortal, setShowPlaylistPortal] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);

  // Load initial simulated subscriptions and channels from localStorage
  useEffect(() => {
    const savedSubs = localStorage.getItem('aura_iptv_subs');
    const savedChannels = localStorage.getItem('aura_iptv_channels');
    const savedFavs = localStorage.getItem('aura_iptv_favs');

    if (savedSubs) {
      setSubscriptions(JSON.parse(savedSubs));
    } else {
      // Create initial starter active subscription
      const starterSub: Subscription = {
        id: 'sub-init-948',
        planId: 'starter',
        planName: 'Starter Demo Package',
        price: 29.99,
        periodMonths: 3,
        status: 'active',
        startDate: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().split('T')[0], // 30 days ago
        nextBillingDate: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split('T')[0], // 60 days left
        paymentMethod: 'card',
        transactionId: 'TX-SECURE-938210-AURA',
        devicesConnected: 2,
        maxDevices: 2
      };
      setSubscriptions([starterSub]);
      localStorage.setItem('aura_iptv_subs', JSON.stringify([starterSub]));
    }

    if (savedChannels) {
      setChannels(JSON.parse(savedChannels));
    } else {
      const formatted: PlaylistChannel[] = MOCK_IPTV_CHANNELS.map(ch => ({
        id: ch.id,
        name: ch.name,
        logo: ch.logo,
        category: ch.category,
        streamUrl: ch.streamUrl,
        quality: ch.quality as '4K' | '1080p' | '720p',
        online: ch.online
      }));
      setChannels(formatted);
      localStorage.setItem('aura_iptv_channels', JSON.stringify(formatted));
    }

    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  // Sync favorites helper
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(fId => fId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('aura_iptv_favs', JSON.stringify(updated));
  };

  // Import playlist callback handler
  const handleImportPlaylistChannels = (newChannels: any[]) => {
    const formatted: PlaylistChannel[] = newChannels.map(ch => ({
      id: ch.id,
      name: ch.name,
      logo: ch.logo,
      category: ch.category,
      streamUrl: ch.streamUrl,
      quality: ch.quality,
      online: ch.online
    }));

    const merged = [...formatted, ...channels];
    setChannels(merged);
    localStorage.setItem('aura_iptv_channels', JSON.stringify(merged));
  };

  // Payment wizard success callback handler
  const handlePaymentSuccess = (method: PaymentMethod, durationMonths: number, finalPrice: number) => {
    const newSub: Subscription = {
      id: `sub-active-${Math.floor(1000 + Math.random() * 9000)}`,
      planId: checkoutPlan?.id || 'premium',
      planName: checkoutPlan?.name || 'Premium Stream Deal',
      price: finalPrice,
      periodMonths: durationMonths,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      nextBillingDate: new Date(Date.now() + durationMonths * 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      paymentMethod: method,
      transactionId: `TX-AURA-${Math.floor(100000 + Math.random() * 900000)}`,
      devicesConnected: 0,
      maxDevices: checkoutPlan?.id === 'pack2' ? 4 : 2
    };

    const updatedSubs = [newSub, ...subscriptions];
    setSubscriptions(updatedSubs);
    localStorage.setItem('aura_iptv_subs', JSON.stringify(updatedSubs));
    
    // Automatically switch to dashboard tab
    setActiveTab('dashboard');
  };

  // Delete subscription handler
  const handleDeleteSub = (id: string) => {
    if (confirm('Are you sure you want to terminate this subscription line code? Access to live streams will stop immediately.')) {
      const filtered = subscriptions.filter(s => s.id !== id);
      setSubscriptions(filtered);
      localStorage.setItem('aura_iptv_subs', JSON.stringify(filtered));
    }
  };

  // All channels available on the site
  const SITE_CHANNELS = [
    { name: 'BBC One UK HD', category: 'UK TV', badge: 'HD', logo: 'https://www.google.com/s2/favicons?domain=bbc.co.uk&sz=128' },
    { name: 'BBC Two UK', category: 'UK TV', badge: 'HD', logo: 'https://www.google.com/s2/favicons?domain=bbc.co.uk&sz=128' },
    { name: 'ITV1 HD', category: 'UK TV', badge: 'HD', logo: 'https://images.seeklogo.com/logo-png/45/2/itv1-logo-png_seeklogo-458202.png' },
    { name: 'Channel 4 HD', category: 'UK TV', badge: 'HD', logo: 'https://i0.wp.com/www.seenit.co.uk/wp-content/uploads/Channel_4_Logo_Green-2.jpg?resize=1200%2C675&ssl=1' },
    { name: 'Sky Sports Main Event', category: 'Sports', badge: '4K', logo: 'https://www.google.com/s2/favicons?domain=sky.com&sz=128' },
    { name: 'Sky Sports Premier League', category: 'Sports', badge: '4K', logo: 'https://www.google.com/s2/favicons?domain=sky.com&sz=128' },
    { name: 'TNT Sports', category: 'Sports', badge: 'HD', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe40vtE2AHgtyk-uz8ncZFa8yxYrf6Z5d91ggvDrF9Mw&s=10' },
    { name: 'beIN Sports', category: 'Sports', badge: 'HD', logo: 'https://sensefrance.fr/wp-content/uploads/logo-bein-sport-et-free-cote-a-cote.webp' },
    { name: 'Eurosport 1', category: 'Sports', badge: 'HD', logo: 'https://www.google.com/s2/favicons?domain=eurosport.com&sz=128' },
    { name: 'Sportitalia HD', category: 'Sports', badge: 'HD', logo: 'https://play-lh.googleusercontent.com/zFPHigI8l5v42ToIW88GatyY49SC4ohu_8lJcIFIz2GGqevVeSsNS41K_EARp1oJcYOwrSgQmiFq0JrhbbmqFw' },
    { name: 'ESPN US Sports', category: 'Sports', badge: 'HD', logo: 'https://www.google.com/s2/favicons?domain=espn.com&sz=128' },
    { name: 'DAZN Sports', category: 'Sports', badge: 'HD', logo: 'https://www.google.com/s2/favicons?domain=dazn.com&sz=128' },
    { name: 'Fox News', category: 'News', badge: 'HD', logo: 'https://www.tvbeurope.com/wp-content/uploads/2019/01/fox-news-logo.jpg' },
    { name: 'CNN International', category: 'News', badge: 'HD', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/66/CNN_International_logo.svg' },
    { name: 'NBC News', category: 'News', badge: 'HD', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYRXwKJX9xo3ADjLUwebHaoliiQ_NkozQ_psr9ogxSm1HKXq4bxIj6G1g&s=10' },
    { name: 'Netflix Premium', category: 'VIP Streaming', badge: 'VIP', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrejjNX8_J7UvEbpAJd5ibayukDSuyGmDk-pMYrYkaew&s=10' },
    { name: 'Disney+ Cinema', category: 'VIP Streaming', badge: 'VIP', logo: 'https://yt3.googleusercontent.com/HBNZiS5QKb-Mc5_n7Q8_wOH-t3VI_jPPcO8uwE0dMgAjff7Pf0VZ4h_EBugzRCt059QJnIPDpg=s900-c-k-c0x00ffffff-no-rj' },
    { name: 'Apple TV+', category: 'VIP Streaming', badge: 'VIP', logo: 'https://www.google.com/s2/favicons?domain=tv.apple.com&sz=128' },
    { name: 'Prime Video 4K', category: 'VIP Streaming', badge: 'VIP', logo: 'https://m.media-amazon.com/images/I/61sDr8btlTL.png' },
    { name: 'HBO Max Gold', category: 'VIP Streaming', badge: 'VIP', logo: 'https://i.pinimg.com/564x/27/7f/21/277f21068549680e0daaddab0dcf975f.jpg' },
    { name: 'Paramount+', category: 'VIP Streaming', badge: 'VIP', logo: 'https://store-images.s-microsoft.com/image/apps.35768.9007199266243596.ad78eadf-f174-4f68-8c73-562e5c227afa.9171eaf0-5404-436f-803e-5f420e055b0e' },
    { name: 'Showtime PPV', category: 'PPV', badge: 'PPV', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Showtime.svg/250px-Showtime.svg.png' },
    { name: 'TNT Sports PPV', category: 'PPV', badge: 'PPV', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe40vtE2AHgtyk-uz8ncZFa8yxYrf6Z5d91ggvDrF9Mw&s=10' },
    { name: 'UFC Fight Pass', category: 'PPV', badge: 'PPV', logo: 'https://i.pinimg.com/564x/d0/c4/7d/d0c47da28d97db1358dc84bb098d67ca.jpg' },
    { name: 'Sky Sport Box Office', category: 'PPV', badge: 'PPV', logo: 'https://www.google.com/s2/favicons?domain=sky.com&sz=128' },
    { name: 'Mediaset Infinity', category: 'Entertainment', badge: 'HD', logo: 'https://play-lh.googleusercontent.com/nuvCOFbJklXgPHAoDqPD5PKoUBm1b07mj-l8IcNMIx3yBSuEXZqRK37pHvxiGwrN5A' },
    { name: 'NOW Sport', category: 'Sports', badge: 'HD', logo: 'https://www.google.com/s2/favicons?domain=nowtv.com&sz=128' },
    { name: 'Discovery Channel', category: 'Entertainment', badge: '4K', logo: 'https://www.google.com/s2/favicons?domain=discovery.com&sz=128' },
  ];

  const SITE_FILMS = [
    { title: 'Black Mirror', year: 2025, duration: 'Season 7', genre: 'Sci-Fi', image: 'https://media.themoviedb.org/t/p/w300_and_h450_face/seN6rRfN0I6n8iDXjlSMk1QjNcq.jpg' },
    { title: 'Pressure', year: 2025, duration: '1h 52m', genre: 'Thriller', image: 'https://images.contentstack.io/v3/assets/blt223a4a92692ca457/blt894aaac05ce45f74/69d6e086e583e66086f06ba4/T4108_Pressure_Digital_1sht_1080x1600.jpg?branch=production&width=1080' },
    { title: 'The Odyssey', year: 2025, duration: '2h 46m', genre: 'Adventure', image: 'https://m.media-amazon.com/images/M/MV5BOGZkZGQ3MDgtNjJkYy00ZDFlLThmN2ItYWEzNGE2MTdmYmE4XkEyXkFqcGc@._V1_.jpg' },
    { title: 'The Amazing Digital Circus', year: 2024, duration: '1h 30m', genre: 'Animation', image: 'https://m.media-amazon.com/images/M/MV5BMTlkY2NjODgtOWI5ZC00MjIzLWFiYjItN2ZiOTU5YzA2ODlmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' },
    { title: 'Your Fault: London', year: 2025, duration: '2h 05m', genre: 'Romance', image: 'https://m.media-amazon.com/images/M/MV5BNzI2YmMxZWItNjlhOS00ODNmLWEzYjQtYWIyNjc0ZTQwOTZlXkEyXkFqcGc@._V1_.jpg' },
    { title: 'How to Make a Killing', year: 2025, duration: '1h 45m', genre: 'Crime', image: 'https://m.media-amazon.com/images/M/MV5BOTkwY2JjMWYtOGU4YS00ZTg0LWIzYzUtZDkxNDE5NWNkNWM1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' },
    { title: 'In the Grey', year: 2026, duration: '2h 08m', genre: 'Action', image: 'https://media.themoviedb.org/t/p/w300_and_h450_face/dQgIcW6Th08kMRf2HBoYWoFE6OD.jpg' },
    { title: 'Legends', year: 2026, duration: '6 Episodes', genre: 'Crime', image: 'https://upload.wikimedia.org/wikipedia/en/6/66/Legends_2026_TV_series_poster.jpeg' },
    { title: 'The Last House', year: 2026, duration: '1h 50m', genre: 'Sci-Fi', image: 'https://upload.wikimedia.org/wikipedia/en/b/b2/The_Last_House_poster.jpg' },
    { title: "Clarkson's Farm", year: 2025, duration: 'Season 4', genre: 'Documentary', image: "https://upload.wikimedia.org/wikipedia/en/a/a0/Clarkson%27s_Farm_Title_Card.jpg" },
    { title: 'Tip Toe', year: 2026, duration: 'Mini-Series', genre: 'Thriller', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=600' },
    { title: 'Shelter', year: 2026, duration: '1h 47m', genre: 'Action', image: 'https://media.themoviedb.org/t/p/w300_and_h450_face/buPFnHZ3xQy6vZEHxbHgL1Pc6CR.jpg' },
    { title: 'The Witness', year: 2026, duration: 'Mini-Series', genre: 'Crime', image: 'https://media.themoviedb.org/t/p/w300_and_h450_face/6vW1V7qejXv4QI2TvWvYuowfTrU.jpg' },
    { title: 'Half Man', year: 2026, duration: '6 Episodes', genre: 'Drama', image: 'https://upload.wikimedia.org/wikipedia/en/9/93/Half_Man_Release_Poster.jpg' },
  ];

  // Filter media based on search query or selected genre
  const filteredMedia = MEDIA_ITEMS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || item.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const isSearchActive = searchFocused || searchQuery.length > 0;

  const filteredChannels = isSearchActive
    ? (searchQuery.length > 0
        ? SITE_CHANNELS.filter(ch =>
            ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ch.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : SITE_CHANNELS)
    : [];

  const filteredFilms = isSearchActive
    ? (searchQuery.length > 0
        ? SITE_FILMS.filter(f =>
            f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.genre.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : SITE_FILMS)
    : [];

  const featuredMedia = MEDIA_ITEMS.find(item => item.isFeatured) || MEDIA_ITEMS[0];

  // Copy streaming credentials helper
  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSubscriptionId(id);
    setTimeout(() => setCopiedSubscriptionId(null), 2500);
  };

  return (
    <div className="min-h-screen text-slate-200 flex flex-col font-sans selection:bg-primary selection:text-slate-950" style={{background: 'linear-gradient(135deg, #1a0533 0%, #0d0014 45%, #000000 100%)', backgroundAttachment: 'fixed'}}>
      
      {/* HEADER SECTION */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchFocus={() => setSearchFocused(true)}
        onSearchBlur={() => setSearchFocused(false)}
        onOpenAddPlaylist={() => setShowPlaylistPortal(true)}
        subscriptionCount={subscriptions.length}
      />

      <main className="flex-1 py-6 px-4 lg:px-8 max-w-7xl w-full mx-auto space-y-8">

        {/* 1. TOP LIVE PLAYER SHELF (If active media selected) */}
        {activeMedia && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <VideoPlayer 
              media={activeMedia} 
              onClose={() => setActiveMedia(null)} 
            />
          </div>
        )}

        {/* 2. CATALOG BROWSER VIEW (PREMIUM MULTI-SECTION LANDING PAGE) */}
        {activeTab === 'catalog' && (
          <div className="space-y-16">
            
            {/* If there's NO active search, show premium landing sections */}
            {!isSearchActive && selectedGenre === 'All' ? (
              <>
                {/* A. REBRANDED PREMIUM HERO SECTION (Screenshot 22.50.38) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4" id="premium-hero-hub">
                  
                  {/* Left Hero Copy Columns */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 bg-[#2A2325] border border-slate-800 rounded-full px-3 py-1.5" id="hero-badge-alert">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                      <span className="text-[10px] font-mono tracking-wider text-slate-300 font-bold uppercase">
                        LIVE NOW — PREMIER LEAGUE • NFL • UFC • F1
                      </span>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-4xl sm:text-5xl lg:text-6.5xl font-display font-black tracking-tight text-white leading-none uppercase">
                        THE WORLD'S <br />
                        <span className="text-primary italic tracking-tight font-extrabold pr-2 block sm:inline">IPTV UK.</span>
                      </h2>
                      <p className="text-sm font-sans tracking-wide text-[#C4B5FD] max-w-2xl leading-relaxed">
                        85,000+ live channels • 200,000+ Movies & Series • All in stunning <span className="text-primary font-bold">4K Ultra HD</span> — on any device, anywhere in the world.
                      </p>
                    </div>

                    {/* Country Badges */}
                    <div className="flex flex-wrap gap-2 pt-2" id="country-pills-row">
                      {['Italy', 'Germany', 'France', 'Spain', 'UK', 'Worldwide'].map((name, idx) => (
                        <span key={idx} className="inline-flex items-center text-xs text-slate-300 bg-[#2A2325] border border-slate-800/80 rounded-full px-3 py-1.5 shadow-sm hover:border-[#C4B5FD]/30 transition-colors">
                          <span className="font-medium font-sans">{name}</span>
                        </span>
                      ))}
                    </div>

                    {/* Dual-CTA Buttons Row */}
                    <div className="flex flex-wrap items-center gap-4 pt-3" id="hero-ctas">
                      <button
                        onClick={() => setActiveTab('pricing')}
                        className="px-8 py-4 bg-primary hover:bg-[#EAB308] text-[#1E1820] font-display font-extrabold text-sm tracking-wide rounded-2xl shadow-lg shadow-primary/10 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                      >
                        <span>View Plans</span>
                        <span>→</span>
                      </button>

                    </div>

                    {/* Bottom Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#2A2325]" id="micro-achievement-stats">
                      <div>
                        <h4 className="text-white font-display font-extrabold text-base">85K+</h4>
                        <p className="text-[10px] uppercase tracking-wider font-mono text-[#C4B5FD]">Live Channels</p>
                      </div>
                      <div>
                        <h4 className="text-white font-display font-extrabold text-base">200K+</h4>
                        <p className="text-[10px] uppercase tracking-wider font-mono text-[#C4B5FD]">VOD Titles</p>
                      </div>
                      <div>
                        <h4 className="text-emerald-400 font-display font-extrabold text-base">99.9%</h4>
                        <p className="text-[10px] uppercase tracking-wider font-mono text-[#C4B5FD]">Stream Uptime</p>
                      </div>
                      <div>
                        <h4 className="text-[#EAB308] font-display font-extrabold text-base">24/7</h4>
                        <p className="text-[10px] uppercase tracking-wider font-display text-[#C4B5FD]">Human Support</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Global Entertainment premium feature badge card */}
                  <div className="lg:col-span-5" id="global-entertainment-column">
                    <div className="bg-[#2A2325]/95 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[8px] font-display tracking-widest text-[#EAB308] uppercase block font-semibold">IPTV UK — PREMIUM</span>
                          <h3 className="text-white font-display font-bold text-lg">Global Entertainment</h3>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#2A2325] border border-slate-800 flex items-center justify-center text-primary shadow">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </div>

                      {/* 2x2 grid of specific stats badges */}
                      <div className="grid grid-cols-2 gap-3" id="global-feature-quad">
                        <div className="bg-[#1E1820] border border-slate-800/60 rounded-xl p-3.5 flex flex-col justify-between aspect-video md:aspect-auto">
                          <Tv className="w-5 h-5 text-primary" />
                          <div>
                            <h4 className="text-white font-display font-bold text-sm mt-1.5">85,000+</h4>
                            <p className="text-[9px] text-[#C4B5FD] font-mono uppercase tracking-wide">Live Channels</p>
                          </div>
                        </div>

                        <div className="bg-[#1E1820] border border-slate-800/60 rounded-xl p-3.5 flex flex-col justify-between aspect-video md:aspect-auto">
                          <Play className="w-5 h-5 text-primary" />
                          <div>
                            <h4 className="text-white font-display font-bold text-sm mt-1.5">200,000+</h4>
                            <p className="text-[9px] text-[#C4B5FD] font-mono uppercase tracking-wide">Movies & Series</p>
                          </div>
                        </div>

                        <div className="bg-[#1E1820] border border-slate-800/60 rounded-xl p-3.5 flex flex-col justify-between aspect-video md:aspect-auto">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <div>
                            <h4 className="text-white font-display font-bold text-sm mt-1.5">4K Ultra HD</h4>
                            <p className="text-[9px] text-[#C4B5FD] font-mono uppercase tracking-wide">Picture Quality</p>
                          </div>
                        </div>

                        <div className="bg-[#1E1820] border border-slate-800/60 rounded-xl p-3.5 flex flex-col justify-between aspect-video md:aspect-auto">
                          <MonitorCheck className="w-5 h-5 text-primary" />
                          <div>
                            <h4 className="text-white font-display font-bold text-sm mt-1.5">4 Screens</h4>
                            <p className="text-[9px] text-[#C4B5FD] font-mono uppercase tracking-wide">Simultaneous</p>
                          </div>
                        </div>
                      </div>

                      {/* Capabilities indicators list */}
                      <div className="space-y-2 pt-2 border-t border-slate-800/60">
                        <div className="flex items-center gap-2.5 text-xs text-slate-300">
                          <Flame className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="font-sans">Premier League • Champions League • NFL • NBA</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-slate-300">
                          <Tv className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="font-sans">Works on Smart TV, Firestick, Apple TV, MAG</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-[#EAB308]">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="font-sans font-medium">Activated within 5–15 minutes after payment</span>
                        </div>
                      </div>

                      {/* Action CTA inside highlight card */}
                      <button
                        onClick={() => setActiveTab('pricing')}
                        className="w-full py-3 bg-primary hover:bg-[#EAB308] text-[#1E1820] font-display font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>GET STARTED — FROM €24.99</span>
                        <span>→</span>
                      </button>

                      <div className="text-center">
                        <span className="text-[9px] font-mono text-[#C4B5FD] tracking-widest uppercase block">
                          NO CONTRACT • CANCEL ANYTIME
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* B. SPORTS CATEGORY SHOWCASE (Screenshot 22.50.45) */}
                <div className="space-y-6 pt-4" id="sports-showcase-section">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-[#EAB308] font-bold uppercase block">FROM PREMIER LEAGUE TO NFL</span>
                    <h2 className="text-white font-display font-extrabold text-2xl md:text-3xl tracking-tight uppercase">
                      Every sport. Every league. Live in 4K.
                    </h2>
                  </div>

                  {/* Responsive Sports Grid Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4" id="sports-gorgeous-grid">
                    {[
                      {
                        name: 'Football',
                        leagues: 'Premier League, Champions League, La Liga, Serie A',
                        image: 'https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/5b78/live/c9362eb0-c31b-11f0-8036-1f33f0e1199f.jpg',
                        chan: 'ch-1'
                      },
                      {
                        name: 'American Football',
                        leagues: 'NFL, College Football, Super Bowl',
                        image: 'https://images.unsplash.com/photo-1675886051958-f425417f7480?fm=jpg&q=80&w=800&auto=format&fit=crop',
                        chan: 'ch-4'
                      },
                      {
                        name: 'Formula 1',
                        leagues: 'All Grand Prix Live, F2, MotoGP',
                        image: 'https://media.formula1.com/image/upload/c_fill,w_800,q_auto/v1740000001/trackside-images/2026/F1_Grand_Prix_of_Barcelona_Catalunya/2281532578.webp',
                        chan: 'ch-1'
                      },
                      {
                        name: 'Basketball',
                        leagues: 'NBA, EuroLeague, NCAA',
                        image: 'https://www.wheelchairbasketball.ca/wp-content/uploads/2024/10/20240831_WHEELCHAIR_BASKETBALL_CPC7808AB-1400x600-1.png',
                        chan: 'ch-5'
                      },
                      {
                        name: 'Boxing & MMA',
                        leagues: 'UFC, WWE, Boxing World Live',
                        image: 'https://cdn.evolve-mma.com/wp-content/uploads/2022/08/what-is-mixed-martial-arts.jpeg',
                        chan: 'ch-4'
                      },
                      {
                        name: 'Tennis',
                        leagues: 'Wimbledon, US Open, ATP, WTA',
                        image: 'https://images.unsplash.com/photo-1545151414-8a948e1ea54f?fm=jpg&q=80&w=800&auto=format&fit=crop',
                        chan: 'ch-2'
                      }
                    ].map((sport, idx) => (
                      <div
                        key={idx}
                        className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#2A2325] border border-slate-800/80 shadow-xl flex flex-col justify-end p-4"
                      >
                        <div className="absolute inset-0 z-0">
                          <img
                            src={sport.image}
                            alt={sport.name}
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[4000ms]"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1820] via-[#1E1820]/30 to-transparent" />
                        </div>

                        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                          <span className="bg-red-600 text-white font-mono font-bold text-[8px] tracking-wider px-1.5 py-0.5 rounded uppercase flex items-center gap-1 leading-none shadow">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                            LIVE
                          </span>
                          <span className="bg-[#1E1820]/80 text-primary border border-[#C4B5FD]/20 font-mono text-[8px] px-1.5 py-0.5 rounded leading-none">
                            4K HD
                          </span>
                        </div>

                        <div className="relative z-10">
                          <h4 className="text-yellow-400 font-display font-extrabold text-sm leading-snug uppercase">
                            {sport.name}
                          </h4>
                        </div>

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-primary/35">
                          <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* C. PREMIUM & VIP CHANNELS GRID (Screenshot 22.50.52) */}
                <div className="space-y-8 pt-4" id="premium-vip-channels-hub">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-primary font-bold uppercase block bg-[#2A2325] w-max mx-auto px-3.5 py-1 rounded-full border border-slate-800">
                      EXCLUSIVE CONTENT
                    </span>
                    <h2 className="text-white font-display font-extrabold text-2xl md:text-3xl tracking-tight uppercase">
                      Premium & <span className="text-primary italic">VIP Channels</span>
                    </h2>
                    <p className="text-sm text-[#C4B5FD] max-w-xl mx-auto font-display italic leading-relaxed">
                      PPV events, VIP streaming platforms and the world's top channels — all included.
                    </p>
                  </div>

                  {/* Network Logo Lists */}
                  {(() => {
                    const ALL_GROUPS = [
                      {
                        groupTitle: 'VIP STREAMING & PAY-PER-VIEW',
                        groupSub: 'VIP PLATFORMS + PPV EVENTS',
                        rows: [
                          {
                            label: 'VIP STREAMING',
                            dir: 'right' as const,
                            channels: [
                              { name: 'Apple TV+', badge: 'VIP', logo: 'https://www.google.com/s2/favicons?domain=tv.apple.com&sz=128' },
                              { name: 'Paramount+', badge: 'VIP', logo: 'https://store-images.s-microsoft.com/image/apps.35768.9007199266243596.ad78eadf-f174-4f68-8c73-562e5c227afa.9171eaf0-5404-436f-803e-5f420e055b0e' },
                              { name: 'Netflix Premium', badge: 'VIP', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrejjNX8_J7UvEbpAJd5ibayukDSuyGmDk-pMYrYkaew&s=10' },
                              { name: 'HBO Max Gold', badge: 'VIP', logo: 'https://i.pinimg.com/564x/27/7f/21/277f21068549680e0daaddab0dcf975f.jpg' },
                              { name: 'Disney+ Cinema', badge: 'VIP', logo: 'https://yt3.googleusercontent.com/HBNZiS5QKb-Mc5_n7Q8_wOH-t3VI_jPPcO8uwE0dMgAjff7Pf0VZ4h_EBugzRCt059QJnIPDpg=s900-c-k-c0x00ffffff-no-rj' },
                              { name: 'Prime Video 4K', badge: 'VIP', logo: 'https://m.media-amazon.com/images/I/61sDr8btlTL.png' }
                            ]
                          },
                          {
                            label: 'PAY-PER-VIEW',
                            dir: 'left' as const,
                            channels: [
                              { name: 'Showtime PPV', badge: 'PPV', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Showtime.svg/250px-Showtime.svg.png' },
                              { name: 'TNT Sports PPV', badge: 'PPV', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe40vtE2AHgtyk-uz8ncZFa8yxYrf6Z5d91ggvDrF9Mw&s=10' },
                              { name: 'UFC Fight Pass', badge: 'PPV', logo: 'https://i.pinimg.com/564x/d0/c4/7d/d0c47da28d97db1358dc84bb098d67ca.jpg' },
                              { name: 'DAZN Sports', badge: 'SPORTS', logo: 'https://www.google.com/s2/favicons?domain=dazn.com&sz=128' },
                              { name: 'Sky Sport Box Office', badge: 'PPV', logo: 'https://www.google.com/s2/favicons?domain=sky.it&sz=128' },
                              { name: 'ESPN PPV MAIN', badge: 'PPV', logo: 'https://www.google.com/s2/favicons?domain=espn.com&sz=128' }
                            ]
                          }
                        ]
                      },
                    ];


                    type ChanItem = { name: string; badge: string; logo?: string };
                    const renderMarqueeRow = (channels: ChanItem[], dir: 'left' | 'right', uid: string) => (
                      <div className="w-full overflow-hidden relative py-1" id={`mq-${uid}`}>
                        <div className={`flex gap-3 w-max py-1 ${dir === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}>
                          {[...channels, ...channels, ...channels, ...channels].map((chan, idx) => (
                            <div
                              key={`${uid}-${idx}`}
                              className="flex-shrink-0 flex items-center justify-center py-3 px-4 rounded-2xl border border-slate-200 bg-transparent"
                            >
                              {chan.logo && (
                                <img src={chan.logo} alt={chan.name} className="w-10 h-10 rounded-xl object-contain" referrerPolicy="no-referrer" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );

                    return (
                      <div className="space-y-6" id="logos-categories-deck">
                        {ALL_GROUPS.map((group, gIdx) => (
                          <div key={gIdx} className="rounded-2xl border border-purple-200/60 bg-white p-5 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <div>
                                <span className="text-[9px] font-display tracking-widest text-purple-600 font-bold uppercase block">{group.groupSub}</span>
                                <h4 className="text-slate-900 font-display font-bold text-base mt-0.5">{group.groupTitle}</h4>
                              </div>
                              <span className="text-[9px] font-display text-emerald-600 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                LIVE
                              </span>
                            </div>
                            {group.rows.map((row, rIdx) => (
                              <div key={rIdx} className="space-y-2">
                                <div className="flex items-center gap-3 px-1">
                                  <span className="text-[9px] font-display tracking-widest text-purple-600 font-bold uppercase">{row.label}</span>
                                  <div className="flex-1 h-px bg-purple-200" />
                                </div>
                                {renderMarqueeRow(row.channels, row.dir, `g${gIdx}r${rIdx}`)}
                              </div>
                            ))}
                          </div>
                        ))}

                      </div>
                    );
                  })()}
                </div>

                {/* D. TRENDING IN UK FILMS */}
                {(() => {
                  const UK_FILMS = [
                    { title: 'Pressure', year: 2025, duration: '1h 52m', score: 7.2, genre: 'Thriller', image: 'https://images.contentstack.io/v3/assets/blt223a4a92692ca457/blt894aaac05ce45f74/69d6e086e583e66086f06ba4/T4108_Pressure_Digital_1sht_1080x1600.jpg?branch=production&width=1080' },
                    { title: 'The Odyssey', year: 2025, duration: '2h 46m', score: 8.1, genre: 'Adventure', image: 'https://m.media-amazon.com/images/M/MV5BOGZkZGQ3MDgtNjJkYy00ZDFlLThmN2ItYWEzNGE2MTdmYmE4XkEyXkFqcGc@._V1_.jpg' },
                    { title: 'The Amazing Digital Circus', year: 2024, duration: '1h 30m', score: 8.3, genre: 'Animation', image: 'https://m.media-amazon.com/images/M/MV5BMTlkY2NjODgtOWI5ZC00MjIzLWFiYjItN2ZiOTU5YzA2ODlmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' },
                    { title: 'Your Fault: London', year: 2025, duration: '2h 05m', score: 7.5, genre: 'Romance', image: 'https://m.media-amazon.com/images/M/MV5BNzI2YmMxZWItNjlhOS00ODNmLWEzYjQtYWIyNjc0ZTQwOTZlXkEyXkFqcGc@._V1_.jpg' },
                    { title: 'How to Make a Killing', year: 2025, duration: '1h 45m', score: 7.0, genre: 'Crime', image: 'https://m.media-amazon.com/images/M/MV5BOTkwY2JjMWYtOGU4YS00ZTg0LWIzYzUtZDkxNDE5NWNkNWM1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' },
                    { title: 'In the Grey', year: 2026, duration: '2h 08m', score: 6.7, genre: 'Action', image: 'https://media.themoviedb.org/t/p/w300_and_h450_face/dQgIcW6Th08kMRf2HBoYWoFE6OD.jpg' },
                    { title: 'Legends', year: 2026, duration: '6 Episodes', score: 8.1, genre: 'Crime', image: 'https://upload.wikimedia.org/wikipedia/en/6/66/Legends_2026_TV_series_poster.jpeg' },
                    { title: 'The Last House', year: 2026, duration: '1h 50m', score: 7.2, genre: 'Sci-Fi', image: 'https://upload.wikimedia.org/wikipedia/en/b/b2/The_Last_House_poster.jpg' },
                    { title: "Clarkson's Farm", year: 2025, duration: 'Season 4', score: 9.0, genre: 'Documentary', image: "https://upload.wikimedia.org/wikipedia/en/a/a0/Clarkson%27s_Farm_Title_Card.jpg" },
                    { title: 'Tip Toe', year: 2026, duration: 'Mini-Series', score: 7.8, genre: 'Thriller', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=600' },
                    { title: 'Shelter', year: 2026, duration: '1h 47m', score: 6.2, genre: 'Action', image: 'https://media.themoviedb.org/t/p/w300_and_h450_face/buPFnHZ3xQy6vZEHxbHgL1Pc6CR.jpg' },
                    { title: 'The Witness', year: 2026, duration: 'Mini-Series', score: 7.5, genre: 'Crime', image: 'https://media.themoviedb.org/t/p/w300_and_h450_face/6vW1V7qejXv4QI2TvWvYuowfTrU.jpg' },
                    { title: 'Half Man', year: 2026, duration: '6 Episodes', score: 8.4, genre: 'Drama', image: 'https://upload.wikimedia.org/wikipedia/en/9/93/Half_Man_Release_Poster.jpg' },
                    { title: 'Black Mirror', year: 2025, duration: 'Season 7', score: 7.8, genre: 'Sci-Fi', image: 'https://media.themoviedb.org/t/p/w300_and_h450_face/seN6rRfN0I6n8iDXjlSMk1QjNcq.jpg' },
                  ];
                  return (
                    <div className="space-y-5 pt-4" id="uk-trending-hub">
                      <div className="border-b border-white/10 pb-3">
                        <span className="text-[10px] font-display tracking-widest text-[#7C3AED] font-bold uppercase block">UK BOX OFFICE</span>
                        <h2 className="text-white font-display text-3xl tracking-tight">Trending in UK</h2>
                      </div>
                      <div className="w-full overflow-hidden relative py-1">
                        <div className="flex gap-4 w-max animate-marquee-films pb-3">
                          {[...UK_FILMS, ...UK_FILMS, ...UK_FILMS, ...UK_FILMS].map((film, idx) => (
                            <div
                              key={idx}
                              className="group flex-shrink-0 w-[185px] bg-[#2A2325] border border-white/10 rounded-2xl overflow-hidden shadow-xl"
                            >
                              <div className="relative w-full h-[265px] bg-[#1E1820] overflow-hidden">
                                <img src={film.image} alt={film.title} className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" loading="lazy" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1820] via-transparent to-transparent" />
                                <div className="absolute top-2.5 left-2.5">
                                  <span className="bg-[#7C3AED] text-white text-[8px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">#{(idx % UK_FILMS.length) + 1} UK</span>
                                </div>
                                <div className="absolute top-2.5 right-2.5">
                                  <span className="bg-[#1E1820]/90 backdrop-blur-sm text-[9px] font-mono text-yellow-400 px-1.5 py-0.5 rounded-md">★ {film.score}</span>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <div className="w-11 h-11 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-primary/40 scale-90 group-hover:scale-100 transition-transform">
                                    <Play className="w-5 h-5 fill-[#1E1820] ml-0.5" />
                                  </div>
                                </div>
                              </div>
                              <div className="p-3.5">
                                <h4 className="text-sm font-display text-white group-hover:text-primary transition-colors leading-tight line-clamp-1">{film.title}</h4>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-[10px] text-[#C4B5FD] font-mono">{film.genre}</span>
                                  <span className="text-[10px] text-[#C4B5FD] font-mono">{film.year}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* E. PRICING — FULL INTERACTIVE */}
                <div className="space-y-10 pt-4" id="home-pricing-preview">
                  {/* Header */}
                  <div className="text-center max-w-xl mx-auto space-y-3">
                    <span className="text-[10px] font-mono tracking-widest text-primary font-bold uppercase block bg-[#2A2325] w-max mx-auto px-3.5 py-1 rounded-full border border-slate-800">
                      SIMPLE PRICING
                    </span>
                    <h2 className="text-white font-display font-extrabold text-2xl md:text-3xl tracking-tight uppercase">
                      Choose Your Plan
                    </h2>
                    <p className="text-xs text-[#C4B5FD] font-sans">No contracts. Cancel anytime. Activated in under 5 minutes.</p>
                    <div className="inline-flex flex-wrap items-center justify-center gap-2.5 bg-dark-bg border border-amber-400/30 px-4 py-2.5 rounded-2xl shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                      <span className="text-[10px] font-mono font-bold text-amber-300 tracking-wider">FLASH SALE:</span>
                      <span className="font-mono text-sm font-extrabold text-white bg-dark-deep border border-slate-800 px-3 py-1 rounded-xl">{formatPromoTime(promoTime)}</span>
                      <span className="text-[10px] text-emerald-400 font-bold font-mono uppercase tracking-wide">-33% locked</span>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="max-w-lg mx-auto space-y-4">
                    <div className="grid grid-cols-2 p-1.5 bg-[#1E1820] border border-slate-800/80 rounded-2xl">
                      <button onClick={() => setPricingTier('standard')} className={`py-3 px-4 rounded-xl text-xs font-display font-extrabold tracking-wide transition-all uppercase cursor-pointer ${pricingTier === 'standard' ? 'bg-slate-800 text-white shadow border border-slate-700/30' : 'text-slate-400 hover:text-white'}`}>Standard</button>
                      <button onClick={() => setPricingTier('vip')} className={`py-3 px-4 rounded-xl text-xs font-display font-extrabold tracking-wide transition-all uppercase cursor-pointer ${pricingTier === 'vip' ? 'bg-gradient-to-r from-primary to-[#EAB308] text-slate-950 shadow-lg' : 'text-white/60 hover:text-white'}`}>VIP Ultra</button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[1,2,3,4].map(scr => (
                        <button key={scr} onClick={() => setSelectedScreens(scr)} className={`py-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${selectedScreens === scr ? 'bg-slate-900 text-primary border-2 border-primary' : 'bg-[#1E1820] text-slate-400 border border-slate-800 hover:text-white'}`}>
                          <span className="block text-sm font-extrabold">{scr}</span>
                          <span className="text-[8px] opacity-70 uppercase">{scr === 1 ? 'Screen' : 'Screens'}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cards */}
                  {(() => {
                    const isVip = pricingTier === 'vip';
                    const STD_PX = {1:[{p:24.99,o:44.99},{p:34.99,o:54.99},{p:69.99,o:89.99}],2:[{p:39.99,o:59.99},{p:49.99,o:79.99},{p:99.99,o:129.99}],3:[{p:49.99,o:69.99},{p:69.99,o:89.99},{p:139.99,o:179.99}],4:[{p:57.99,o:85.99},{p:89.99,o:119.99},{p:179.99,o:239.99}]};
                    const VIP_PX = {1:[{p:34.99,o:54.99},{p:44.99,o:64.99},{p:79.99,o:99.99}],2:[{p:49.99,o:69.99},{p:79.99,o:99.99},{p:125.99,o:159.99}],3:[{p:69.99,o:134.99},{p:99.99,o:129.99},{p:179.99,o:249.99}],4:[{p:89.99,o:125.99},{p:139.99,o:199.99},{p:199.99,o:279.99}]};
                    const px = (isVip ? VIP_PX : STD_PX)[selectedScreens as 1|2|3|4];
                    const PLANS = [
                      { id: 'starter', label: isVip ? 'VIP STARTER' : 'STANDARD', duration: '3 Months', monthsNum: 3, price: px[0].p, originalPrice: px[0].o, featured: false,
                        features: isVip ? [`VIP Access on ${selectedScreens} Screen${selectedScreens>1?'s':''}`, '85,000+ Live Channels', '200,000+ Movies & Series', 'All Sports Packages', 'PPV Events: UFC, Boxing, WWE', '4K / Ultra HD', 'Anti-Freeze Technology', 'Priority Support 24/7'] : [`Full Access on ${selectedScreens} Screen${selectedScreens>1?'s':''}`, '85,000+ Live Channels', '200,000+ Movies & Series', 'All Sports Packages', 'FHD / HD / SD', 'No Contract Required'] },
                      { id: 'premium', label: isVip ? 'VIP PREMIUM' : 'PREMIUM', duration: '6 Months', monthsNum: 6, price: px[1].p, originalPrice: px[1].o, featured: false,
                        features: isVip ? [`VIP Access on ${selectedScreens} Screen${selectedScreens>1?'s':''}`, '85,000+ Live Channels', '200,000+ Movies & Series', 'All Sports Packages', 'PPV Events: UFC, Boxing, WWE', '4K / Ultra HD', 'Anti-Freeze Technology', 'Priority Support 24/7'] : [`Full Access on ${selectedScreens} Screen${selectedScreens>1?'s':''}`, '85,000+ Live Channels', '200,000+ Movies & Series', 'All Sports Packages', 'FHD / HD / SD', 'No Contract Required'] },
                      { id: 'elite', label: isVip ? 'VIP ELITE' : 'BEST VALUE', duration: isVip ? '12 + 3 Months' : '12 Months', monthsNum: isVip ? 15 : 12, price: px[2].p, originalPrice: px[2].o, featured: true, savings: isVip ? 'VIP RECOMMENDED' : 'MOST POPULAR',
                        features: isVip ? [`VIP Access on ${selectedScreens} Screen${selectedScreens>1?'s':''}`, '12 Months + 3 FREE', '85,000+ Live Channels', '200,000+ Movies & Series', 'All Sports Packages', 'PPV Events: UFC, Boxing, WWE', '4K / Ultra HD', 'Anti-Freeze Technology', 'Priority Support 24/7'] : [`Full Access on ${selectedScreens} Screen${selectedScreens>1?'s':''}`, '85,000+ Live Channels', '200,000+ Movies & Series', 'All Sports Packages', 'PPV Events Included', 'FHD / HD / SD', 'No Contract Required'] },
                    ];
                    const splitPrice = (n: number) => { const [w,d] = n.toFixed(2).split('.'); return {whole:w,dec:d}; };
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
                        {PLANS.map(plan => {
                          const {whole,dec} = splitPrice(plan.price);
                          const discount = Math.round((1 - plan.price/plan.originalPrice)*100);
                          return (
                            <div key={plan.id} id={`plan-${plan.id}-${pricingTier}-${selectedScreens}s`} className={`relative rounded-[28px] flex flex-col shadow-2xl overflow-hidden transition-all duration-300 h-full ${isVip ? 'bg-yellow-400' : 'bg-white'} text-slate-900 ${plan.featured ? 'ring-2 ring-purple-500/50 md:scale-105 z-10' : ''}`}>
                              {plan.featured && (
                                <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden rounded-tr-[28px] pointer-events-none z-20">
                                  <div className={`text-[9px] font-black py-2 w-[140px] absolute top-5 -right-9 rotate-45 uppercase tracking-[0.15em] text-center leading-tight ${isVip ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white'}`}>
                                    {plan.savings?.split(' ').map((w,i) => <span key={i} className="block">{w}</span>)}
                                  </div>
                                </div>
                              )}
                              <div className="p-7 flex flex-col flex-1">
                                <div className="mb-5">
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] block mb-1 text-yellow-900">{plan.label}</span>
                                  <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">{plan.duration}</h3>
                                </div>
                                <div className="mb-6">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="line-through text-base font-bold text-yellow-700/60">{plan.originalPrice.toFixed(2)} €</span>
                                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-700 text-white">-{discount}%</span>
                                  </div>
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-6xl font-black tracking-tighter leading-none text-slate-900">{whole}</span>
                                    <span className="text-2xl font-black text-yellow-700/60">.{dec}</span>
                                    <span className="text-4xl font-black text-purple-700">€</span>
                                  </div>
                                  <p className="text-[10px] mt-1.5 font-medium italic uppercase tracking-wider text-yellow-800/60">one-time payment</p>
                                </div>
                                <div className="space-y-3 mb-7 flex-1">
                                  {plan.features.map((feat,i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm font-semibold leading-snug text-slate-800">
                                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-purple-700">
                                        <Check className="w-3 h-3 text-white" />
                                      </div>
                                      {feat}
                                    </div>
                                  ))}
                                </div>
                                <a
                                  href={`https://wa.me/447449708976?text=${encodeURIComponent(`Hello! I'd like to order the following plan:\n\nPlan: ${plan.label}\nDuration: ${plan.duration}\nScreens: ${selectedScreens}\nPrice: €${plan.price.toFixed(2)}\n\nPlease confirm and send payment details. Thank you!`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer text-center block ${isVip ? 'bg-purple-700 hover:bg-purple-800 text-white shadow-xl shadow-purple-700/30' : plan.featured ? 'bg-slate-900 text-white hover:bg-black shadow-xl' : 'bg-slate-900 text-white hover:bg-black'}`}
                                >Get Started</a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </>
            ) : (
              // Backup Search Query Filters & Genre Navigation (so the search console doesn't break!)
              <div className="space-y-6 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:pb-0" id="genre-pills">
                    {MOCK_GENRES.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all shrink-0 ${
                          selectedGenre === genre
                            ? 'bg-primary text-slate-950 font-bold shadow shadow-primary/20'
                            : 'bg-slate-900/40 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#C4B5FD]">
                    <SlidersHorizontal className="w-4 h-4 text-[#C4B5FD]" />
                    <span>{filteredChannels.length + filteredFilms.length} result{filteredChannels.length + filteredFilms.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;</span>
                  </div>
                </div>

                <div className="space-y-6">

                  {/* Channel results */}
                  {filteredChannels.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-white font-display font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                        <Tv className="w-4 h-4 text-yellow-400" />
                        Channels ({filteredChannels.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {filteredChannels.map((ch, i) => (
                          <div key={i} className="bg-[#1a0533]/60 border border-purple-900/30 rounded-xl overflow-hidden flex flex-col">
                            <div className="flex items-center justify-center bg-[#0d0014]/60 h-20 p-3">
                              <img src={ch.logo} alt={ch.name} className="max-h-14 max-w-full object-contain" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                            </div>
                            <div className="p-2.5 flex flex-col gap-1">
                              <div className="flex items-center justify-between">
                                <span className={`text-[9px] font-display font-black uppercase px-1.5 py-0.5 rounded-full ${ch.badge === 'VIP' ? 'bg-yellow-400/20 text-yellow-400' : ch.badge === 'PPV' ? 'bg-red-500/20 text-red-400' : ch.badge === '4K' ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-400'}`}>{ch.badge}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              </div>
                              <p className="text-white font-display font-bold text-xs leading-tight">{ch.name}</p>
                              <p className="text-[10px] text-slate-500 font-sans">{ch.category}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Film results */}
                  {filteredFilms.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-white font-display font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        Films & Series ({filteredFilms.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {filteredFilms.map((film, i) => (
                          <div key={i} className="bg-[#1a0533]/60 border border-purple-900/30 rounded-xl overflow-hidden flex flex-col">
                            <div className="relative aspect-[2/3] bg-[#0d0014]">
                              <img src={film.image} alt={film.title} className="w-full h-full object-cover opacity-90" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0014] via-transparent to-transparent" />
                              <span className="absolute top-2 left-2 text-[9px] font-display font-black uppercase px-1.5 py-0.5 rounded-full bg-purple-500/80 text-white">{film.genre}</span>
                            </div>
                            <div className="p-2.5 space-y-0.5">
                              <p className="text-white font-display font-bold text-xs leading-tight">{film.title}</p>
                              <p className="text-[10px] text-slate-500 font-sans">{film.duration} • {film.year}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No results */}
                  {filteredChannels.length === 0 && filteredFilms.length === 0 && (
                    <div className="text-center p-12 bg-[#1a0533]/40 border border-purple-900/30 rounded-2xl">
                      <h4 className="text-white font-display font-bold text-sm">No results found for &ldquo;{searchQuery}&rdquo;</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Try searching for a channel name, film title, or genre.</p>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        )}

        {/* 3. DYNAMIC IP-TV SUBSCRIPTIONS USER DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 tracking-widest font-bold uppercase block">SECURE CONTROL HUB</span>
                <h2 className="text-white font-display font-bold text-2xl tracking-tight leading-normal">Your Active IPTV Streams</h2>
              </div>

              <div className="flex gap-2" id="dashboard-meta-actions">
                <button
                  onClick={() => setShowPlaylistPortal(true)}
                  className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-850 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Load Custom Playlist</span>
                </button>

                <button
                  onClick={() => setActiveTab('pricing')}
                  className="inline-flex items-center gap-1.5 py-2 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer transition-colors shadow shadow-cyan-500/10"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Order Another Connection Code</span>
                </button>
              </div>
            </div>

            {/* DASHBOARD STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5" id="dashboard-main-row">
              
              {/* CURRENT CODES / ACTIVE SUBSCRIPTIONS COLUMN */}
              <div className="md:col-span-8 space-y-4">
                <h3 className="text-xs text-slate-400 font-mono uppercase tracking-wide">Active IPTV Subscriptions</h3>

                {subscriptions.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950 border border-slate-900 rounded-2xl space-y-3.5">
                    <span className="text-3xl block">🔑</span>
                    <div>
                      <h4 className="text-white font-semibold text-sm">No active IPTV connections found</h4>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">Please select an IPTV package bundle from our pricing portal to instantly activate your high speed 4K credentials.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('pricing')}
                      className="px-4 py-2 border border-cyan-800/60 bg-cyan-950/20 text-cyan-400 hover:text-cyan-300 font-semibold text-xs rounded-xl cursor-pointer"
                    >
                      Browse IPTV Packages
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4" id="subs-cards-list">
                    {subscriptions.map((sub) => (
                      <div 
                        key={sub.id} 
                        className="bg-slate-950 border border-slate-900 rounded-2xl p-5 md:p-6 shadow-xl space-y-4 hover:border-slate-850 transition-all relative overflow-hidden"
                      >
                        {/* Top banner info */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/5">
                              🔑
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-white">{sub.planName}</h4>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-mono leading-none font-bold uppercase ${sub.status === 'active' ? 'bg-emerald-950/80 text-emerald-400' : 'bg-rose-950/80 text-rose-400'}`}>
                                  {sub.status}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-sans mt-0.5">Secure ID Line: {sub.id}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="text-slate-500">Transaction Ref:</span>
                            <span className="text-slate-300 truncate max-w-[150px]">{sub.transactionId}</span>
                          </div>
                        </div>

                        {/* Secure active streaming credentials details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/40 p-4 border border-slate-900 rounded-xl relative z-10" id="credentials-box">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold font-mono tracking-wider">XTREAM CODES API ACCESS LINK</p>
                            <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-900 mt-1">
                              <span className="text-xs font-mono text-cyan-400 select-all font-semibold">http://aura-iptv.net:3000</span>
                              <button 
                                onClick={() => handleCopyCode('http://aura-iptv.net:3000', `${sub.id}-url`)} 
                                className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
                              >
                                {copiedSubscriptionId === `${sub.id}-url` ? <span className="text-[9px] text-emerald-400 font-mono font-bold">Copied</span> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold font-mono tracking-wider">CREDS USERNAME</p>
                            <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-900 mt-1">
                              <span className="text-xs font-mono text-white select-all">aura_user_{sub.id.split('-').pop()}</span>
                              <button 
                                onClick={() => handleCopyCode(`aura_user_${sub.id.split('-').pop()}`, `${sub.id}-user`)} 
                                className="text-slate-400 hover:text-white shrink-0 cursor-pointer"
                              >
                                {copiedSubscriptionId === `${sub.id}-user` ? <span className="text-[9px] text-emerald-400 font-mono">Copied</span> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Terms metrics row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs relative z-10">
                          <div>
                            <span className="text-slate-500 block">Pricing Plan:</span>
                            <span className="font-semibold text-white font-mono">€{sub.price} / {sub.periodMonths} Mo</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Devices:</span>
                            <span className="font-semibold text-slate-300 font-mono">{sub.devicesConnected} / {sub.maxDevices} Active</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Renew Date:</span>
                            <span className="font-semibold text-emerald-400 font-mono">{sub.nextBillingDate}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Payment Method:</span>
                            <span className="font-semibold text-white uppercase font-mono">{sub.paymentMethod}</span>
                          </div>
                        </div>

                        {/* Actions line */}
                        <div className="border-t border-slate-900 pt-3.5 flex items-center justify-between text-xs relative z-10">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <span>Auto-billing security link active</span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                alert(`Simulated diagnostic command. System logs: IPTV streaming node is responding from server host http://aura-iptv.net:3000. Decrypt keys verified successfully.`);
                              }}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:text-white text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Line Diagnosis
                            </button>
                            <button
                              onClick={() => handleDeleteSub(sub.id)}
                              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/40 rounded-lg cursor-pointer"
                              title="Delete sub code"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* STAT DIAGRAM & PLAYLIST SIDEBAR COLUMN */}
              <div className="md:col-span-4 space-y-6">
                
                {/* 1. DATA BANDWIDTH CAPACITY DIAGRAM */}
                <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 shadow-xl space-y-4">
                  <h4 className="text-xs text-slate-400 font-mono uppercase tracking-wide">Live Stream Bandwidth</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400 font-medium">Monthly streaming data used</span>
                      <span className="text-cyan-400 font-bold">394 GB / 1000 GB</span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full" style={{ width: '39.4%' }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 text-center">
                    <div className="bg-slate-900/40 p-2 border border-slate-900 rounded-lg">
                      <span className="text-[10px] text-slate-500 font-mono block">LIVE CHANNELS DELAY</span>
                      <span className="text-xs font-bold font-mono text-emerald-400">~0.4s (Ultra Fast)</span>
                    </div>
                    <div className="bg-slate-900/40 p-2 border border-slate-900 rounded-lg">
                      <span className="text-[10px] text-slate-500 font-mono block">FPS REFRESH RATE</span>
                      <span className="text-xs font-bold font-mono text-white">60 FPS HDR</span>
                    </div>
                  </div>
                </div>

                {/* 2. CHANNELS PLAYLIST PREVIEW GRID */}
                <div className="bg-slate-950 border border-[#231E1F] rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs text-white font-semibold font-display tracking-tight flex items-center gap-1.5">
                      <Tv className="w-4 h-4 text-cyan-400" /> Loaded TV Channels ({channels.length})
                    </h4>
                    <span className="text-[9px] text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded">ONLINE</span>
                  </div>

                  <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1" id="channels-list">
                    {channels.map((channel) => (
                      <div
                        key={channel.id}
                        onClick={() => {
                          // Wrap as media for player
                          const wrapped: MediaItem = {
                            id: channel.id,
                            title: channel.name,
                            type: 'live',
                            posterUrl: '',
                            backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1200',
                            genre: ['Broadcasting Live', channel.category],
                            rating: 'PG-13',
                            score: 9.9,
                            duration: 'Live',
                            year: 2026,
                            description: `Live transmission decoding from secure server node. Stream channel quality ${channel.quality}. Anti-Buffer system working.`,
                            cast: [],
                            category: channel.category
                          };
                          setActiveMedia(wrapped);
                        }}
                        className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-slate-900 hover:border-cyan-500/30 cursor-pointer transition-all hover:bg-slate-900"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-xs text-white">
                            {channel.logo}
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-medium text-slate-200 group-hover:text-cyan-400 transition-colors truncate">
                              {channel.name}
                            </h5>
                            <span className="text-[10px] text-slate-500 font-mono">{channel.category} • {channel.quality}</span>
                          </div>
                        </div>

                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* 4. PRICING OFFERS PLATFORM BLOCK (INTERACTIVE PLAN SELECTOR & CONFIGURATOR) */}
        {activeTab === 'pricing' && (
          <div className="space-y-12">
            
            {/* Header Content */}
            <div className="text-center max-w-xl mx-auto space-y-3.5">
              <span className="text-[10px] text-primary font-mono tracking-widest font-bold uppercase block bg-[#2A2325] w-max mx-auto px-3.5 py-1 rounded-full border border-slate-800">
                FLEXIBLE LICENSING PORTS
              </span>
              <h2 className="text-3xl md:text-4xl text-white font-display font-extrabold tracking-tight uppercase">
                Plans tailored for you
              </h2>
              <p className="text-xs text-[#C4B5FD] leading-relaxed font-sans">
                Simple automated checkout with secure processing. Choose your priority stream code below, customize the screens count, and begin streaming inside our player in standard 5 minutes!
              </p>

              {/* Countdown Timer Row from the Screenshots */}
              <div className="inline-flex flex-wrap items-center justify-center gap-2.5 bg-dark-bg border border-amber-400/30 px-4.5 py-2.5 rounded-2.5xl shadow-lg mt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <span className="text-[10px] font-mono font-bold text-amber-300 tracking-wider">
                  FLASHSALE LIMITED TIME OFFER:
                </span>
                <span className="font-mono text-sm font-extrabold text-white bg-dark-deep border border-slate-800 px-3 py-1 rounded-xl">
                  {formatPromoTime(promoTime)}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold font-mono uppercase tracking-wide">
                  -33% discount fully locked
                </span>
              </div>
            </div>

            {/* Interactive Switchers & Filters Card Row */}
            <div className="max-w-xl mx-auto bg-[#2A2325]/80 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl" id="interactive-configurator-pnl">
              
              {/* Option A: Standard vs. VIP Tier Switcher */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-mono text-[#C4B5FD] font-bold block text-center sm:text-left">
                  SELECT STREAMING LINK LEVEL:
                </label>
                <div className="grid grid-cols-2 p-1.5 bg-[#1E1820] border border-slate-800/80 rounded-2xl" id="tier-switcher-grid">
                  <button
                    onClick={() => setPricingTier('standard')}
                    className={`py-3.5 px-4 rounded-xl text-xs font-display font-extrabold tracking-wide transition-all uppercase cursor-pointer ${
                      pricingTier === 'standard'
                        ? 'bg-gradient-to-r from-slate-850 to-slate-800 text-slate-150 shadow border border-slate-700/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Standard Premium
                  </button>
                  <button
                    onClick={() => setPricingTier('vip')}
                    className={`py-3.5 px-4 rounded-xl text-xs font-display font-extrabold tracking-wide transition-all uppercase cursor-pointer flex items-center justify-center gap-1.5 ${
                      pricingTier === 'vip'
                        ? 'bg-gradient-to-r from-primary to-[#EAB308] text-slate-950 shadow-lg shadow-primary/10'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <span>Recommended VIP Ultra</span>
                  </button>
                </div>
              </div>

              {/* Option B: Screen Count Switcher */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-mono text-[#C4B5FD] font-bold block text-center sm:text-left">
                  SIMULTANEOUS SCREENS ACCESS:
                </label>
                <div className="grid grid-cols-4 gap-2 text-center" id="screen-options-row">
                  {[1, 2, 3, 4].map((scr) => (
                    <button
                      key={scr}
                      onClick={() => setSelectedScreens(scr)}
                      className={`py-3.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        selectedScreens === scr
                          ? 'bg-slate-900 text-primary border-2 border-primary shadow-md'
                          : 'bg-[#1E1820] text-slate-400 border border-slate-850 hover:text-white hover:border-slate-800'
                      }`}
                    >
                      <span className="block text-sm font-extrabold">{scr}</span>
                      <span className="text-[8px] opacity-70 font-sans tracking-tight block uppercase">
                        {scr === 1 ? 'Screen' : 'Screens'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option C: Dynamic Infrastructure Status badge */}
              <div className="bg-[#1E1820] border border-slate-850 rounded-2xl p-4 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${pricingTier === 'vip' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'} shrink-0`} />
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 block font-bold leading-none">
                      SERVER NODE INFRASTRUCTURE:
                    </span>
                    <span className="text-[11px] text-white font-sans font-semibold mt-1 block">
                      {pricingTier === 'vip' 
                        ? 'Dedicated Private VIP Slots & Priority CDN Transcoder' 
                        : 'Shared Standard Buffering Recovery Pipeline'
                      }
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#EAB308] uppercase tracking-wider font-extrabold shrink-0 border border-[#EAB308]/10 px-2.5 py-1 rounded-lg">
                  {pricingTier === 'vip' ? '100% OK' : '82% OK'}
                </span>
              </div>
            </div>

            {/* Pricing Cards */}
            {(() => {
              const isVip = pricingTier === 'vip';
              const STD_PX = {1:[{p:24.99,o:44.99},{p:34.99,o:54.99},{p:69.99,o:89.99}],2:[{p:39.99,o:59.99},{p:49.99,o:79.99},{p:99.99,o:129.99}],3:[{p:49.99,o:69.99},{p:69.99,o:89.99},{p:139.99,o:179.99}],4:[{p:57.99,o:85.99},{p:89.99,o:119.99},{p:179.99,o:239.99}]};
              const VIP_PX = {1:[{p:34.99,o:54.99},{p:44.99,o:64.99},{p:79.99,o:99.99}],2:[{p:49.99,o:69.99},{p:79.99,o:99.99},{p:125.99,o:159.99}],3:[{p:69.99,o:134.99},{p:99.99,o:129.99},{p:179.99,o:249.99}],4:[{p:89.99,o:125.99},{p:139.99,o:199.99},{p:199.99,o:279.99}]};
              const px = (isVip ? VIP_PX : STD_PX)[selectedScreens as 1|2|3|4];
              const PLANS = [
                {
                  id: 'starter', label: isVip ? 'VIP STARTER' : 'STANDARD', duration: '3 Months', monthsNum: 3,
                  price: px[0].p, originalPrice: px[0].o, featured: false,
                  features: isVip ? [`VIP Access on ${selectedScreens} Screen${selectedScreens>1?'s':''}`, '85,000+ Live Channels', '200,000+ Movies & Series', 'All Sports Packages', 'PPV Events: UFC, Boxing, WWE', '4K / Ultra HD Available', 'Anti-Freeze Technology', 'Dedicated VIP Server', 'Priority Support 24/7'] : [`Full Access on ${selectedScreens} Screen${selectedScreens>1?'s':''}`, '85,000+ Live Channels', '200,000+ Movies & Series', 'All Sports Packages', 'FHD / HD / SD Available', 'No Contract Required', 'Standard Support']
                },
                {
                  id: 'premium', label: isVip ? 'VIP PREMIUM' : 'PREMIUM', duration: '6 Months', monthsNum: 6,
                  price: px[1].p, originalPrice: px[1].o, featured: false,
                  features: isVip ? [`VIP Access on ${selectedScreens} Screen${selectedScreens>1?'s':''}`, '85,000+ Live Channels', '200,000+ Movies & Series', 'All Sports Packages', 'PPV Events: UFC, Boxing, WWE', '4K / Ultra HD Available', 'Anti-Freeze Technology', 'Dedicated VIP Server', 'Priority Support 24/7'] : [`Full Access on ${selectedScreens} Screen${selectedScreens>1?'s':''}`, '85,000+ Live Channels', '200,000+ Movies & Series', 'All Sports Packages', 'FHD / HD / SD Available', 'No Contract Required', 'Standard Support']
                },
                {
                  id: 'elite', label: isVip ? 'VIP ELITE' : 'BEST VALUE', duration: isVip ? '12 + 3 Months' : '12 Months', monthsNum: isVip ? 15 : 12,
                  price: px[2].p, originalPrice: px[2].o, featured: true, savings: isVip ? 'VIP RECOMMENDED' : 'MOST POPULAR',
                  features: isVip ? [`VIP Access on ${selectedScreens} Screen${selectedScreens>1?'s':''}`, '12 Months + 3 FREE', '85,000+ Live Channels', '200,000+ Movies & Series', 'All Sports Packages', 'PPV Events: UFC, Boxing, WWE', '4K / Ultra HD Available', 'Anti-Freeze Technology', 'Dedicated VIP Server', 'Priority Support 24/7'] : [`Full Access on ${selectedScreens} Screen${selectedScreens>1?'s':''}`, '85,000+ Live Channels', '200,000+ Movies & Series', 'All Sports Packages', 'PPV Events Included', 'FHD / HD / SD Available', 'No Contract Required', 'Standard Support']
                }
              ];

              const splitPrice = (n: number) => {
                const [w, d] = n.toFixed(2).split('.');
                return { whole: w, dec: d };
              };

              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch" id="plans-grid">
                  {PLANS.map((plan) => {
                    const { whole, dec } = splitPrice(plan.price);
                    const discount = Math.round((1 - plan.price / plan.originalPrice) * 100);
                    return (
                      <div
                        key={plan.id}
                        id={`plan-${plan.id}-${pricingTier}-${selectedScreens}s`}
                        className={`relative rounded-[28px] flex flex-col shadow-2xl overflow-hidden transition-all duration-300 h-full ${isVip ? 'bg-yellow-400 text-slate-900' : 'bg-white text-slate-900'} ${plan.featured ? 'ring-2 ring-purple-500/50 md:scale-105 z-10' : 'hover:-translate-y-1'}`}
                      >
                        {/* Corner ribbon */}
                        {plan.featured && (
                          <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden rounded-tr-[28px] pointer-events-none z-20">
                            <div className={`text-[9px] font-black py-2 w-[140px] absolute top-5 -right-9 rotate-45 uppercase tracking-[0.15em] text-center leading-tight ${isVip ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white'}`}>
                              {plan.savings?.split(' ').map((w, i) => <span key={i} className="block">{w}</span>)}
                            </div>
                          </div>
                        )}

                        <div className="p-7 flex flex-col flex-1">
                          {/* Label + duration */}
                          <div className="mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] block mb-2 text-yellow-900">{plan.label}</span>
                            <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">{plan.duration}</h3>
                          </div>

                          {/* Price block */}
                          <div className="mb-7">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="line-through text-base font-bold text-yellow-700/60">{plan.originalPrice.toFixed(2)} €</span>
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-700 text-white">-{discount}%</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-6xl font-black tracking-tighter leading-none text-slate-900">{whole}</span>
                              <span className="text-2xl font-black text-yellow-700/60">.{dec}</span>
                              <span className="text-4xl font-black uppercase text-purple-700">€</span>
                            </div>
                            <p className="text-[10px] mt-2 font-medium italic uppercase tracking-wider text-yellow-800/60">one-time payment</p>
                          </div>

                          {/* Features */}
                          <div className="space-y-3 mb-8 flex-1">
                            {plan.features.map((feat, i) => (
                              <div key={i} className="flex items-start gap-3 text-sm font-semibold leading-snug text-slate-800">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-purple-700">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                                {feat}
                              </div>
                            ))}
                          </div>

                          {/* CTA */}
                          <a
                            href={`https://wa.me/447449708976?text=${encodeURIComponent(`Hello! I'd like to order the following plan:\n\nPlan: ${plan.label}\nDuration: ${plan.duration}\nScreens: ${selectedScreens}\nPrice: €${plan.price.toFixed(2)}\n\nPlease confirm and send payment details. Thank you!`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer text-center block ${isVip ? 'bg-purple-700 hover:bg-purple-800 text-white shadow-xl shadow-purple-700/30' : plan.featured ? 'bg-slate-900 text-white hover:bg-black shadow-xl' : 'bg-slate-900 text-white hover:bg-black'}`}
                          >
                            Get Started
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* FAQs Bottom Section */}
            <div className="max-w-4xl mx-auto bg-[#2A2325]/40 border border-slate-800/60 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
              <h4 className="text-white font-display font-extrabold text-base text-center">Frequently Answered Questions</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                  <h5 className="text-xs font-semibold text-white">How fast will I receive my streaming active links?</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Instantly! Our system decodes payment statuses on the fly and immediately outputs Xtream Codes coordinates in your Secure Dashboard cabinet. No human activation delay is required.
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="text-xs font-semibold text-white">Can I configure custom m3u files or edit playlists?</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Yes! Our interactive dashboard allows loading `.m3u` file URLs or integrating Xtream Codes APIs. Custom channel nodes render inside our secure playback viewer automatically.
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="text-xs font-semibold text-white">What is "Anti-Buffer Pro Active Tech"?</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    It is an automated packet recovery firewall. If stream bandwidth drops or networks congest, our system fetches alternative H.265 transport links in less than 400 milliseconds.
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="text-xs font-semibold text-white">How does "Secure automated billing control" operate?</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    You can toggle automated billing off at any interval of your active subscriptions without complex support inquiries. Absolutely zero contracts or cancellation penalties.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 5. APP INSTALLATION INSTRUCTIONS WORKTHROUGHS */}
        {activeTab === 'guide' && (
          <div className="animate-in fade-in duration-300">
            <DeviceGuides />
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-purple-900/30 bg-[#0d0014] pt-12 pb-6 px-4 lg:px-8 mt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Top row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            {/* Brand */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                  <defs>
                    <linearGradient id="footer-logo-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#7C3AED"/>
                      <stop offset="100%" stopColor="#EAB308"/>
                    </linearGradient>
                  </defs>
                  <circle cx="20" cy="20" r="20" fill="url(#footer-logo-bg)"/>
                  <path d="M15 12L15 28L30 20Z" fill="white"/>
                  <path d="M15 20L22 16L22 24Z" fill="url(#footer-logo-bg)" fillOpacity="0.6"/>
                </svg>
                <span className="font-display font-black text-white text-base">IPTV<span className="text-yellow-400">UK</span></span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed font-sans">Premium IPTV streaming with 85,000+ live channels and 200,000+ VOD titles in 4K Ultra HD.</p>
              <a
                href="https://wa.me/447449708976"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-display font-bold text-xs px-4 py-2 rounded-full transition-all hover:scale-105"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.12 1.528 5.845L.057 23.486a.75.75 0 0 0 .914.914l5.635-1.473A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.716 9.716 0 0 1-4.964-1.361l-.355-.211-3.683.963.982-3.588-.232-.37A9.716 9.716 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>

            {/* Navigation */}
            <div className="space-y-3">
              <h6 className="font-display font-bold text-white text-xs uppercase tracking-widest">Navigation</h6>
              <ul className="space-y-2 font-sans">
                {[['Browse Shows', 'catalog'], ['Pricing & Plans', 'pricing'], ['Setup Guide', 'guide']].map(([label, tab]) => (
                  <li key={tab}>
                    <button onClick={() => setActiveTab(tab as 'catalog' | 'pricing' | 'guide')} className="text-slate-400 hover:text-yellow-400 transition-colors cursor-pointer font-sans text-xs">{label}</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Plans */}
            <div className="space-y-3">
              <h6 className="font-display font-bold text-white text-xs uppercase tracking-widest">Plans</h6>
              <ul className="space-y-2 font-sans text-slate-400 text-xs">
                <li>Standard — 3 Months from €24.99</li>
                <li>Standard — 6 Months from €34.99</li>
                <li>Standard — 12 Months from €69.99</li>
                <li className="text-yellow-400 font-display font-bold">VIP — 12 + 3 Months FREE</li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h6 className="font-display font-bold text-white text-xs uppercase tracking-widest">Contact</h6>
              <ul className="space-y-2 font-sans text-xs">
                <li className="flex items-center gap-2 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  Support 24/7
                </li>
                <li>
                  <a href="https://wa.me/447449708976" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-yellow-400 transition-colors">+44 7449 708976</a>
                </li>
                <li className="text-slate-400">Response within minutes</li>
              </ul>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="border-t border-purple-900/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-sans text-slate-600 text-[10px]">© 2026 IPTV UK. All rights reserved.</p>
            <div className="flex items-center gap-3 text-[10px] text-slate-600 font-sans">
              <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-emerald-400 animate-pulse" /> All Channels Online</span>
              <span>•</span>
              <span>4K Ultra HD</span>
              <span>•</span>
              <span>Anti-Freeze Technology</span>
            </div>
          </div>

        </div>
      </footer>

      {/* PORTAL OVERLAYS MODALS */}
      {showPlaylistPortal && (
        <PlaylistPortal 
          onClose={() => setShowPlaylistPortal(false)} 
          onImportSuccess={(newChans) => {
            handleImportPlaylistChannels(newChans);
            setShowPlaylistPortal(false);
          }} 
        />
      )}

      {checkoutPlan && (
        <PaymentWizard
          plan={checkoutPlan}
          onClose={() => setCheckoutPlan(null)}
          onSuccess={(method, dur, price) => {
            handlePaymentSuccess(method, dur, price);
            setCheckoutPlan(null);
          }}
        />
      )}

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/447449708976?text=Hello!%20I%20would%20like%20to%20get%20more%20information%20about%20IPTV%20UK%20plans."
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-xs uppercase tracking-wider px-4 py-3 rounded-full shadow-2xl shadow-green-500/30 hover:scale-105 transition-all"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.12 1.528 5.845L.057 23.486a.75.75 0 0 0 .914.914l5.635-1.473A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.716 9.716 0 0 1-4.964-1.361l-.355-.211-3.683.963.982-3.588-.232-.37A9.716 9.716 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
        </svg>
        <span className="hidden sm:inline">Chat with us</span>
      </a>

    </div>
  );
}
