const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "صوت",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "مصطفى",
  description: "تحويل النص إلى كلام بصوت ونبرة محددة",
  commandCategory: "أدوات",
  usages: "<الصوت> | <النبرة> | <النص>",
  cooldowns: 15,
  aliases: ["say", "talk", "tts"]
};

module.exports.run = async ({ api, event, args, prefix }) => {
  const { threadID, messageID } = event;

  if (args.length === 0) {
    const example = `【 𝗡𝗔𝗦𝗛 】🗣️ تحويل النص إلى كلام
──────────────────
🎤 الأصوات:
Alloy | Ash | Ballad | Coral | Echo | Fable | Onyx | Nova | Sage | Shimmer | Verse

🎭 النبرات:
Santa | True Crime Buff | Old-Timey | Robot | Eternal Optimist | Patient Teacher | Calm | NYC Cabbie | Dramatic

📌 مثال:
${prefix}speech Ash | Calm | ماذا لو أحببت شخصاً لا يجب أن تحبه؟
──────────────────`;
    return api.sendMessage(example, threadID, messageID);
  }

  const input = args.join(" ").split("|").map(i => i.trim());
  if (input.length < 3) {
    return api.sendMessage(`❌ تنسيق غير صحيح.\nالاستخدام:\n${prefix}speech <الصوت> | <النبرة> | <النص>`, threadID, messageID);
  }

  const [voice, vibe, ...textArr] = input;
  const text = textArr.join(" ");

  api.sendMessage("⏳ جاري تحويل النص إلى صوت...", threadID, async (err, info) => {
    try {
      const url = `https://zen-api.gleeze.com/api/openai-speech?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}&vibe=${encodeURIComponent(vibe)}`;
      const res = await axios.get(url);
      const audioUrl = res.data.audio;

      if (!res.data.status || !audioUrl) throw new Error("❌ فشل في توليد الصوت.");

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
      const filePath = path.join(cacheDir, `speech_${Date.now()}.mp3`);

      const audioRes = await axios({
        method: "GET",
        url: audioUrl,
        responseType: "stream",
      });

      const writer = fs.createWriteStream(filePath);
      audioRes.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      api.unsendMessage(info.messageID);
      const stream = fs.createReadStream(filePath);
      api.sendMessage({ attachment: stream }, threadID, () => fs.unlinkSync(filePath));

    } catch (error) {
      console.error("Speech Error:", error.message);
      api.unsendMessage(info.messageID);
      api.sendMessage("❌ حدث خطأ أثناء توليد الصوت:\n" + error.message, threadID);
    }
  }, messageID);
};