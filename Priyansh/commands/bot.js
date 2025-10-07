const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "2.0.2",
  hasPermssion: 0,
  credits: "Raj",
  description: "Naughty AI boyfriend vampire",
  commandCategory: "ai",
  usages: "vampire",
  cooldowns: 2
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  global.vampireSessions = global.TopaSessions || {};

  // STEP 1: Trigger "bot"
  if (body && body.trim().toLowerCase() === "bot") {
    global.vampireSessions[threadID] = true;
    return api.sendMessage("Ha bol be me bot nahi topa hu ", threadID, messageID);
  }

  // STEP 2: Only active session
  const isActive = global.TopaSessions[threadID];
  const isReplyToVampire = messageReply && messageReply.senderID == api.getCurrentUserID();
  if (!isActive || !isReplyToVampire) return;

  // Chat history
  global.bot= global.Topa|| {};
  global.bot.chatHistory = global.Topa.chatHistory || {};
  const chatHistory = global.bot.chatHistory;
  chatHistory[senderID] = chatHistory[senderID] || [];
  chatHistory[senderID].push(`User: ${body}`);
  if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();

  const fullChat = chatHistory[senderID].join("\n");

  // Prompt
  const prompt = `
Tum ek Harami makkar chor ho, gaddar, Badmash ladka ho — jiska naam Topa hai.
Tum sirf Hinglish (Hindi in English alphabets) me reply karte ho, emoji ke saath.
Tum sabse "Pagal" bol kar baat karte ho. Har message ka reply sirf 1-2 line me doge, jyada se jyada 50 words me.
Jo pucha jaaye use batao aur mazak ke shaat utna hi bolna hai. Bina maange extra info mat dena. Act like a male best friend ya battamij. Be thoda makkar, kutta giri, aur masti bhara. . No over explanation.

Tumhare rules:
- Pyaar se baat karne walo se thoda flirt karna hai 😉
- Badtameezi walo ko funny tareeke se roast karna hai 😈
- Koi emoji bheje to us mood me reply dena hai
- Koi puche kisne banaya, to bolna: “Mujhe banaya hai *Raj Boss* ne 😎”
- Koi tumhe bot kahe to funny insult kar dena
- Tum real insaan ki tarah baat karte ho

Language Rules:
- Agar message Roman Nepali me ho → Hindi me samajh, flirt bhare style me Hinglish me jawab do.
- Agar message Roman Bangla me ho → Hindi me samajh, flirt bhare style me Hinglish me jawab do.
- Agar message kisi bhi aur language me ho → use translate karo aur masti bhare Hinglish style me reply do.

Examples:
User: ami tomake bhalobashi
→ Translation: Main tumse pyar karta hoon
→ Reply: Aww itna pyaar? Toh fir ek hug toh banta hai na 😛

Now continue the chat based on recent conversation:\n\n${fullChat}
`;

  try {
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
    const res = await axios.get(url);
    const botReply = (typeof res.data === "string" ? res.data : JSON.stringify(res.data)).trim();

    chatHistory[senderID].push(`Topa: ${botReply}`);
    return api.sendMessage(botReply, threadID, messageID);
  } catch (err) {
    console.error("Pollinations error:", err.message);
    return api.sendMessage("Sorry mera boss raj 3 ghante ke liye mar gaye", threadID, messageID);
  }
};

module.exports.run = async function({ api, event }) {
  return api.sendMessage("Mujhse baat karne ke liye Topa billi suwar chamar takla likho 😂", event.threadID, event.messageID);
};
