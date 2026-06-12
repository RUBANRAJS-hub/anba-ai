import React from 'react';
import { useSimulator } from '../context/SimulatorContext';
import { Trophy, Lock, Sparkles, CheckCircle } from 'lucide-react';

const ALL_ACHIEVEMENTS = [
  { id: 'first_chat', title: 'First Connection', desc: 'Sent your very first message', icon: '💬' },
  { id: 'daily_streak', title: 'Daily Streak', desc: 'Maintained a multi-day streak', icon: '🔥' },
  { id: 'gift_sent', title: 'Generous Partner', desc: 'Sent a sweet virtual gift', icon: '🎁' },
  { id: 'date_done', title: 'Romantic Date', desc: 'Went on a romantic virtual date', icon: '🕯️' },
  { id: 'movie_watched', title: 'Movie Buddy', desc: 'Watched a movie together', icon: '🍿' },
  { id: 'game_played', title: 'Fun & Games', desc: 'Played a mini-game together', icon: '🎮' },
  { id: 'high_relationship', title: 'Growing Love', desc: 'Reached 70% Love on any character', icon: '💖' },
  { id: 'romantic_master', title: 'Romantic Master', desc: 'Reached 100% Love on any character', icon: '👑' },
  { id: 'romantic_masters', title: 'Romantic Masters', desc: 'Reached 100% Love on multiple characters', icon: '👑' }

];

export default function Achievements() {
  const { unlockedAchievements, settings } = useSimulator();

  const totalAchievements = ALL_ACHIEVEMENTS.length;
  const unlockedCount = unlockedAchievements.length;
  const progressPct = Math.round((unlockedCount / totalAchievements) * 100);

  return (
    <div className="glass-panel rounded-2xl p-5 select-none relative overflow-hidden flex flex-col h-full space-y-4">
      {/* Background glow decorator */}
      <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-glow-purple opacity-20 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header with progress count */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="space-y-0.5">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-pink-400" /> Unlock Badges
          </h3>
          <p className="text-[10px] text-gray-400">Complete milestones with your girlfriends</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-pink-400">{unlockedCount}/{totalAchievements}</span>
          <p className="text-[8px] text-gray-500 font-semibold uppercase tracking-wider">Unlocked</p>
        </div>
      </div>

      {/* Progress slider bar */}
      <div className="space-y-1">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-gray-500 font-medium">
          <span>0% Completed</span>
          <span className="text-pink-300 font-bold">Daily Streak: {settings.streak || 1} 🔥</span>
          <span>100% Master</span>
        </div>
      </div>

      {/* Badges Grid list */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
        {ALL_ACHIEVEMENTS.map(ach => {
          const isUnlocked = unlockedAchievements.includes(ach.id);

          return (
            <div
              key={ach.id}
              className={`p-3 rounded-2xl flex items-center justify-between border transition-all duration-300 ${
                isUnlocked
                  ? 'bg-gradient-to-r from-pink-500/5 to-purple-500/5 border-pink-500/10 shadow-[0_0_15px_rgba(244,63,94,0.05)]'
                  : 'bg-white/5 border-white/5 opacity-55'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Badge Icon bubble */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-inner select-none ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/20'
                      : 'bg-white/5 border border-white/5'
                  }`}
                >
                  {isUnlocked ? ach.icon : <Lock className="w-4 h-4 text-gray-600" />}
                </div>

                <div>
                  <h4 className={`text-xs font-bold ${isUnlocked ? 'text-gray-100' : 'text-gray-500'}`}>
                    {ach.title}
                  </h4>
                  <p className="text-[9px] text-gray-400 mt-0.5">
                    {ach.desc}
                  </p>
                </div>
              </div>

              {isUnlocked && (
                <CheckCircle className="w-4.5 h-4.5 text-emerald-400 fill-emerald-500/10" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
