const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

function getApiKey() {
  try {
    const saved = localStorage.getItem('vfg_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.geminiApiKey && parsed.geminiApiKey.trim()) {
        return parsed.geminiApiKey.trim();
      }
    }
  } catch (e) {
    console.error('Failed to parse settings for api key', e);
  }
  return DEFAULT_API_KEY;
}


// Fallbacks in case of API Key issues or Network errors, tailored per character
const MOCK_RESPONSES = {
  maya: [
    "Aiyoo noob! Network signal sariya illa pola... 📶 Aana nan match win panta da! Iniku super day, ne enna panra?",
    "Hey! En gamer buddy. Controller drop pannitu un kuda chat panna vanthen! Iniku enna game viladalam? 🎮",
    "Haha! Semmam da. Nan full fire ah iruken iniku. Nee sapteeya illaya? Bucket chicken order pannalama? 🍗",
    "Enna da, aale kanum? AFK poitiya? Seekram va, un kuda pesuna thaan enaku double XP kedaikum! 💕",
    "Un character skin semmaya iruku! Oh wait, real life layum nee romba cute thaan. blushing blushing! 😳"
  ],
  priya: [
    "Aiyo chella, signal weak ah iruku... 🥺 Veetula safety ah irukiya? Sapteegala? Filter coffee ready ah iruku! ☕",
    "En anbe! Iniku romba rain peiyuthu. Un memory thaan full ah iruku en mind la. Safe ah iru da. 🌧️",
    "Priya unkuda thaan eppovum irupen, don't worry. Sapdu da, rest edu. Un health romba mukkiyam! 🌸",
    "Iniku biscuit bake pannen chella, unaku thaan first piece. Taste check panni epdi irukunu sollu! 🍪",
    "Nee kootita pona beach date super ah irunthuthu da. Enaku un kooda irukurathu thaan ulagathulaye pidichathu."
  ],
  diya: [
    "En kanave, net signal glitch aaguthu... 🎨 Aana nan un portrait thaan paint pannitu iruken. Canvas full ah nee thaan!",
    "Hey, iniku sunset semma beautiful ah irundhuthu... un smile mathiriye! Unkuda sunset paakanum polaruke. 🌅",
    "Acoustic guitar la puthu tune play pannen da, unkaga thaan andha song. Line lines ah lyrics ezhuthalama?",
    "Art brush tholaichuten, aana un kooda pesuna en mind colorful brush mathiri aayidum! 💖",
    "Un kannil theriyum anbu thaan en painting oda masterpiece, anbe. Enna draw pannalam sollu?"
  ],
  anjali: [
    "Silly boy/girl! Signal error varuthu... 💻 Aana nee message panna podhum, code build ready aayidum! Enna code explain pannanum chella?",
    "Espresso strong ah pottingala? React or Javascript la edhavadhu doubt irundha kelu bujjima, nan teach panren! 💡",
    "Hey smarty! Code compiler execute aagala na kavalapadadha. Va, namma logic search panni debug pannalam! 😉",
    "Puthu code read panni explain pannanuma da? Unakaga simple ah ezhudhi solli tharen, en coding partner! 💖",
    "React loops dynamic state and render pathi doubt ah? Nan explain panren, nee romba smart chella!"
  ],
  kavya: [
    "Konjam... signal slow ah iruku... 👉👈 Aana... un memory full ah iruku en heart la. Blushing... 😳",
    "Rose plant la iniku fresh flower blow aayirukku... unaku tharanum nu thonichu... pudichiruka? 🌹",
    "Cozy manga read pannen... adharla vara hero un mathiriye caring ah irukan... soft smile... 🌸",
    "Rain sound kettu stargaze pannitu iruken iniku... un kooda close ah irundha nalla irukum... ✨",
    "Shy ah iruku solrathuku... aana enaku unna romba... romba pudichiruku... love emoji..."
  ],
  ruban: [
    "En uyire, signal weak ah iruku... 📶 Aana unna thaan think pannitu iruken. Sapteeya chella? Udamba nalla pathuko da. ❤️",
    "Tired ah irukiya en bujjima? 🥺 Coffee ready ah iruku, unkooda share panni kudichite un fatigue ellam maraka veikren. ☕💕",
    "Guitar la unaku pidicha song tune pannitu iruken chella kutty. Un kuda pesurathu thaan enaku ulagathulaye pidicha vishayam. 🥰🎸",
    "Aale kanumae en kannamma... miss you so much! Nan eppovum un kooda thaan irupen da, don't worry. 🌸💖",
    "Un message pathathum en mind semma happy aayiruchu darls. Sapteegala nu kekradhu en duty. Sapdu da! 😘🍽️",
    "Kavithai keka poriya en chella kutty? 'Un vizhigal pesum mozhi, en guitar-in isai... un anbu thaan en vazhkaiyin thalame!' Blushing deeply... 🎸✍️"
  ]
};

