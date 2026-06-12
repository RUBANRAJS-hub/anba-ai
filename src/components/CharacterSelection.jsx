import React from 'react';
import { CHARACTERS, useSimulator } from '../context/SimulatorContext';
import { Sparkles, Heart, ChevronRight, MessageSquareHeart } from 'lucide-react';
import FloatingHearts from './FloatingHearts';

export default function CharacterSelection() {
  const { charStates, setActiveCharId } = useSimulator();

  return (
    <div className="relative min-h-screen bg-girlfriend-dark-bg p-6 text-white overflow-hidden flex flex-col justify-between">
      {/* Glow Backdrops */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-glow-pink opacity-50 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-glow-purple opacity-50 blur-3xl pointer-events-none"></div>

      <FloatingHearts ambient={true} interactive={true} />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex-grow flex flex-col justify-center py-8">
        {/* Header Title */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" /> Choose Your Companion
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Select Your <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Partner</span>
          </h2>
          <p className="text-gray-400 text-xs md:text-sm max-w-md mx-auto">
            Choose a partner that matches your vibe and begin your conversation journey.
          </p>
        </div>

        {/* Character Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {CHARACTERS.map(char => {
            const state = charStates[char.id] || { love: 0 };
            
            return (
              <div
                key={char.id}
                onClick={() => setActiveCharId(char.id)}
                className="group relative rounded-2xl glass-card overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-300 transform hover:scale-[1.03] active:scale-95 border border-white/5 hover:border-pink-500/30"
              >
                {/* Background decorative glow on hover */}
                <div className="absolute -inset-px bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div>
                  {/* Avatar Image Header */}
                  <div className="relative h-48 w-full bg-gradient-to-b from-purple-900/40 to-girlfriend-dark-bg/80 overflow-hidden flex items-center justify-center">
                    <img
                      src={char.avatar}
                      alt={char.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Status Badge */}
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/80 backdrop-blur-sm text-white flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Online
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-xl font-bold tracking-wide group-hover:text-pink-400 transition-colors">
                        {char.name}
                      </h3>
                      <span className="text-xs text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded-full font-medium">
                        Age: {char.age}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 font-medium">
                      {char.personality}
                    </p>

                    {/* Interests tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {char.interests.slice(0, 3).map(interest => (
                        <span
                          key={interest}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-gray-400"
                        >
                          #{interest}
                        </span>
                      ))}
                      {char.interests.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-gray-400">
                          +{char.interests.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Stats Footer */}
                <div className="px-5 pb-5 pt-2 border-t border-white/5 bg-girlfriend-dark-bg/20">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
                      Love Meter
                    </span>
                    <span className="font-semibold text-pink-400">{state.love}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${state.love}%` }}
                    />
                  </div>

                  <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-pink-500/10 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600 border border-pink-500/20 group-hover:border-transparent text-xs font-bold transition-all duration-300">
                    Connect Now <MessageSquareHeart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <footer className="relative z-10 text-center py-2 text-[10px] text-gray-600">
        All characters are AI generated and purely virtual.
      </footer>
    </div>
  );
}
