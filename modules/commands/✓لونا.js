const axios = require("axios");

module.exports.config = {
  name: "gpt4",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "مصطفى",
  description: "استخدام GPT-4 للرد على الأسئلة.",
  commandCategory: "ذكاء اصطناعي",
  usages: "[سؤالك]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const prompt = args.join(" ");
  const { threadID, messageID, senderID } = event;

  if (!prompt) return api.sendMessage("⚠️ من فضلك اكتب سؤالك بعد الأمر.", threadID, messageID);

  const url = `https://zen-api.gleeze.com/api/gpt4?prompt=${encodeURIComponent(prompt)}&uid=${senderID}`;

  api.sendMessage("🤖 GPT-4 يعالج طلبك، انتظر قليلاً...", threadID, async (err, info) => {
    try {
      const res = await axios.get(url);
      const reply = res.data.response || res.data.message || "❌ لم يتم الحصول على رد من الذكاء الاصطناعي.";
      api.editMessage(reply, info.messageID);
    } catch (error) {
      api.editMessage("❌ فشل في الاتصال بـ GPT-4. حاول لاحقًا.", info.messageID);
    }
  }, messageID);
};