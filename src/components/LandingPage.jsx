import React from 'react';
import { Heart, Sparkles, Shield, UserCheck, MessageCircleHeart } from 'lucide-react';
import FloatingHearts from './FloatingHearts';

export default function LandingPage({ onStart }) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-girlfriend-dark-bg p-6 text-white select-none">
      {/* Background ambient glow points */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-glow-pink opacity-70 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-glow-purple opacity-70 blur-3xl pointer-events-none"></div>
      
      {/* Background Hearts */}
      <FloatingHearts ambient={true} interactive={true} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-5xl mx-auto py-4">
        <div className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-pink-500 fill-pink-500 animate-pulse" />
          <span className="font-extrabold text-2xl tracking-wide bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Anbe.ai
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel text-xs text-pink-300 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Gemini AI
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto my-auto py-12 gap-8">
        <div className="space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-pink-500/10 text-pink-400 border border-pink-500/20">
            💖 Pure Tanglish Dating Simulator
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Find Your Virtual <br/>
            <span className="bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Tanglish Partner
            </span>
          </h1>
          <p className="text-gray-400 max-w-md mx-auto text-sm md:text-base leading-relaxed">
            Unga favorites character select panni chat pannunga. Cute expressions, caring conversations, and exciting activities are waiting for you!
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onStart}
          className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:shadow-[0_0_40px_rgba(244,63,94,0.5)] transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300"></div>
          Start Your Story
          <MessageCircleHeart className="w-6 h-6 animate-bounce" />
        </button>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-6">
          <div className="glass-card p-5 rounded-2xl flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-base">Tanglish Conversations</h3>
            <p className="text-xs text-gray-400">
              Caring and romantic replies in fluent Tamil written in English script. Feels just like real texting!
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-base">Relationship Levels</h3>
            <p className="text-xs text-gray-400">
              Boost your Love, Trust, and Friendship score. Unlock new interaction milestones as you get closer.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl flex flex-col items-center text-center gap-3">
            <div className="p-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-base">100% Privacy</h3>
            <p className="text-xs text-gray-400">
              No servers, no databases. Everything is stored securely on your browser's LocalStorage.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-xs text-gray-500">
        © 2026 Anbe.ai. Developed with ❤️ in React.js and Gemini.
      </footer>
    </div>
  );
}
