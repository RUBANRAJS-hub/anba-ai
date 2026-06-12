import React, { useState, useEffect, useRef } from 'react';
import { useSimulator, CHARACTERS } from '../context/SimulatorContext';
import { fetchGeminiResponse, fetchQuickReplies, getDefaultQuickReplies } from '../utils/gemini';
import { Send, Smile, ArrowLeft, MoreVertical, Sparkles, AlertCircle, Heart } from 'lucide-react';

export default function ChatInterface() {
  const { 
    activeCharId, 
    setActiveCharId, 
    charStates, 
    addMessage, 
    adjustMeters 
  } = useSimulator();

  const activeChar = CHARACTERS.find(c => c.id === activeCharId);
  const charState = charStates[activeCharId] || { messages: [], love: 20, trust: 30, friendship: 40 };

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [quickReplies, setQuickReplies] = useState(() => getDefaultQuickReplies(activeCharId));
  const [loadingReplies, setLoadingReplies] = useState(false);

  const messagesEndRef = useRef(null);

  // Dynamic quick replies fetching
  useEffect(() => {
    let active = true;

    const loadQuickReplies = async () => {
      const msgs = charState.messages;
      if (!msgs || msgs.length === 0) {
        setQuickReplies(getDefaultQuickReplies(activeCharId));
        return;
      }

      const lastMsg = msgs[msgs.length - 1];
      if (lastMsg.sender === 'girlfriend') {
        setLoadingReplies(true);
        try {
          const replies = await fetchQuickReplies(
            activeCharId,
            msgs,
            activeChar.name,
            activeChar.personality
          );
          if (active) {
            setQuickReplies(replies);
          }
        } catch (error) {
          console.error("Error loading quick replies:", error);
          if (active) {
            setQuickReplies(getDefaultQuickReplies(activeCharId));
          }
        } finally {
          if (active) {
            setLoadingReplies(false);
          }
        }
      }
    };

    loadQuickReplies();

    return () => {
      active = false;
    };
  }, [activeCharId, charState.messages]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [charState.messages, isTyping]);

  if (!activeChar) return null;

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Send user message
    addMessage(activeCharId, 'user', text);
    setInputText('');
    setShowEmojiPicker(false);

    // Simulate girlfriend typing
    setIsTyping(true);

    // Dynamic delay based on text length for realism
    const delay = Math.min(3000, Math.max(1000, text.length * 50));
    
    // Check if the user is saying something cute/affectionate
    const lowerText = text.toLowerCase();
    let loveAdjustment = 0;
    let trustAdjustment = 0;
    let friendshipAdjustment = 0;

    if (lowerText.includes('love') || lowerText.includes('pudikum') || lowerText.includes('kadhal')) {
      loveAdjustment = 3;
    }
    if (lowerText.includes('sorry') || lowerText.includes('namburen') || lowerText.includes('trust')) {
      trustAdjustment = 2;
    }
    if (lowerText.includes('miss you') || lowerText.includes('da') || lowerText.includes('ma')) {
      friendshipAdjustment = 2;
    }

    setTimeout(async () => {
      try {
        const response = await fetchGeminiResponse(
          activeCharId,
          charState.messages.concat({ sender: 'user', text }),
          activeChar.systemPrompt
        );
        addMessage(activeCharId, 'girlfriend', response);
        
        // Trigger meter gains based on conversation context
        if (loveAdjustment || trustAdjustment || friendshipAdjustment) {
          adjustMeters(activeCharId, loveAdjustment, trustAdjustment, friendshipAdjustment);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsTyping(false);
      }
    }, delay);
  };

  const insertEmoji = (emoji) => {
    setInputText(prev => prev + emoji);
  };

  const cuteEmojis = ['❤️', '💖', '😘', '🌸', '🎮', '☕', '🍫', '🧸', '🌹', '🍿', '😉', '😳', '👉👈', '✨', '🥰', '🔥'];

  return (
    <div className="flex flex-col h-full bg-girlfriend-dark-bg border-x border-white/5 relative">
      {/* Background Glow */}
      <div className="absolute top-[30%] right-[-10px] w-40 h-40 bg-glow-pink opacity-25 blur-3xl pointer-events-none"></div>

      {/* Top Header bar */}
      <header className="flex items-center justify-between px-4 py-3 bg-girlfriend-dark-card/90 backdrop-blur-md border-b border-white/5 z-15">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveCharId(null)}
            className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* Avatar and Name */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img 
                src={activeChar.avatar} 
                alt={activeChar.name} 
                className="w-10 h-10 rounded-full object-cover border border-pink-500/20"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-girlfriend-dark-bg" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-none flex items-center gap-1">
                {activeChar.name}
                <Sparkles className="w-3 h-3 text-pink-400" />
              </h3>
              <p className="text-[10px] text-gray-400 mt-1 select-none">
                {isTyping ? 'Typing...' : activeChar.statusText}
              </p>
            </div>
          </div>
        </div>

        {/* Relationship mini meter */}
        <div className="flex items-center gap-2 bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-500/20 text-xs text-pink-400 font-semibold select-none">
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
          <span>Love: {charState.love}%</span>
        </div>
      </header>

      {/* Messages Thread list */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3 relative select-text">
        {charState.messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          
          return (
            <div 
              key={msg.id || index}
              className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm relative ${
                  isUser 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-tr-none' 
                    : 'bg-girlfriend-dark-card border border-white/5 text-gray-100 rounded-tl-none'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <div 
                  className={`text-[9px] mt-1 select-none text-right ${
                    isUser ? 'text-pink-100' : 'text-gray-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator bubble */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-girlfriend-dark-card border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 typing-dot" />
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 typing-dot" />
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Quick Replies list */}
      <div className="px-4 py-1.5 flex gap-2 overflow-x-auto select-none no-scrollbar bg-girlfriend-dark-bg/50 border-t border-white/5 items-center min-h-[44px]">
        {isTyping || loadingReplies ? (
          <div className="flex gap-2 animate-pulse">
            <div className="w-20 h-7 rounded-full bg-white/5" />
            <div className="w-24 h-7 rounded-full bg-white/5" />
            <div className="w-16 h-7 rounded-full bg-white/5" />
            <div className="w-28 h-7 rounded-full bg-white/5" />
          </div>
        ) : (
          quickReplies.map(reply => (
            <button
              key={reply}
              onClick={() => handleSend(reply)}
              disabled={isTyping}
              className="flex-shrink-0 text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-pink-500/10 hover:text-pink-300 border border-white/5 hover:border-pink-500/20 text-gray-400 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              {reply}
            </button>
          ))
        )}
      </div>

      {/* Message Inputs bar */}
      <footer className="p-3 bg-girlfriend-dark-card/90 backdrop-blur-md border-t border-white/5 relative z-10 select-none">
        {/* Simple inline emoji selector */}
        {showEmojiPicker && (
          <div className="absolute bottom-full left-4 mb-2 p-2.5 bg-girlfriend-dark-card border border-white/10 rounded-2xl flex flex-wrap gap-2 max-w-[280px] shadow-lg backdrop-blur-lg">
            {cuteEmojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="text-base hover:scale-125 transition-transform p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Emoji Picker toggle button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-xl text-gray-400 hover:text-white transition-colors ${
              showEmojiPicker ? 'bg-white/10 text-white' : 'hover:bg-white/5'
            }`}
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            placeholder={isTyping ? `${activeChar.name} is typing...` : `Message ${activeChar.name}...`}
            className="flex-1 bg-white/5 border border-white/5 focus:border-pink-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none placeholder-gray-500 transition-colors disabled:opacity-50"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:bg-white/5 disabled:text-gray-600 text-white transition-all flex items-center justify-center"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </footer>
    </div>
  );
}
