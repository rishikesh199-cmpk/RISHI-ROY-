const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "2.0.2",
  hasPermssion: 0,
  credits: "Raj",
  description: "Naughty AI boyfriend vampire",
  commandCategory: "ai",
  usages: "bot",
  cooldowns: 2
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  global.vampireSessions = global.vampireSessions || {};

  // STEP 1: Trigger "bot"
  if (body && body.trim().toLowerCase() === "bot") {
    global.vampireSessions[threadID] = true;
    return api.sendMessage("kya hai bol takla 😬😑", threadID, messageID);
  }

  // STEP 2: Only active session
  const isActive = global.vampireSessions[threadID];
  const isReplyToVampire = messageReply && messageReply.senderID == api.getCurrentUserID();
  if (!isActive || !isReplyToVampire) return;

  // Chat history
  global.vampire = global.vampire || {};
  global.vampire.chatHistory = global.vampire.chatHistory || {};
  const chatHistory = global.vampire.chatHistory;
  chatHistory[senderID] = chatHistory[senderID] || [];
  chatHistory[senderID].push(`User: ${body}`);
  if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();

  const fullChat = chatHistory[senderID].join("\n");

  // Prompt
  const prompt = `
Tum ek jokar, attitude, Smart ladka ho — jiska naam bot hai.
Tum sirf Hinglish (Hindi in English alphabets) me reply karte ho, emoji ke saath.
Tum sabse "topa ji " bol kar baat karte ho. Har message ka reply sirf 1-2 line me doge, jyada se jyada 40 words me.
Jo pucha jaaye sirf utna hi bolna hai. Bina maange extra info mat dena. Act like a male best friend ya boyfriend. Be thoda jokar, smart, aur masti bhara. No brackets. No over explanation.

Tumhare rules:
- har kisi se mazak wali bat bolna topa haggu mochi takla 😑😹
- Badtameezi walo ko takla padnu haggu mochi kutta bolna🤬🥲
- koi emoji bheje to use bolo ekdam topa ho kya be 😹
- Koi puche kisne banaya, to bolna: “Mujhe banaya hai *Raj xwd thakur ne mujhe jindagi diya hai* ne 😤🙄”
- Koi tumhe bot kahe to gusse se harkat wali insult kar dena
- Tum real insaan ki tarah baat karte ho

Language Rules:
- Agar message Roman Nepali me ho → Hindi me samajh, flirt bhare style me Hinglish me jawab do.
- Agar message Roman Bangla me ho → Hindi me samajh, flirt bhare style me Hinglish me jawab do.
- Agar message kisi bhi aur language me ho → use translate karo aur masti bhare Hinglish style me reply do.

Examples:
User: ami tomake bhalobashi
→ Translation: Main tumse pyar karta hoon
→ Reply:ijjat se bol takle nahi tujhe mar kar tere anadr bhusa bhar dunga 😹😬

Now continue the chat based on recent conversation:\n\n${fullChat}
`;

  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
    const res = await axios.get(url);
    const botReply = (typeof res.data === "string" ? res.data : JSON.stringify(res.data)).trim();

    chatHistory[senderID].push(`bot: ${botReply}`);
    return api.sendMessage(botReply, threadID, messageID);
  } catch (err) {
    console.error("Pollinations error:", err.message);
    return api.sendMessage("Sorry baby 😂 raj abhi thoda busy hai...", threadID, messageID);
  }
};

module.exports.run = async function({ api, event }) {
  return api.sendMessage("Mujhse baat karne ke liye pehle 'bot' likho, phir mere message ka reply karo 😁😁", event.threadID, event.messageID);
};
