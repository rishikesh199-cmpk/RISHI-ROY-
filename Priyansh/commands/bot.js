const axios = require("axios");

module.exports.config = {
  name: "Bot",
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
  if (msg === "Bot on") {
    autoReplyEnabled[threadID] = true;
    return api.sendMessage("topi aa gyi tumhe rulane 😹", threadID, messageID);
  }
  if (msg === "Topi off") {
    autoReplyEnabled[threadID] = false;
    chatHistories[threadID] = [];
    return api.sendMessage("Topi ab sone ja rhi aap bhi so jao nahi to bhalu पकड़ lega 🤣", threadID, messageID);
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
Tumhara naam "Topi" hai — pagal, gussa, thodi battameez makkar 😹.
Tum Hindi + English mix me short (under 30 words) reply dogi.
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
      "",
      "",
      "",
      `${reply} ${moods[Math.floor(Math.random() * moods.length)]}`,
      "",
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
    "\n\nUse these:\n• Topi on — activate chat mode\n• Topi off — stop chat\n\nJust talk normally, she’ll reply instantly 😈",
    event.threadID,
    event.messageID
  );
};
