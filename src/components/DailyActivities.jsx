import React, { useState } from 'react';
import { useSimulator, CHARACTERS } from '../context/SimulatorContext';
import { Gift, CalendarDays, Film, Award, Heart, Shield, HelpCircle, Trophy } from 'lucide-react';

const GIFTS = [
  { id: 'rose', name: 'Red Rose', icon: '🌹', cost: 'Free', loveBonus: 8, trustBonus: 3, friendshipBonus: 4, msg: 'Priya blushing and taking the rose!' },
  { id: 'chocolate', name: 'Dark Chocolates', icon: '🍫', cost: 'Free', loveBonus: 12, trustBonus: 5, friendshipBonus: 6, msg: 'Aww, enaku chocolate romba pudikum! Thank you da.' },
  { id: 'teddy', name: 'Teddy Bear', icon: '🧸', cost: 'Free', loveBonus: 18, trustBonus: 10, friendshipBonus: 8, msg: 'Cute teddy bear! Inime idhu en koodaye thaan thoongum.' },
  { id: 'ring', name: 'Promise Ring', icon: '💍', cost: 'Free', loveBonus: 30, trustBonus: 20, friendshipBonus: 10, msg: 'Promise ring ah?! Blushing deeply... En kooda eppovum irupiya?' }
];

const DATES = [
  {
    id: 'beach',
    name: 'Beach Sunset Walk',
    icon: '🌅',
    loveBonus: 15, trustBonus: 8, friendshipBonus: 10,
    background: 'linear-gradient(180deg, #fdba74 0%, #f472b6 100%)',
    dialogues: {
      maya: "Eyy! Waves kooda race viklada polama da? Nan fast ah run pannuven. Un kooda hand hold panni nadakradhu semma XP gain! 🌊🎮",
      priya: "Intha beach sunset pathute irukalam anbe. Cool breeze la filter coffee share panni kudippoma? Caring look... ☕🌅",
      diya: "Sun and waves sand la meet panrathu semma art mathiri iruku da. Un portrait sunset light la sketch panna polama? 🎨💖",
      anjali: "Sunset shadows look like wave functions in physics. Nerd joke, haha! Aana nee en kooda nadakrathu thaan perfect logic. 🧪🥰",
      kavya: "Beach wind romba heavy ah irukku... konjam cold ah irukku... un hand hold pannikava? Blushing... 👉👈❄️"
    }
  },
  {
    id: 'cafe',
    name: 'Cozy Cafe Date',
    icon: '☕',
    loveBonus: 12, trustBonus: 10, friendshipBonus: 12,
    background: 'linear-gradient(180deg, #b45309 0%, #78350f 100%)',
    dialogues: {
      maya: "Intha cafe la wifi speed ultimate! Gamer fuel double chocolate cookie enaku order pannidunga. Vanga play pannalam! 🍪🎮",
      priya: "Filter coffee and warm brownie select panni thandha en partner thaan best! Neenga ready ah share panna? Sweet look. ☕🍰",
      diya: "Cafe walls laye graffiti designs drawing pathiya? Acoustic guitar song onnu unakaaga sing pannava? 🎸☕",
      anjali: "Let's debug our lives over some triple espresso. Spoiler: there are no compilation errors when you are here. 😉☕",
      kavya: "Soft piano music play panranga intha cafe la... quiet ah cute ah irukku... un face pathute irukalam... 🌸😳"
    }
  },
  {
    id: 'dinner',
    name: 'Candlelight Dinner',
    icon: '🕯️',
    loveBonus: 25, trustBonus: 15, friendshipBonus: 8,
    background: 'linear-gradient(180deg, #581c87 0%, #1e1b4b 100%)',
    dialogues: {
      maya: "Wow! Dinner set premium levels! Iniku nan gaming stream drop pannen strictly unkooda time spend panna thaan! Love you! 💕🎮",
      priya: "En anbe... candles light and roses layout romba beautiful. Un kooda intha special food share panrathu ultimate bliss. 🕯️❤️",
      diya: "Candlelight shadows un face la fall aagum podhu nee artistic masterpiece polaruka da. Toast to our beautiful connection! 🥂🎨",
      anjali: "Candlelight lighting values represent elegant vector calculus equations. Witty smile... You look exceptionally beautiful tonight. 😉✨",
      kavya: "Candlelight light la un eye glow paarka romba sweet ah irukku... shy... promise to be with me forever? 💍🌸"
    }
  }
];

const MOVIES = [
  { id: 'romcom', name: 'Romantic Comedy', icon: '💖', loveBonus: 12, trustBonus: 5, friendshipBonus: 10 },
  { id: 'horror', name: 'Spooky Horror', icon: '👻', loveBonus: 15, trustBonus: 8, friendshipBonus: 8 },
  { id: 'scifi', name: 'Mind-bending Sci-Fi', icon: '🚀', loveBonus: 10, trustBonus: 6, friendshipBonus: 12 }
];