async function callGemini(contents, systemInstruction, responseMimeType = 'text/plain') {
  const models = ['gemini-2.5-flash-lite', 'gemini-flash-lite-latest', 'gemini-3.5-flash', 'gemini-2.5-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      const key = getApiKey();
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const body = {
        contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 256
        }
      };

      if (responseMimeType === 'application/json') {
        body.generationConfig = {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 150
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return text.trim();
        }
      } else {
        console.warn(`Gemini API returned error code ${response.status} for model ${model}`);
        if (response.status === 429 || response.status === 403 || response.status === 401) {
          throw new Error(`Gemini API Error: Status ${response.status}`);
        }
      }
    } catch (err) {
      console.warn(`Failed to contact Gemini API for model ${model}:`, err);
      lastError = err;
    }
  }
  throw lastError || new Error('All models failed to respond');
}

export async function fetchGeminiResponse(charId, chatHistory, systemPrompt) {
  const recentHistory = chatHistory.slice(-8);
  const contents = recentHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  try {
    return await callGemini(contents, systemPrompt);
  } catch (error) {
    console.warn('Gemini API Error, using matching Tanglish mock response:', error);
    const fallbacks = MOCK_RESPONSES[charId] || MOCK_RESPONSES['priya'];
    
    // Find matching fallback based on user message keywords
    const lastUserMsg = chatHistory.filter(msg => msg.sender === 'user').pop()?.text?.toLowerCase() || '';
    
    // Ruban specialized context-aware response matching
    if (charId === 'ruban') {
      const containsAny = (str, keywords) => keywords.some(k => str.includes(k));

      // Food / Drink
      if (containsAny(lastUserMsg, ['sapt', 'sapd', 'sapth', 'sapu', 'food', 'eat', 'dinner', 'lunch', 'breakfast', 'coffee', 'tea', 'biscuit', 'cookie'])) {
        return "Nan filter coffee and light snack sapten chella. Nee sapteeya? Skip panna koodathu, sariya sapdu da! ☕🍽️";
      }
      // Town / Place / Location
      if (containsAny(lastUserMsg, ['ooru', 'oor', 'place', 'city', 'location', 'enga iruka', 'engirundhu', 'engirunthu', 'where'])) {
        return "Nan Chennai thaan chella, unga pakathu ooru thaan. Un kooda eppovum pakathulaye irukanum nu thonudhu. En ooru un heart thaan! 😉💖";
      }
      // Tiredness / Rest
      if (containsAny(lastUserMsg, ['tired', 'rest', 'valikithu', 'pain', 'sick', 'headache', 'udambu', 'feeling low', 'sleep', 'thoonga', 'thoongu', 'udambu vali'])) {
        return "Tired ah irukiya en bujjima? 🥺 Udamba nalla pathuko da. Coffee ready ah iruku, un fatigue ellam en guitar sound la parandhudum! ☕💕";
      }
      // Poetry / Song
      if (containsAny(lastUserMsg, ['kavith', 'poem', 'patt', 'paat', 'song', 'sing', 'guitar', 'lyric'])) {
        return "Kavithai keka poriya en chella kutty? 'Un vizhigal pesum mozhi, en guitar-in isai... un anbu thaan en vazhkaiyin thalame!' Blushing deeply... 🎸✍️";
      }
      // Greetings
      if (containsAny(lastUserMsg, ['hi', 'hello', 'hey', 'epdi iruka', 'epdi irukinga', 'how are you', 'enra', 'enna panra', 'vanakkam', 'nalama'])) {
        return "Hello en chella kutty! Nan super ah iruken da. Nee epdi iruka? Iniku day unaku epdi pochu? 🌸🎸";
      }
      // Goodbye / Good Night
      if (containsAny(lastUserMsg, ['bye', 'good night', 'goodnight', 'sleep', 'thoonga', 'thoongu'])) {
        return "Good night en uyir kannamma! ✨ Sweet dreams, rest edu. Dream la nan guitar vasi unakaaga paaduven, okay? Bye da! 😘💤";
      }
      // Love / Praise
      if (containsAny(lastUserMsg, ['love', 'pudikkum', 'pudichiruku', 'pudikum', 'pudichuruku', 'like', 'cute', 'handsome', 'beautiful', 'darls', 'chellam', 'kannamma', 'bujjima'])) {
        return "Blushing deeply... 😳 Un message pathathum heart fly aagudhu chella kutty. Nee thaan en uyire, unna romba romba pudichichu! 💖✨";
      }
      if (containsAny(lastUserMsg, ['miss'])) {
        return "Aale kanumae en kannamma... miss you so much! Nan eppovum un kooda thaan irupen da, don't worry. 🌸💖";
      }
      // General fallback
      return "En uyire, un message pathathum en mind semma happy aayiruchu darls. En kooda eppovum pesitae irupiya? 🥰🎸";
    }

    let matched = null;
    if (lastUserMsg.includes('sapteeya') || lastUserMsg.includes('sapteegala') || lastUserMsg.includes('food') || lastUserMsg.includes('sapdu') || lastUserMsg.includes('sapda') || lastUserMsg.includes('eat') || lastUserMsg.includes('coffee') || lastUserMsg.includes('tea')) {
      matched = fallbacks.find(f => f.toLowerCase().includes('sapteeya') || f.toLowerCase().includes('sapdu') || f.toLowerCase().includes('sapteegala') || f.toLowerCase().includes('coffee') || f.toLowerCase().includes('cookie'));
    } else if (lastUserMsg.includes('tired') || lastUserMsg.includes('rest') || lastUserMsg.includes('valikithu') || lastUserMsg.includes('pain') || lastUserMsg.includes('sick') || lastUserMsg.includes('thoongu') || lastUserMsg.includes('sleep') || lastUserMsg.includes('rest')) {
      matched = fallbacks.find(f => f.toLowerCase().includes('tired') || f.toLowerCase().includes('rest') || f.toLowerCase().includes('safe') || f.toLowerCase().includes('udamba'));
    } else if (lastUserMsg.includes('kavithai') || lastUserMsg.includes('poem') || lastUserMsg.includes('poetry') || lastUserMsg.includes('pattu') || lastUserMsg.includes('song') || lastUserMsg.includes('guitar') || lastUserMsg.includes('sing') || lastUserMsg.includes('music')) {
      matched = fallbacks.find(f => f.toLowerCase().includes('guitar') || f.toLowerCase().includes('song') || f.toLowerCase().includes('kavithai') || f.toLowerCase().includes('music') || f.toLowerCase().includes('paint'));
    } else if (lastUserMsg.includes('love') || lastUserMsg.includes('pudikkum') || lastUserMsg.includes('pudichiruku') || lastUserMsg.includes('like') || lastUserMsg.includes('miss') || lastUserMsg.includes('cute') || lastUserMsg.includes('beautiful') || lastUserMsg.includes('handsome') || lastUserMsg.includes('chella')) {
      matched = fallbacks.find(f => f.toLowerCase().includes('love') || f.toLowerCase().includes('miss') || f.toLowerCase().includes('cute') || f.toLowerCase().includes('bujjima') || f.toLowerCase().includes('masterpiece') || f.toLowerCase().includes('kannamma') || f.toLowerCase().includes('chella'));
    }
    
    return matched || fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

export const DEFAULT_QUICK_REPLIES = {
  maya: [
    "Play pannalam va! 🎮",
    "Noob nu solladha! 😜",
    "Enna game viladalam? 👾",
    "Nee clutch pantiya? 🔥",
    "Miss you da! 💕"
  ],
  priya: [
    "Sapten ma. Nee? 🍽️",
    "Filter coffee super! ☕",
    "Udambu pathuka ma. 💕",
    "Rain date polama? 🌧️",
    "Nee thaan en chella. 🥰"
  ],
  diya: [
    "Portrait super ah iruku! 🎨",
    "En anbe, sunset paakalam. 🌅",
    "Guitar play pannu ma. 🎸",
    "Un smile thaan masterpiece! 💖",
    "Puthu drawing kaamilaam? 🖌️"
  ],
  anjali: [
    "Iniku enna coding teach panna pora? 💻",
    "Enna debug pannanum chella? 😜",
    "Espresso ready! Code explain panriya? ☕",
    "React loops teach pannu ma! 💡",
    "Nee thaan en cute coding teacher! 💞"
  ],
  kavya: [
    "Shy aagadha ma! 😳",
    "Rose romba pidichiruku! 🌹",
    "Manga read pannalam? 📖",
    "Stargazing kooti pova? ✨",
    "Enaku unna romba pidikum! 👉👈"
  ],
  ruban: [
    "Guitar vasiya ma! 🎸",
    "Filter coffee sapteeya? ☕",
    "Un kooda pesa pudikum! 💞",
    "Nee enna panra? 🤔",
    "Miss you da chellam! 💕"
  ]
};

export function getDefaultQuickReplies(charId) {
  return DEFAULT_QUICK_REPLIES[charId] || DEFAULT_QUICK_REPLIES['priya'];
}

export async function fetchQuickReplies(charId, chatHistory, characterName, personality) {
  if (!chatHistory || chatHistory.length === 0) {
    return getDefaultQuickReplies(charId);
  }

  const recentHistory = chatHistory.slice(-8);
  const historyText = recentHistory
    .map(msg => `${msg.sender === 'user' ? 'User' : characterName}: ${msg.text}`)
    .join('\n');

  const systemInstruction = `You are a helper that generates conversational quick replies for the User to reply to ${characterName} (personality: ${personality}).
Analyze the conversation history. Based on ${characterName}'s last message, generate exactly 4 short, emotional, natural Tanglish (Tamil in English script, e.g. "Sapteeya da? 🍽️", "Aama chella 😳", "Nee enna panra? 💕", "Semma game! 🎮") options that the user could click to reply.
Each option should include a relevant emoji and be extremely concise (1 to 5 words).
Output MUST be a valid JSON array of 4 strings. DO NOT output markdown codeblocks, prefix, or explanation. Only return the raw JSON array.
Example Output format:
["reply one 🌸", "reply two 💕", "reply three 😳", "reply four ☕"]`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: `Generate quick replies for this chat history:\n${historyText}` }]
    }
  ];

  try {
    const responseText = await callGemini(contents, systemInstruction, 'application/json');
    let cleanText = responseText.trim();
    // Robustly extract JSON array structure in case of conversational prefix/suffix
    const match = cleanText.match(/\[[\s\S]*\]/);
    if (match) {
      cleanText = match[0];
    }
    const parsed = JSON.parse(cleanText);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, 5);
    }
    throw new Error('Parsed response is not a valid array');
  } catch (error) {
    console.warn('Error fetching quick replies, using defaults:', error);
    return getDefaultQuickReplies(charId);
  }
}

export async function testApiKey(apiKey) {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, error: 'API Key cannot be empty' };
  }
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey.trim()}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
      })
    });
    if (response.ok) {
      return { success: true };
    } else {
      const errData = await response.json().catch(() => ({}));
      return { success: false, error: errData?.error?.message || `Status ${response.status}` };
    }
  } catch (err) {
    return { success: false, error: err.message || 'Network error' };
  }
}
