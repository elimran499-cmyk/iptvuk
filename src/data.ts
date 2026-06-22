import { MediaItem, Plan } from './types';

export const IPTV_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Package',
    price: 29.99,
    currency: '€',
    periodMonths: 3,
    discountPercent: 33,
    isPopular: false,
    features: [
      '115,000+ IPTV Channels Included',
      '120,000+ VOD Movies & Series',
      'Full HD & 4K Streaming Quality',
      'Compatible with Smart TVs & Smartphones',
      'Automatic daily playlist updates',
      'Includes Replay & EPG live TV guide',
      'Anti-Buffer IPTV Pro active technology',
      'Activation in less than 5 minutes',
      'Standard Email Customer Care'
    ]
  },
  {
    id: 'confort',
    name: 'Confort Package',
    price: 39.99,
    currency: '€',
    periodMonths: 6,
    discountPercent: 33,
    isPopular: false,
    features: [
      '115,000+ IPTV Channels Included',
      '120,000+ VOD Movies & Series',
      'Ultra HD, 4K & 8K Streaming',
      'All IPTV Players Compatible',
      'Includes Replay (Up to 7 days stored)',
      'Anti-Buffer Pro Active Engine v2',
      'Activation in less than 5 minutes',
      'Express Support 24/7 Priority Desk'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Ultra 4K',
    price: 49.99,
    currency: '€',
    periodMonths: 12,
    discountPercent: 33,
    isPopular: true,
    features: [
      '115,000+ IPTV Channels Included',
      '120,000+ VOD Movies & Series',
      'Absolute Best IPTV 4K & 8K Quality',
      'IPTV Smarters Pro App & All Players Included',
      'Includes Replay (Up to 7 days stored)',
      'Anti-Buffer Technology Elite Edition',
      'Activation in less than 5 minutes',
      'Dedicated VIP Support Manager 24/7'
    ]
  },
  {
    id: 'pack2',
    name: 'VIP Dual Connection',
    price: 79.99,
    currency: '€',
    periodMonths: 12,
    discountPercent: 27,
    isPopular: false,
    features: [
      '2 Separate Premium Stream Codes',
      '115,000+ Live IPTV Channels',
      '120,000+ Movies & Series VOD',
      'Ultra HD, 4K & 8K on both codes',
      'Full Multiroom simultaneous playback',
      '7 Days Auto-Replay & TimeShift',
      'Anti-Buffer Premium active firewall',
      'Fast Double Activation in 5 mins',
      'Premium VIP Support Desk 24/7'
    ]
  }
];

export const MEDIA_ITEMS: MediaItem[] = [
  // FEATURED MOVIE (DUNE PART TWO)
  {
    id: 'feat-1',
    title: 'Dune: Part Two',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1547483238-f400e65ccd56?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1600',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    rating: 'PG-13',
    score: 8.9,
    duration: '2h 46m',
    year: 2024,
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Florence Pugh', 'Austin Butler'],
    isFeatured: true,
    category: 'Action',
    authorLogo: 'HBO Max'
  },
  // MOVIES & SERIES LISTINGS
  {
    id: 'rec-1',
    title: 'Oppenheimer',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&q=80&w=1200',
    genre: ['Drama', 'Biography', 'History'],
    rating: 'R',
    score: 8.9,
    duration: '3h 00m',
    year: 2023,
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb, illustrating the historical, moral, and scientific dilemmas of the atomic age.',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    category: 'Drama',
    authorLogo: 'Universal'
  },
  {
    id: 'rec-2',
    title: 'The Last of Us',
    type: 'series',
    posterUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&q=80&w=1200',
    genre: ['Drama', 'Sci-Fi', 'Horror'],
    rating: 'TV-MA',
    score: 8.8,
    duration: '2 Seasons',
    year: 2023,
    description: 'After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity\'s last hope, leading her on a brutal, emotional journey across ruins.',
    cast: ['Pedro Pascal', 'Bella Ramsey', 'Gabriel Luna'],
    category: 'Horror',
    authorLogo: 'HBO Max'
  },
  {
    id: 'rec-3',
    title: 'Interstellar',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    rating: 'PG-13',
    score: 8.7,
    duration: '2h 49m',
    year: 2014,
    description: 'When Earth becomes uninhabitable, a team of courageous explorers travels through a wormhole in space in an attempt to ensure humanity\'s survival across the cosmos.',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    category: 'Sci-Fi',
    authorLogo: 'Paramount+'
  },
  {
    id: 'rec-4',
    title: 'Stranger Things',
    type: 'series',
    posterUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
    genre: ['Drama', 'Sci-Fi', 'Horror'],
    rating: 'TV-14',
    score: 8.7,
    duration: '4 Seasons',
    year: 2022,
    description: 'When a young boy vanishes from a small Indiana town, his friends, a cooperative sheriff, and a mysterious girl with telekinetic powers uncover secret government exploits and supernatural secrets.',
    cast: ['Millie Bobby Brown', 'Winona Ryder', 'David Harbour'],
    category: 'Horror',
    authorLogo: 'Netflix'
  },
  {
    id: 'like-1',
    title: 'The Dark Knight',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=1200',
    genre: ['Action', 'Thriller', 'Drama'],
    rating: 'PG-13',
    score: 9.0,
    duration: '2h 32m',
    year: 2008,
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    category: 'Action',
    authorLogo: 'Warner Bros'
  },
  {
    id: 'like-2',
    title: 'Breaking Bad',
    type: 'series',
    posterUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    genre: ['Drama', 'Thriller', 'Crime'],
    rating: 'TV-MA',
    score: 9.5,
    duration: '5 Seasons',
    year: 2013,
    description: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family\'s financial future.',
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
    category: 'Drama',
    authorLogo: 'Netflix'
  },
  {
    id: 'like-3',
    title: 'Shōgun',
    type: 'series',
    posterUrl: 'https://images.unsplash.com/photo-1542224172-e7052809a936?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=1200',
    genre: ['Drama', 'History'],
    rating: 'TV-MA',
    score: 8.9,
    duration: '1 Season',
    year: 2024,
    description: 'When a mysterious English ship is found shipwrecked in a nearby Japanese fishing village, its pilot brings secrets that could tilt the scale of power in 1600 Japan.',
    cast: ['Hiroyuki Sanada', 'Cosmo Jarvis', 'Anna Sawai'],
    category: 'Drama',
    authorLogo: 'Hulu'
  },
  {
    id: 'like-4',
    title: 'The Bear',
    type: 'series',
    posterUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=1200',
    genre: ['Drama', 'Comedy'],
    rating: 'TV-MA',
    score: 8.6,
    duration: '3 Seasons',
    year: 2024,
    description: 'A young chef from the fine dining world returns to Chicago to run his family sandwich shop after a heartbreaking death, wrestling with high stakes and hot heads.',
    cast: ['Jeremy Allen White', 'Ebon Moss-Bachrach', 'Ayo Edebiri'],
    category: 'Drama',
    authorLogo: 'FX on Hulu'
  },
  {
    id: 'like-5',
    title: 'Spider-Man: Across the Spider-Verse',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=1200',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    rating: 'PG',
    score: 8.6,
    duration: '2h 20m',
    year: 2023,
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash, he must redefine what it means to be a hero.',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
    category: 'Action',
    authorLogo: 'Sony Pictures'
  },
  {
    id: 'like-6',
    title: 'Gladiator II',
    type: 'movie',
    posterUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=600',
    backdropUrl: 'https://images.unsplash.com/photo-1601985705806-5b9a71f6004f?auto=format&fit=crop&q=80&w=1200',
    genre: ['Action', 'Drama', 'History'],
    rating: 'R',
    score: 8.1,
    duration: '2h 30m',
    year: 2024,
    description: 'Decades after the death of Gladiator hero Maximus, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical emperors who rule Rome with an iron fist.',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington'],
    category: 'Action',
    authorLogo: 'Paramount'
  }
];

