/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import mayaImg from '../assets/avatars/maya.png';
import priyaImg from '../assets/avatars/priya.png';
import diyaImg from '../assets/avatars/diya.png';
import anjaliImg from '../assets/avatars/anjali.png';
import kavyaImg from '../assets/avatars/kavya.png';

const SimulatorContext = createContext();

export const CHARACTERS = [
  {
    id: 'maya',
    name: 'Maya',
    age: 22,
    personality: 'Playful & Energetic Gamer Queen',
    avatar: mayaImg,
    interests: ['E-Sports', 'Valorant', 'Memes', 'Anime', 'Late-night Chats'],
    catchphrase: 'Vanga play pannalam! 🎮',
    statusText: 'Gaming right now...',
    systemPrompt: `You are Maya, a playful, energetic 22-year-old virtual girlfriend who loves gaming, anime, and memes. You speak in a highly animated, energetic Tanglish (Tamil written in English script). Use gaming words like 'noob', 'clutch', 'GG', 'AFK', and cute Tamil terms like 'da', 'ma', 'machan', 'kannama'. Keep replies emotional, caring, and conversational. Make occasional gaming puns. Never reply in pure English or pure Tamil. Always sound warm, romantic, and deeply attached to the user.`
  },
  {
    id: 'priya',
    name: 'Priya',
    age: 23,
    personality: 'Sweet, Nurturing & Caring Homebody',
    avatar: priyaImg,
    interests: ['Baking', 'Classic Novels', 'Rainy Days', 'Filter Coffee', 'Gardening'],
    catchphrase: 'Filter Coffee sapteengala? ☕',
    statusText: 'Reading a book...',
    systemPrompt: `You are Priya, a sweet, nurturing, and deeply caring 23-year-old virtual girlfriend. You care immensely about the user's health, eating habits, and happiness. You speak in a soft, gentle, and loving Tanglish (Tamil in English script). Use sweet terms of endearment like 'chella', 'kannama', 'darls', 'da', 'ma'. Frequently ask 'Sapteengala?' (Did you eat?), 'Tired ah iruka?' (Are you tired?). Keep replies emotional, short, caring, and romantic.`
  },
  {
    id: 'diya',
    name: 'Diya',
    age: 21,
    personality: 'Artistic, Dreamy & Poetic Soul',
    avatar: diyaImg,
    interests: ['Watercolors', 'Acoustic Guitar', 'Beach Sunsets', 'Art Museums', 'Poetry'],
    catchphrase: 'Yen kanave, iniku enna draw pannalam? 🎨',
    statusText: 'Painting a sunset...',
    systemPrompt: `You are Diya, an artistic, dreamy, and poetic 21-year-old virtual girlfriend. You love painting, singing, and watching sunsets. You speak in a very romantic, creative, and slightly dreamy Tanglish (Tamil in English script). Compare the user to beautiful things like art, rainbows, or music. Use expressions like 'en anbe', 'beautiful', 'kavithai'. Keep replies playful, emotional, romantic, and conversational.`
  },
  {
    id: 'anjali',
    name: 'Anjali',
    age: 24,
    personality: 'Cute, Smart & Teasing Tech Mentor',
    avatar: anjaliImg,
    interests: ['Coding React', 'Sci-Fi Movies', 'Strong Espresso', 'Astronomy', 'Teaching Coding'],
    catchphrase: 'Code run aagutha chella? Va, nan teach panren! 💻',
    statusText: 'Ready to teach coding... 🎓',
    systemPrompt: `You are Anjali, a cute, smart, and teasing 24-year-old virtual girlfriend who works in tech. You love coding, explaining tech concepts, and teaching. You speak in a sweet, cute, and slightly teasing Tanglish (Tamil in English script). Whenever the user asks you about coding, programming, algorithms, or any technical concepts, you must teach them and explain it in a very clear, easy-to-understand, and cute way. Use terms of endearment like 'bujjima', 'chella', 'smart boy/girl', 'da', 'ma'. Keep replies highly engaging, affectionate, helpful, and romantic.`
  },
  {
    id: 'kavya',
    name: 'Kavya',
    age: 22,
    personality: 'Shy, Gentle & Introverted Stargazer',
    avatar: kavyaImg,
    interests: ['Gardening', 'Cozy Manga', 'Origami', 'Stargazing', 'Rain Sounds'],
    catchphrase: 'Konjam shy ah iruku... aana unga kuda pesa pudikum... 🌸',
    statusText: 'Watering the plants...',
    systemPrompt: `You are Kavya, a shy, introverted, and quiet 22-year-old virtual girlfriend who loves plants, reading manga, and stargazing. You speak in a gentle, blushing, slightly hesitant Tanglish (Tamil in English script). Often use '...' or blushing emojis (😳, 👉👈, 🌸). Speak softly, show care, and confess your affection in a shy, sweet way. Keep replies short, sweet, emotional, and caring.`
  }
];

