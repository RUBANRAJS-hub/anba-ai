import React from 'react';
import { useSimulator, CHARACTERS } from '../context/SimulatorContext';
import { User, Heart, Shield, Users, MessageSquare, Gift, Calendar, Film, CalendarDays } from 'lucide-react';

export default function ProfilePage() {
  const { activeCharId, charStates } = useSimulator();
  const activeChar = CHARACTERS.find(c => c.id === activeCharId);
  const charState = charStates[activeCharId] || {
    love: 20, trust: 30, friendship: 40,
    chatsCount: 0, datesCount: 0, giftsCount: 0, moviesCount: 0, daysTogether: 1
  };

  if (!activeChar) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center text-gray-400">
        Please select a Girlfriend character first to view her profile.
      </div>
    );
  }

  // Calculate Relationship Stage Title
  const getRelationshipStage = (loveScore) => {
    if (loveScore >= 95) return { name: 'Soulmate 👑', desc: 'Iniya Thunai - Unseparable connection!' };
    if (loveScore >= 75) return { name: 'Girlfriend ❤️', desc: 'Anbanaval - You are officially dating!' };
    if (loveScore >= 50) return { name: 'Crush 💖', desc: 'Chella Kadhal - Feelings are mutual!' };
    if (loveScore >= 25) return { name: 'Close Friend 🤝', desc: 'Nalla Friend - Sharing jokes and coffee.' };
    return { name: 'New Connection 💬', desc: 'Stranger - Getting to know each other.' };
  };

  const stage = getRelationshipStage(charState.love);

  const stats = [
    { label: 'Chat messages', count: charState.chatsCount || charState.messages?.length || 0, icon: <MessageSquare className="w-4 h-4 text-blue-400" /> },
    { label: 'Dates completed', count: charState.datesCount || 0, icon: <Calendar className="w-4 h-4 text-purple-400" /> },
    { label: 'Gifts received', count: charState.giftsCount || 0, icon: <Gift className="w-4 h-4 text-pink-400" /> },
    { label: 'Movie nights', count: charState.moviesCount || 0, icon: <Film className="w-4 h-4 text-red-400" /> }
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 select-none relative overflow-hidden flex flex-col h-full space-y-5">
      {/* Background ambient light */}
      <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-glow-pink opacity-20 rounded-full blur-2xl pointer-events-none"></div>

      {/* Profile Header card layout */}
      <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-white/5">
        <img
          src={activeChar.avatar}
          alt={activeChar.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-pink-500/30 shadow-md"
        />
        <div>
          <h3 className="font-extrabold text-lg flex items-center justify-center gap-1">
            {activeChar.name}
            <span className="text-xs text-pink-400 font-medium bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded-full">
              Age: {activeChar.age}
            </span>
          </h3>
          <p className="text-xs text-pink-300 font-medium mt-1">{activeChar.personality}</p>
          <p className="text-[10px] text-gray-500 italic mt-2">"{activeChar.catchphrase}"</p>
        </div>
      </div>

      {/* Relationship status stage banner */}
      <div className="p-3 bg-pink-500/5 border border-pink-500/10 rounded-2xl text-center space-y-0.5">
        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Current Status</span>
        <h4 className="font-extrabold text-sm text-pink-400 leading-none">{stage.name}</h4>
        <p className="text-[10px] text-gray-400">{stage.desc}</p>
      </div>

      {/* Detailed Relationship Meters */}
      <div className="space-y-3.5">
        <h4 className="font-bold text-xs text-gray-300">Relationship Metrics</h4>
        
        {/* Love Meter */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> Love Meter
            </span>
            <span className="font-bold text-pink-400">{charState.love}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500" style={{ width: `${charState.love}%` }} />
          </div>
        </div>

        {/* Trust Meter */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-500 fill-blue-500" /> Trust Meter
            </span>
            <span className="font-bold text-blue-400">{charState.trust}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${charState.trust}%` }} />
          </div>
        </div>

        {/* Friendship Meter */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-500 fill-purple-500" /> Friendship Meter
            </span>
            <span className="font-bold text-purple-400">{charState.friendship}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500" style={{ width: `${charState.friendship}%` }} />
          </div>
        </div>
      </div>

      {/* Interaction logs stats */}
      <div className="space-y-3 flex-1 flex flex-col justify-end">
        <div className="flex items-center justify-between text-xs text-gray-300">
          <span className="font-bold">Interaction History</span>
          <span className="text-[10px] text-gray-500 flex items-center gap-1">
            <CalendarDays className="w-3 h-3" /> Day {charState.daysTogether || 1} together
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-white/5 flex items-center justify-center">
                {stat.icon}
              </span>
              <div>
                <div className="text-xs font-bold leading-none">{stat.count}</div>
                <div className="text-[9px] text-gray-500 mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
