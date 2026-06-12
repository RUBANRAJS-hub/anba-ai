import React, { useState } from 'react';
import { useSimulator } from '../context/SimulatorContext';
import { Settings as SettingsIcon, Volume2, VolumeX, Moon, Sun, Trash2, AlertTriangle, Key, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { testApiKey } from '../utils/gemini';

export default function Settings() {
  const { settings, toggleSound, toggleTheme, resetAllData, updateSettings } = useSimulator();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(settings.geminiApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const isLight = settings.theme === 'light';

  const handleSaveAndTest = async () => {
    if (!apiKeyInput.trim()) {
      updateSettings({ geminiApiKey: '' });
      setTestStatus('success');
      setErrorMessage('');
      return;
    }
    setTestStatus('loading');
    setErrorMessage('');
    try {
      const result = await testApiKey(apiKeyInput);
      if (result.success) {
        updateSettings({ geminiApiKey: apiKeyInput.trim() });
        setTestStatus('success');
      } else {
        setTestStatus('error');
        setErrorMessage(result.error || 'Failed to validate API Key');
      }
    } catch (e) {
      setTestStatus('error');
      setErrorMessage(e.message || 'Validation failed');
    }
  };

  const inputBgClass = isLight 
    ? 'bg-pink-50/50 border-pink-200/60 text-gray-800 focus:border-pink-500/60' 
    : 'bg-[#07050e]/40 border-white/5 text-white focus:border-pink-500/40';

  return (
    <div className="glass-panel rounded-2xl p-5 select-none relative overflow-hidden flex flex-col h-full justify-between">
      {/* Background glow decorator */}
      <div className="absolute top-[20%] left-[-10%] w-24 h-24 bg-glow-purple opacity-10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="space-y-5 flex-grow">
        {/* Header */}
        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
          <SettingsIcon className="w-4.5 h-4.5 text-pink-400" />
          <h3 className="font-bold text-sm">System Settings</h3>
        </div>

        {/* Options list */}
        <div className="space-y-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-gray-200">Sound Effects</h4>
              <p className="text-[9px] text-gray-400">Play sweet alerts on message receipt & levels</p>
            </div>
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl transition-all ${
                settings.sound
                  ? 'bg-pink-500 text-white shadow-sm'
                  : 'bg-white/5 text-gray-500 hover:text-white'
              }`}
            >
              {settings.sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Theme Mode Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-gray-200">Theme Palette</h4>
              <p className="text-[9px] text-gray-400">Choose between Synthwave Dark & Cyber Light</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/5 text-pink-400 hover:bg-pink-500/10 transition-all flex items-center gap-1 text-[10px] font-bold"
            >
              {settings.theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5" /> Dark
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-yellow-400" /> Light
                </>
              )}
            </button>
          </div>

          {/* Gemini API Key config */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-pink-400" />
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-gray-200">Gemini API Key</h4>
                <p className="text-[9px] text-gray-400">Add your own key for live, smart responses</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Paste your API key here..."
                  className={`w-full border rounded-xl pl-3 pr-10 py-2 text-xs focus:outline-none transition-colors ${inputBgClass}`}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="button"
                onClick={handleSaveAndTest}
                disabled={testStatus === 'loading'}
                className="px-3.5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs tracking-wider transition-all disabled:opacity-50 flex-shrink-0"
              >
                {testStatus === 'loading' ? 'Testing...' : 'Test & Save'}
              </button>
            </div>

            {/* Status alerts */}
            {testStatus === 'success' && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                <Check className="w-3.5 h-3.5" />
                <span>API Key saved and validated successfully! 🎉</span>
              </div>
            )}
            {testStatus === 'error' && (
              <div className="flex items-start gap-1.5 text-[10px] font-medium text-rose-400 bg-rose-500/5 p-2 rounded-lg border border-rose-500/10">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span className="leading-tight">Error: {errorMessage}</span>
              </div>
            )}

            <div className="text-[9px] text-gray-500 font-medium">
              Don't have an API key? Get a free one from{' '}
              <a 
                href="https://aistudio.google.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-pink-400 hover:underline inline-flex items-center gap-0.5 font-semibold"
              >
                Google AI Studio
              </a>.
            </div>
          </div>

          {/* Daily Streak display */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/15 flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-pink-300">Daily Login Streak</h4>
              <p className="text-[9px] text-gray-400 font-medium">Keep chatting every day to raise multiplier!</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-black text-pink-400">
              <span>{settings.streak || 1}</span>
              <span>🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wipe/Reset Data card */}
      <div className="pt-4 border-t border-white/5 bg-girlfriend-dark-bg/25">
        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold transition-all"
          >
            <Trash2 className="w-4 h-4" /> Reset Simulator Data
          </button>
        ) : (
          <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-3 animate-pulse-slow">
            <div className="flex items-start gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold">Are you absolutely sure?</h4>
                <p className="text-[9px] text-gray-400">This will permanently erase all chat history, relationship scores, and achievements from LocalStorage.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  resetAllData();
                  setShowConfirmReset(false);
                }}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] transition-all"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
