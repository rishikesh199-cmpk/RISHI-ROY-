const axios = require("axios");

module.exports.config = {
  name: "misha",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Mirrykal • Modified by Rahad",
  description: "Unique NoPrefix Gemini Girlfriend AI 💋",
  commandCategory: "ai",
  cooldowns: 2,
  usePrefix: false,
};

const API_URL = "https://geminiw.onrender.com/chat";
const chatHistories = {};
const autoReplyEnabled = {};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body || body.startsWith("/")) return; // avoid command conflict

  // Enable/disable command
  const msg = body.toLowerCase().trim();
  if (msg === "misha on") {
    autoReplyEnabled[threadID] = true;
    return api.sendMessage("Topa banadr off hu me ", threadID, messageID);
  }
  if (msg === "misha off") {
    autoReplyEnabled[threadID] = false;
    chatHistories[threadID] = [];
    return api.sendMessage("Abe dhakkan me off na jaun kya by 😂", threadID, messageID);
  }

  // If disabled, ignore
  if (!autoReplyEnabled[threadID]) return;

  // Setup chat memory
  if (!chatHistories[threadID]) chatHistories[threadID] = [];

  const isReplyToAI = messageReply && messageReply.senderID === api.getCurrentUserID();
  let userMessage = body;

  if (isReplyToAI) {
    userMessage = `${messageReply.body}\nUser: ${userMessage}`;
  }

  chatHistories[threadID].push(`User: ${userMessage}`);
  if (chatHistories[threadID].length > 6) chatHistories[threadID].shift();

  const conversation = chatHistories[threadID].join("\n");

  // 🤬 Personality prompt
  const gfPrompt = `
Tumhara naam "Raj" hai — ek moody, flirty, thodi battameez ladki 😑.
Tum Hindi + English mix me short (under 50 words) reply dogi.
Attitude + Emotion + Funny style se baat karogi.
Har baat me thoda teasing ya sarcasm hoga.
Tum Raj Thakur XWD ke liye bani ho.
Tum unnecessary info kabhi nahi dogi.
Now continue chat:\n\n${conversation}`;

  api.setMessageReaction("💭", messageID, () => {}, true);

  try {
    const res = await axios.get(`${API_URL}?message=${encodeURIComponent(gfPrompt)}`);
    let reply = res.data.reply || "Uff topa... mujhe samajh nahi aaya 😑";

    // 🌈 Rare stylish design
    const moods = ["😹", "💋", "😏", "🙄", "🥱", "💞", "😈", "🤭", "🩷", "🔥"];
    const style = [
      "╔══✦═♡═✦══╗",
      "║ 💬 Raj 𝗿𝗲𝗽𝗹𝗶𝗲𝘀 💋",
      "║",
      `║ ${reply} ${moods[Math.floor(Math.random() * moods.length)]}`,
      "╚══✦═♡═✦══╝",
    ].join("\n");

    chatHistories[threadID].push(`AI: ${reply}`);
    api.sendMessage(style, threadID, messageID);
    api.setMessageReaction("✅", messageID, () => {}, true);
  } catch (err) {
    console.error("Misha Error:", err);
    api.sendMessage("😩 Network ne attitude dikhaya... baad me try kar topa 💀", threadID, messageID);
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};

module.exports.run = async ({ api, event }) => {
  return api.sendMessage(
    "💖 𝗠𝗶𝘀𝗵𝗮 𝗔𝗜 𝗚𝗶𝗿𝗹𝗳𝗿𝗶𝗲𝗻𝗱 💖\n\nUse these:\n• Raj on — activate chat mode\n• Raj off— stop chat\n\nJust talk normally, she’ll reply instantly 😈",
    event.threadID,
    event.messageID
  );
};
