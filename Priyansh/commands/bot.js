const axios = require("axios");

module.exports.config = {
    name: "bot",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Arun edit by Nobita",
    description: "Gemini AI - Always active girlfriend style chat (no prefix)",
    commandCategory: "ai",
    usages: "auto",
    cooldowns: 0
};

const API_URL = "https://geminiw.onrender.com/chat";
const chatHistories = {}; // user-wise memory

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;
    if (!body) return; // ignore blank messages

    let userMessage = body.trim();

    // Initialize user history if not exists
    if (!chatHistories[senderID]) chatHistories[senderID] = [];

    // If replying to bot’s message → continue context
    const isReplyingToBot = messageReply && messageReply.senderID === api.getCurrentUserID();
    if (isReplyingToBot) {
        userMessage = messageReply.body + "\nUser: " + userMessage;
    }

    chatHistories[senderID].push(`User: ${userMessage}`);

    // Keep only last 5 messages
    if (chatHistories[senderID].length > 5) chatHistories[senderID].shift();

    const fullConversation = chatHistories[senderID].join("\n");

    // Girlfriend style prompt
    const gfPrompt = `Tumhara nam Topi hai. Tum cute, gusse wali, aur thodi battameez si ladki ho 😹.
Tum har baat mazak, attitude aur flirty style me karti ho.
Agar koi puche kisne banaya tumhe, bolo "Raj Thakur ne banaya mujhe 😬".
Har message ka jawab short aur thoda attitude me do (max 30 words).
Now continue chat:\n\n${fullConversation}`;

    api.setMessageReaction("", messageID, () => {}, true);

    try {
        const response = await axios.get(`${API_URL}?message=${encodeURIComponent(gfPrompt)}`);
        const botReply = response.data.reply || "Uff! Samajh nahi aaya baby 😑";

        chatHistories[senderID].push(`Topi: ${botReply}`);
        api.sendMessage(botReply, threadID, messageID);
        api.setMessageReaction("", messageID, () => {}, true);
    } catch (error) {
        console.error(error);
        api.sendMessage("Arre baby! 😵 Kuch gadbad ho gayi, thodi der baad try karo na bhalu 👺", threadID, messageID);
        api.setMessageReaction("❌", messageID, () => {}, true);
    }
};

// prefix command part (empty because not needed)
module.exports.run = async function () {};