export default function DailyActivities() {
  const { activeCharId, performActivity, charStates } = useSimulator();
  const activeChar = CHARACTERS.find(c => c.id === activeCharId);
  const charState = charStates[activeCharId] || { love: 20, trust: 30, friendship: 40 };

  const [activeTab, setActiveTab] = useState('gift'); // 'gift' | 'date' | 'movie'
  const [activeDateModal, setActiveDateModal] = useState(null);
  const [movieNightState, setMovieNightState] = useState(null); // null | 'watching' | 'done'
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [giftFeedback, setGiftFeedback] = useState(null);

  if (!activeChar) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center text-gray-400">
        Please select a Girlfriend character first to interact with daily activities.
      </div>
    );
  }

  const handleSendGift = (gift) => {
    performActivity(activeCharId, 'gift', gift);
    setGiftFeedback({
      giftName: gift.name,
      icon: gift.icon,
      dialogue: gift.msg,
      loveBonus: gift.loveBonus
    });
    setTimeout(() => {
      setGiftFeedback(null);
    }, 4500);
  };

  const handleStartDate = (date) => {
    setActiveDateModal(date);
    performActivity(activeCharId, 'date', date);
  };

  const handleStartMovie = (movie) => {
    setSelectedMovie(movie);
    setMovieNightState('watching');
    
    // Simulate movie playing for 4 seconds
    setTimeout(() => {
      setMovieNightState('done');
      performActivity(activeCharId, 'movie', movie);
    }, 4000);
  };

  // Movie quotes specific to characters
  const getMovieComment = (charId, genre) => {
    if (genre === 'romcom') {
      if (charId === 'maya') return "Aww! Hero dynamic levels high da. Aana nee real life la thaan clutch pro lover! 💕";
      if (charId === 'priya') return "Indha movie scene romba heart-touching. Real life layum nan unna eppovum support pannuven anbe. 🥺❤️";
      if (charId === 'diya') return "Love story colors and cinematography masterpiece da! Mathi mathi anbu tharathu thaan beautiful connection! 🎨💖";
      if (charId === 'anjali') return "Romantic plots are highly predictable, but spending time with you is the best random outcome! 😉☕";
      return "Indha scene... romba sweet... unna thaan think panradhu mind full ah... blushing... 👉👈🌸"; // kavya
    } else if (genre === 'horror') {
      if (charId === 'maya') return "Aiyoo! Horror ghost jumpscare! Nan game cover drop panni un shoulder la hide aagikava? 👻😱";
      if (charId === 'priya') return "Semma sound levels, bayama iruku da! En hand hold panniko, safe feel panni padupen. 🥺🧸";
      if (charId === 'diya') return "Ghost makeup patterns match dark watercolor designs. Aana un smile safe glow tharu da. 🎨👻";
      if (charId === 'anjali') return "Ghost physics are mathematically impossible. But holding you tightly is my natural reaction! 😉🕯️";
      return "Scream! Romba bayama iruku... un hugging close ah irundha nalla irukum... 😳👻"; // kavya
    } else { // scifi
      if (charId === 'maya') return "Whoa! Time warp graphics! Space shooter play panni dynamic mode lock pannuvom da! 🎮🚀";
      if (charId === 'priya') return "Future timeline interesting ah iruku da. Nan future full ah un koodave life share panna readya iruken! ☕🌌";
      if (charId === 'diya') return "Space colors representation and constellations drawings design ultimate! Sing list lyrics ready. 🌌🎨";
      if (charId === 'anjali') return "Quantum teleportation formulas logic elegant ah compile pannirkanga. Let's merge orbits, smart boy/girl! 💡🚀";
      return "Stars constellations... romba space beautiful... un kooda stargazing panna memories trigger aagudhu... ✨🌸"; // kavya
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 select-none relative overflow-hidden flex flex-col h-full">
      {/* Background Hearts decorative */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-glow-pink opacity-10 rounded-full blur-2xl"></div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 pb-3 mb-4 gap-2">
        <button
          onClick={() => setActiveTab('gift')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'gift' 
              ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Gift className="w-3.5 h-3.5" /> Send Gift
        </button>
        <button
          onClick={() => setActiveTab('date')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'date' 
              ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5" /> Go on Date
        </button>
        <button
          onClick={() => setActiveTab('movie')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'movie' 
              ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Film className="w-3.5 h-3.5" /> Watch Movie
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* SEND GIFT TAB */}
        {activeTab === 'gift' && (
          <div className="space-y-4">
            <div className="text-center py-2 space-y-1">
              <h3 className="font-bold text-sm">Send a Virtual Gift</h3>
              <p className="text-[10px] text-gray-400">Increase relationship values instantly!</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {GIFTS.map(gift => (
                <button
                  key={gift.id}
                  onClick={() => handleSendGift(gift)}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl glass-card hover:border-pink-500/30 text-center gap-2 group transition-all"
                >
                  <span className="text-3xl group-hover:scale-125 transition-transform duration-300">
                    {gift.icon}
                  </span>
                  <span className="font-bold text-xs leading-none">{gift.name}</span>
                  <span className="text-[9px] text-pink-400 font-semibold px-2 py-0.5 rounded-full bg-pink-500/10">
                    +{gift.loveBonus}% Love
                  </span>
                </button>
              ))}
            </div>

            {/* Gift Feedback Dialog bubble */}
            {giftFeedback && (
              <div className="mt-4 p-3.5 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-start gap-3 animate-fade-in">
                <span className="text-2xl mt-1">{giftFeedback.icon}</span>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-pink-300">Gift Delivered successfully!</h4>
                  <p className="text-xs text-gray-100 italic">"{getMovieComment(activeCharId, 'romcom') ? activeChar.name : 'Girlfriend'}: {giftFeedback.dialogue}"</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* GO ON DATE TAB */}
        {activeTab === 'date' && (
          <div className="space-y-4">
            <div className="text-center py-2 space-y-1">
              <h3 className="font-bold text-sm">Select Date Destination</h3>
              <p className="text-[10px] text-gray-400">Simulate beautiful memories and unlock visual scenes!</p>
            </div>

            <div className="space-y-3">
              {DATES.map(date => (
                <button
                  key={date.id}
                  onClick={() => handleStartDate(date)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl glass-card hover:border-purple-500/30 group text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2.5 rounded-xl bg-purple-500/10 group-hover:scale-110 transition-transform">
                      {date.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs">{date.name}</h4>
                      <p className="text-[9px] text-gray-400">Increase massive meters & trigger dialog</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-purple-400 font-bold px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                    +{date.loveBonus}% Love
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* WATCH MOVIE TAB */}
        {activeTab === 'movie' && (
          <div className="space-y-4">
            <div className="text-center py-2 space-y-1">
              <h3 className="font-bold text-sm">Simulate Movie Night</h3>
              <p className="text-[10px] text-gray-400">Watch cozy films together and share thoughts!</p>
            </div>

            {movieNightState === null && (
              <div className="space-y-3">
                {MOVIES.map(movie => (
                  <button
                    key={movie.id}
                    onClick={() => handleStartMovie(movie)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl glass-card hover:border-pink-500/30 group text-left transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2.5 rounded-xl bg-pink-500/10 group-hover:scale-110 transition-transform">
                        {movie.icon}
                      </span>
                      <div>
                        <h4 className="font-bold text-xs">{movie.name}</h4>
                        <p className="text-[9px] text-gray-400">Cozy cinema comments reaction</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-pink-400 font-bold px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">
                      +{movie.loveBonus}% Love
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Movie Playing Cinema Screen */}
            {movieNightState === 'watching' && selectedMovie && (
              <div className="rounded-2xl border border-white/10 overflow-hidden bg-black aspect-video flex flex-col items-center justify-center text-center p-4 relative shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent animate-pulse-slow"></div>
                <Film className="w-10 h-10 text-pink-500 animate-spin-slow mb-2 relative z-10" />
                <span className="text-xs font-bold text-gray-300 relative z-10">Watching {selectedMovie.name} together...</span>
                <span className="text-[9px] text-gray-500 mt-1 relative z-10">Girlfriend is typing live reactions...</span>
              </div>
            )}

            {/* Movie Done Screen */}
            {movieNightState === 'done' && selectedMovie && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-pink-500/20 overflow-hidden bg-girlfriend-dark-card p-4 text-center space-y-3 relative shadow-lg">
                  <span className="text-3xl">🍿🎬</span>
                  <h4 className="text-sm font-bold text-pink-400">Movie finished!</h4>
                  <p className="text-xs text-gray-200 italic">
                    "{activeChar.name}: {getMovieComment(activeCharId, selectedMovie.id)}"
                  </p>
                </div>
                <button
                  onClick={() => setMovieNightState(null)}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold border border-white/5 transition-all text-center"
                >
                  Watch Another Movie
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Date Visual Novel Modal */}
      {activeDateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg rounded-3xl overflow-hidden border border-white/15 shadow-2xl relative flex flex-col justify-between"
            style={{
              background: activeDateModal.background,
              minHeight: '400px'
            }}
          >
            {/* Header Overlay */}
            <div className="p-4 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between text-white">
              <span className="font-extrabold text-sm flex items-center gap-1.5">
                {activeDateModal.icon} Date Spot: {activeDateModal.name}
              </span>
              <span className="text-[10px] font-bold bg-pink-500 px-2 py-0.5 rounded-full">
                Love +{activeDateModal.loveBonus}%
              </span>
            </div>

            {/* Girlfriend Portrait Frame */}
            <div className="flex-1 flex items-end justify-center py-4 relative">
              <img
                src={activeChar.avatar}
                alt={activeChar.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-white/20 shadow-lg animate-float-medium"
              />
            </div>

            {/* Dialouge text box footer */}
            <div className="p-5 bg-black/75 backdrop-blur-md border-t border-white/10 text-white space-y-3">
              <h4 className="font-extrabold text-pink-400 text-sm tracking-wide flex items-center gap-1">
                {activeChar.name} <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              </h4>
              <p className="text-xs text-gray-100 leading-relaxed italic">
                "{activeDateModal.dialogues[activeCharId] || 'Very beautiful sunset, thank you for taking me here da!'}"
              </p>
              <button
                onClick={() => setActiveDateModal(null)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-xs tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-md"
              >
                Close Date Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