export const MOCK_IPTV_CHANNELS = [
  { id: 'ch-1', name: 'Sky Sports Main Event Super HD', logo: '⚽', category: 'Sports', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', quality: '4K', online: true },
  { id: 'ch-2', name: 'Canal+ Premium France Ultra 4K', logo: '📺', category: 'Movies', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', quality: '4K', online: true },
  { id: 'ch-3', name: 'HBO US East (Active Stereo EPG)', logo: '🎬', category: 'Movies', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', quality: '1080p', online: true },
  { id: 'ch-4', name: 'ESPN US Sports Active HD', logo: '🏈', category: 'Sports', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', quality: '1080p', online: true },
  { id: 'ch-5', name: 'BBC One UK HD Live', logo: '🇬🇧', category: 'Entertainment', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', quality: '1080p', online: true },
  { id: 'ch-6', name: 'Discovery Channel Ultimate 4K', logo: '🌍', category: 'Science', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', quality: '4K', online: true },
  { id: 'ch-7', name: 'CNN International News 24/7', logo: '📰', category: 'News', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', quality: '1080p', online: true },
  { id: 'ch-8', name: 'Disney Channel HD France Latino', logo: '🏰', category: 'Kids', streamUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback.mp4', quality: '720p', online: true }
];

export const COMPAT_DEVICES = [
  {
    id: 'tv',
    name: 'Smart TV',
    description: 'Samsung, LG, Sony, Android TV, Hisense, and Apple TV.',
    logo: '📺',
    steps: ['Install IPTV Smarters Pro or Smart IPTV app from your Store.', 'Enter your account server link and active credentials.', 'Enjoy instant 4K access!']
  },
  {
    id: 'mobile',
    name: 'Smartphones & Tablets',
    description: 'Compatible with all Android devices, iPhones & iPads.',
    logo: '📱',
    steps: ['Download IPTV Smarters Pro from Play Store or App Store.', 'Sign in using the dynamic codes shown in your billing cabinet.', 'Supports offline lists & active parental controls.']
  },
  {
    id: 'firestick',
    name: 'Amazon Fire Stick',
    description: 'Optimized for Fire TV & Fire Stick 4K Max formats.',
    logo: '⚡',
    steps: ['Enable "Apps from Unknown Sources" on firestick settings.', 'Install Downloader app, search and download "smarters.apk".', 'Copy-paste code and start streaming with active secure firewalls.']
  },
  {
    id: 'pc',
    name: 'PC & Mac',
    description: 'Excellent performance on Windows and macOS.',
    logo: '💻',
    steps: ['Install VLC Player or IPTV Smarters desktop version.', 'Load your custom .m3u playlist file or enter credentials.', 'Configure multi-screen streams seamlessly.']
  },
  {
    id: 'mag',
    name: 'MAG & Formuler',
    description: 'Fully supports MAG 250, 254, Formuler Z-boxes & STB portal paths.',
    logo: '📦',
    steps: ['Go to MAG system settings -> servers -> portals.', 'Set Portal 1 name as "Aura IPTV" and copy-paste portal server URL.', 'Reboot device with remote and start streaming instantly.']
  }
];

export const MOCK_GENRES = ['All', 'Action', 'Adventure', 'Sci-Fi', 'Horror', 'Thriller', 'Drama', 'Romance', 'Sports'];
