import React, { useState } from 'react';
import { SimulatorProvider, useSimulator, CHARACTERS } from './context/SimulatorContext';
import LandingPage from './components/LandingPage';
import CharacterSelection from './components/CharacterSelection';
import ChatInterface from './components/ChatInterface';
import DailyActivities from './components/DailyActivities';
import MiniGames from './components/MiniGames';
import ProfilePage from './components/ProfilePage';
import Achievements from './components/Achievements';
import Settings from './components/Settings';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Gamepad2, User, Trophy, Settings as SettingsIcon, LogOut, Award } from 'lucide-react';

function AppContent() {
  const { 
    activeCharId, 
    setActiveCharId, 
    charStates, 
    settings, 
    notification 
  } = useSimulator();

  const [started, setStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'activities' | 'games' | 'profile' | 'achievements' | 'settings'

  const activeChar = CHARACTERS.find(c => c.id === activeCharId);
  const charState = charStates[activeCharId] || { love: 20, trust: 30, friendship: 40 };

  // Determine global background classes
  const isLight = settings.theme === 'light';
  const bgClass = isLight 
    ? 'bg-gradient-to-tr from-pink-50 via-purple-50 to-pink-100 text-gray-800'
    : 'bg-[#07050e] text-white';

  const cardBgClass = isLight
    ? 'bg-white/80 border-pink-200/50 text-gray-800 shadow-lg'
    : 'bg-[#120e26]/40 border-white/5 text-white';

  // Screen 1: Landing Page
  if (!started && !activeCharId) {
    return <LandingPage onStart={() => setStarted(true)} />;
  }

  // Screen 2: Character Selection Page
  if (started && !activeCharId) {
    return (
      <div className={bgClass}>
        <CharacterSelection />
      </div>
    );
  }

  // Navigation Links for Side menu (Desktop) & Bottom bar (Mobile)
  const navItems = [
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'activities', label: 'Activities', icon: <Heart className="w-5 h-5" /> },
    { id: 'games', label: 'Mini Games', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'achievements', label: 'Badges', icon: <Trophy className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> }
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none overflow-x-hidden relative ${bgClass} transition-colors duration-500`}>
      {/* Decorative Glow elements */}
      {!isLight && (
        <>
          <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-glow-pink opacity-35 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-glow-purple opacity-35 blur-3xl pointer-events-none"></div>
        </>
      )}

      {/* Main Core Container */}
      <div className="flex-grow flex max-w-7xl w-full mx-auto p-4 md:p-6 gap-6 items-stretch self-center">
        
        {/* SIDE BAR PANEL (Desktop Only) */}
        <aside className={`hidden md:flex flex-col justify-between w-64 p-5 rounded-3xl border backdrop-blur-md z-10 ${cardBgClass}`}>
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-2 px-2">
              <Heart className="w-7 h-7 text-pink-500 fill-pink-500 animate-pulse" />
              <span className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Anbe.ai
              </span>
            </div>

            {/* Navigation options */}
            <nav className="space-y-1.5">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                      : isLight
                      ? 'text-gray-600 hover:bg-pink-100/50 hover:text-pink-600'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Go back to character selection */}
          <button
            onClick={() => setActiveCharId(null)}
            className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all border ${
              isLight
                ? 'border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                : 'border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LogOut className="w-4 h-4" /> Change Character
          </button>
        </aside>

        {/* CENTER COLUMN: MAIN INTERACTIVE VIEW */}
        <main className={`flex-1 flex flex-col rounded-3xl overflow-hidden border backdrop-blur-md relative z-10 ${
          activeTab === 'chat' ? 'bg-[#0f0c1b]/50 border-white/5' : cardBgClass
        }`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-grow h-full overflow-hidden"
            >
              {activeTab === 'chat' && <ChatInterface />}
              {activeTab === 'activities' && <DailyActivities />}
              {activeTab === 'games' && <MiniGames />}
              {activeTab === 'profile' && <ProfilePage />}
              {activeTab === 'achievements' && <Achievements />}
              {activeTab === 'settings' && <Settings />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* RIGHT COLUMN: QUICK STATUS CARD (Desktop Only) */}
        <aside className={`hidden lg:flex flex-col w-72 p-5 rounded-3xl border backdrop-blur-md z-10 justify-between ${cardBgClass}`}>
          <div className="space-y-5">
            {/* Quick avatar & catchphrase */}
            <div className="text-center space-y-3 pb-4 border-b border-white/5">
              <div className="relative inline-block">
                <img
                  src={activeChar.avatar}
                  alt={activeChar.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-pink-500/30 mx-auto shadow-md"
                />
                <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-girlfriend-dark-bg" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm">{activeChar.name}</h4>
                <p className="text-[10px] text-pink-400 font-semibold">{activeChar.personality}</p>
                <p className="text-[9px] text-gray-500 italic mt-1.5 px-3">"{activeChar.catchphrase}"</p>
              </div>
            </div>

            {/* Quick mini relationship sliders */}
            <div className="space-y-3">
              <h5 className="font-bold text-[10px] text-gray-400 uppercase tracking-wider">Quick Status</h5>
              
              {/* Love Meter */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">Love Meter</span>
                  <span className="text-pink-400">{charState.love}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500" style={{ width: `${charState.love}%` }} />
                </div>
              </div>

              {/* Trust Meter */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">Trust Meter</span>
                  <span className="text-blue-400">{charState.trust}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${charState.trust}%` }} />
                </div>
              </div>

              {/* Friendship Meter */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-400">Friendship Meter</span>
                  <span className="text-purple-400">{charState.friendship}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500" style={{ width: `${charState.friendship}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Gift Box shortcut */}
          <div className="p-3 bg-pink-500/5 border border-pink-500/10 rounded-2xl text-center space-y-2">
            <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Need a boost?</span>
            <button
              onClick={() => setActiveTab('activities')}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs tracking-wider transition-all transform hover:scale-[1.03] active:scale-95 shadow-md flex items-center justify-center gap-1.5"
            >
              🎁 Send a Gift!
            </button>
          </div>
        </aside>

      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (Mobile Only) */}
      <footer className={`md:hidden fixed bottom-0 left-0 right-0 py-2 border-t z-40 backdrop-blur-md flex items-center justify-around select-none ${cardBgClass}`}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors p-1 ${
              activeTab === item.id
                ? 'text-pink-500'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {item.icon}
            <span className="text-[8px] font-bold tracking-wide uppercase">{item.label}</span>
          </button>
        ))}
      </footer>

      {/* ACHIEVEMENT UNLOCKED NOTIFICATION TOAST POPUP */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-5 right-5 z-[999] glass-panel border-pink-500/30 p-4 rounded-2xl flex items-center gap-3.5 shadow-2xl bg-girlfriend-dark-card/90 max-w-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/20 flex items-center justify-center text-3xl shadow-inner select-none animate-bounce">
              {notification.icon}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-pink-400" />
                <h4 className="font-extrabold text-[9px] text-pink-400 uppercase tracking-widest leading-none">Badge Unlocked!</h4>
              </div>
              <h5 className="font-black text-xs text-white mt-1 leading-none">{notification.title}</h5>
              <p className="text-[9px] text-gray-300 mt-1 select-none leading-tight">{notification.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <SimulatorProvider>
      <AppContent />
    </SimulatorProvider>
  );
}