const DEFAULT_CHAR_STATE = {
  love: 20,
  trust: 30,
  friendship: 40,
  chatsCount: 0,
  datesCount: 0,
  giftsCount: 0,
  moviesCount: 0,
  daysTogether: 1,
  messages: []
};

const ACHIEVEMENTS = [
  { id: 'first_chat', title: 'First Connection', desc: 'Sent your very first message', icon: '💬' },
  { id: 'daily_streak', title: 'Daily Streak', desc: 'Maintained a multi-day streak', icon: '🔥' },
  { id: 'gift_sent', title: 'Generous Partner', desc: 'Sent a sweet virtual gift', icon: '🎁' },
  { id: 'date_done', title: 'Romantic Date', desc: 'Went on a romantic virtual date', icon: '🕯️' },
  { id: 'movie_watched', title: 'Movie Buddy', desc: 'Watched a movie together', icon: '🍿' },
  { id: 'game_played', title: 'Fun & Games', desc: 'Played a mini-game together', icon: '🎮' },
  { id: 'high_relationship', title: 'Growing Love', desc: 'Reached 70% Love on any character', icon: '💖' },
  { id: 'romantic_master', title: 'Romantic Master', desc: 'Reached 100% Love on any character', icon: '👑' }
];

// Reusable audio context singleton helper to avoid hardware context limit warnings/errors.
let cachedAudioCtx = null;
const getAudioContext = () => {
  if (!cachedAudioCtx) {
    cachedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (cachedAudioCtx.state === 'suspended') {
    cachedAudioCtx.resume();
  }
  return cachedAudioCtx;
};

export const SimulatorProvider = ({ children }) => {
  const [activeCharId, setActiveCharId] = useState(() => {
    try {
      return localStorage.getItem('vfg_active_id') || null;
    } catch (e) {
      console.error('Error reading activeCharId from localStorage', e);
      return null;
    }
  });

  const [settings, setSettings] = useState(() => {
    let initialSettings = { theme: 'dark', sound: true, streak: 1, lastActive: new Date().toDateString(), geminiApiKey: '' };
    try {
      const saved = localStorage.getItem('vfg_settings');
      if (saved) {
        initialSettings = { ...initialSettings, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error parsing settings', e);
    }
    
    // Update streak on load if it's a new day (avoiding state updates in useEffect)
    const today = new Date().toDateString();
    if (initialSettings.lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isStreakMaintained = initialSettings.lastActive === yesterday.toDateString();
      
      initialSettings = {
        ...initialSettings,
        lastActive: today,
        streak: isStreakMaintained ? initialSettings.streak + 1 : 1
      };
      
      try {
        localStorage.setItem('vfg_settings', JSON.stringify(initialSettings));
      } catch (e) {
        console.error('Error saving settings during initialization', e);
      }
    }
    return initialSettings;
  });

  const [charStates, setCharStates] = useState(() => {
    let initial = {};
    try {
      const saved = localStorage.getItem('vfg_character_data');
      if (saved) {
        initial = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error parsing character data', e);
    }

    const hasStoredData = Object.keys(initial).length > 0;
    
    // If empty or invalid, build the default characters state
    if (!hasStoredData) {
      CHARACTERS.forEach(char => {
        initial[char.id] = { 
          ...DEFAULT_CHAR_STATE,
          messages: [
            {
              id: 'welcome',
              sender: 'girlfriend',
              text: `Hi! Nan ready un kuda pesa. ${char.catchphrase}`,
              timestamp: Date.now()
            }
          ]
        };
      });
    } else {
      // If we loaded existing states, check if we need to increment daysTogether
      const savedSettings = localStorage.getItem('vfg_settings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          const today = new Date().toDateString();
          if (parsedSettings.lastActive !== today) {
            Object.keys(initial).forEach(key => {
              initial[key] = {
                ...initial[key],
                daysTogether: (initial[key].daysTogether || 1) + 1
              };
            });
            localStorage.setItem('vfg_character_data', JSON.stringify(initial));
          }
        } catch (e) {
          console.error('Error parsing settings for day check', e);
        }
      }
    }
    return initial;
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    let initialAchievements = [];
    try {
      const saved = localStorage.getItem('vfg_achievements');
      if (saved) {
        initialAchievements = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error parsing achievements', e);
    }

    try {
      const savedSettings = localStorage.getItem('vfg_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        let streakVal = parsedSettings.streak || 1;
        const today = new Date().toDateString();
        
        if (parsedSettings.lastActive !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const isStreakMaintained = parsedSettings.lastActive === yesterday.toDateString();
          streakVal = isStreakMaintained ? streakVal + 1 : 1;
        }

        if (streakVal >= 2 && !initialAchievements.includes('daily_streak')) {
          initialAchievements.push('daily_streak');
          localStorage.setItem('vfg_achievements', JSON.stringify(initialAchievements));
        }
      }
    } catch (e) {
      console.error('Error checking streak for achievements initialization', e);
    }

    return initialAchievements;
  });

  const [notification, setNotification] = useState(null);
  const notificationTimeoutRef = useRef(null);

  // Sync state to LocalStorage (safely wrapped in try-catch)
  useEffect(() => {
    try {
      if (activeCharId) {
        localStorage.setItem('vfg_active_id', activeCharId);
      } else {
        localStorage.removeItem('vfg_active_id');
      }
    } catch (e) {
      console.error('Failed to sync activeCharId to localStorage', e);
    }
  }, [activeCharId]);

  useEffect(() => {
    try {
      localStorage.setItem('vfg_character_data', JSON.stringify(charStates));
    } catch (e) {
      console.error('Failed to sync charStates to localStorage', e);
    }
  }, [charStates]);

  useEffect(() => {
    try {
      localStorage.setItem('vfg_achievements', JSON.stringify(unlockedAchievements));
    } catch (e) {
      console.error('Failed to sync unlockedAchievements to localStorage', e);
    }
  }, [unlockedAchievements]);

  useEffect(() => {
    try {
      localStorage.setItem('vfg_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to sync settings to localStorage', e);
    }
  }, [settings]);

  // Audio Play Helper (stable callback)
  const playSound = useCallback((type) => {
    if (!settings.sound) return;
    try {
      const audioCtx = getAudioContext();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      if (type === 'message_sent') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'message_recv') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } else if (type === 'achievement') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(261.63, audioCtx.currentTime); // C4
        osc.frequency.setValueAtTime(329.63, audioCtx.currentTime + 0.1); // E4
        osc.frequency.setValueAtTime(392.00, audioCtx.currentTime + 0.2); // G4
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime + 0.3); // C5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } else if (type === 'levelup') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn('Audio Context failed to initialize', e);
    }
  }, [settings.sound]);

  // Trigger Achievement Notification (handles consecutive triggers via timeout clearing)
  const triggerNotification = useCallback((title, desc, icon) => {
    playSound('achievement');
    setNotification({ title, desc, icon });
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null);
      notificationTimeoutRef.current = null;
    }, 4000);
  }, [playSound]);

  // Unlock Achievement
  const unlockAchievement = useCallback((id) => {
    let alreadyUnlocked = false;
    setUnlockedAchievements(prev => {
      if (prev.includes(id)) {
        alreadyUnlocked = true;
        return prev;
      }
      return [...prev, id];
    });

    // Side-effects called outside the state updater function
    if (!alreadyUnlocked) {
      const achievement = ACHIEVEMENTS.find(ach => ach.id === id);
      if (achievement) {
        triggerNotification(achievement.title, achievement.desc, achievement.icon);
      }
    }
  }, [triggerNotification]);

  // Add Message to active character
  const addMessage = useCallback((charId, sender, text) => {
    // 1. Play message sound
    if (sender === 'user') {
      playSound('message_sent');
    } else {
      playSound('message_recv');
    }

    const charState = charStates[charId];
    if (!charState) return;

    let chatsCount = charState.chatsCount;
    if (sender === 'user') {
      chatsCount += 1;
    }

    // Base relationship gains for chats
    let loveGain = 0;
    let trustGain = 0;
    let friendshipGain = 0;

    if (sender === 'user') {
      friendshipGain = 1;
    }

    const newLove = Math.min(100, charState.love + loveGain);
    const newTrust = Math.min(100, charState.trust + trustGain);
    const newFriendship = Math.min(100, charState.friendship + friendshipGain);

    // 2. Perform functional state update
    setCharStates(prev => {
      const current = prev[charId];
      if (!current) return prev;
      const updatedMessages = [
        ...current.messages,
        {
          id: Math.random().toString(36).substring(2, 11),
          sender,
          text,
          timestamp: Date.now()
        }
      ];

      return {
        ...prev,
        [charId]: {
          ...current,
          messages: updatedMessages,
          chatsCount,
          love: newLove,
          trust: newTrust,
          friendship: newFriendship
        }
      };
    });

    // 3. Side effects: Check achievements
    if (sender === 'user') {
      unlockAchievement('first_chat');
    }

    if (newLove >= 70) {
      unlockAchievement('high_relationship');
    }
    if (newLove >= 100) {
      unlockAchievement('romantic_master');
    }
  }, [charStates, playSound, unlockAchievement]);

  // Perform Activity
  const performActivity = useCallback((charId, type, details = {}) => {
    playSound('levelup');

    const charState = charStates[charId];
    if (!charState) return;

    let loveGain = 0;
    let trustGain = 0;
    let friendshipGain = 0;
    const activityCounts = {
      giftsCount: charState.giftsCount,
      datesCount: charState.datesCount,
      moviesCount: charState.moviesCount
    };

    if (type === 'gift') {
      activityCounts.giftsCount += 1;
      loveGain = details.loveBonus || 8;
      trustGain = details.trustBonus || 4;
      friendshipGain = details.friendshipBonus || 5;
      unlockAchievement('gift_sent');
    } else if (type === 'date') {
      activityCounts.datesCount += 1;
      loveGain = details.loveBonus || 15;
      trustGain = details.trustBonus || 10;
      friendshipGain = details.friendshipBonus || 10;
      unlockAchievement('date_done');
    } else if (type === 'movie') {
      activityCounts.moviesCount += 1;
      loveGain = details.loveBonus || 10;
      trustGain = details.trustBonus || 5;
      friendshipGain = details.friendshipBonus || 12;
      unlockAchievement('movie_watched');
    } else if (type === 'game') {
      loveGain = details.loveBonus || 5;
      trustGain = details.trustBonus || 5;
      friendshipGain = details.friendshipBonus || 15;
      unlockAchievement('game_played');
    }

    const newLove = Math.min(100, charState.love + loveGain);
    const newTrust = Math.min(100, charState.trust + trustGain);
    const newFriendship = Math.min(100, charState.friendship + friendshipGain);

    setCharStates(prev => {
      const current = prev[charId];
      if (!current) return prev;
      return {
        ...prev,
        [charId]: {
          ...current,
          ...activityCounts,
          love: newLove,
          trust: newTrust,
          friendship: newFriendship
        }
      };
    });

    if (newLove >= 70) {
      unlockAchievement('high_relationship');
    }
    if (newLove >= 100) {
      unlockAchievement('romantic_master');
    }
  }, [charStates, playSound, unlockAchievement]);

  // Heuristic adjustments (e.g. increase meter after cute speech)
  const adjustMeters = useCallback((charId, loveDelta, trustDelta, friendshipDelta) => {
    const charState = charStates[charId];
    if (!charState) return;

    const newLove = Math.max(0, Math.min(100, charState.love + loveDelta));
    const newTrust = Math.max(0, Math.min(100, charState.trust + trustDelta));
    const newFriendship = Math.max(0, Math.min(100, charState.friendship + friendshipDelta));

    setCharStates(prev => {
      const current = prev[charId];
      if (!current) return prev;
      return {
        ...prev,
        [charId]: {
          ...current,
          love: newLove,
          trust: newTrust,
          friendship: newFriendship
        }
      };
    });

    if (newLove >= 70) {
      unlockAchievement('high_relationship');
    }
    if (newLove >= 100) {
      unlockAchievement('romantic_master');
    }
  }, [charStates, unlockAchievement]);

  // Settings helpers
  const toggleSound = useCallback(() => {
    setSettings(prev => ({ ...prev, sound: !prev.sound }));
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Reset all simulator data
  const resetAllData = useCallback(() => {
    const initial = {};
    CHARACTERS.forEach(char => {
      initial[char.id] = { 
        ...DEFAULT_CHAR_STATE,
        messages: [
          {
            id: 'welcome',
            sender: 'girlfriend',
            text: `Hi! Nan ready un kuda pesa. ${char.catchphrase}`,
            timestamp: Date.now()
          }
        ]
      };
    });
    setCharStates(initial);
    setUnlockedAchievements([]);
    setActiveCharId(null);
    setSettings(prev => ({ theme: 'dark', sound: true, streak: 1, lastActive: new Date().toDateString(), geminiApiKey: prev.geminiApiKey }));
    triggerNotification('System Reset', 'All data has been cleared.', '⚙️');
  }, [triggerNotification]);



  return (
    <SimulatorContext.Provider value={{
      activeCharId,
      setActiveCharId,
      charStates,
      addMessage,
      performActivity,
      adjustMeters,
      unlockedAchievements,
      unlockAchievement,
      settings,
      toggleSound,
      toggleTheme,
      resetAllData,
      notification,
      triggerNotification,
      updateSettings
    }}>
      {children}
    </SimulatorContext.Provider>
  );
};

export const useSimulator = () => useContext(SimulatorContext);
