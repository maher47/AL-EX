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

  api.sendMessage("🤖 GPT-4 يعالج طلبك، انتظر قليلاً...", threadID, async (err, info) => {
    try {
      const url = `https://zen-api.gleeze.com/api/gpt4?prompt=${encodeURIComponent(prompt)}&uid=${senderID}`;
      const res = await axios.get(url);
      const reply = res.data.response || res.data.message || "❌ لم يتم الحصول على رد من الذكاء الاصطناعي.";

      api.unsendMessage(info.messageID); // حذف الرسالة المؤقتة
      api.sendMessage(reply, threadID, messageID); // إرسال الرد الجديد

    } catch (error) {
      api.unsendMessage(info.messageID);
      api.sendMessage("❌ فشل في الاتصال بـ GPT-4. حاول لاحقًا.", threadID, messageID);
    }
  }, messageID);
};