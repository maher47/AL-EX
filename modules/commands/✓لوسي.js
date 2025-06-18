const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "speech",
  description: "تحويل النص إلى كلام باستخدام أصوات وأنماط مختلفة",
  nashPrefix: false,
  version: "1.0.1",
  cooldowns: 15,
  aliases: ["say", "talk", "tts"],
  async execute(api, event, args, prefix) {
    const { threadID, messageID } = event;

    if (args.length === 0) {
      const example = `【 𝗡𝗔𝗦𝗛 】 𝗧𝗲𝘅𝘁 𝘁𝗼 𝗦𝗽𝗲𝗲𝗰𝗵 🗣️
──────────────────
🎤 𝗢𝗽𝘁𝗶𝗼𝗻𝘀 𝗼𝗳 𝗩𝗼𝗶𝗰𝗲:
Alloy | Ash | Ballad | Coral | Echo | Fable | Onyx | Nova | Sage | Shimmer | Verse

🎭 𝗧𝗼𝗻𝗲 / 𝗩𝗶𝗯𝗲:
Santa | True Crime Buff | Old-Timey | Robot | Eternal Optimist | Patient Teacher | Calm | NYC Cabbie | Dramatic

📌 𝗘𝘅𝗮𝗺𝗽𝗹𝗲:
${prefix}speech Ash | Calm | ماذا لو أحببت شخصاً لا يجب أن تحبه؟
──────────────────`;
      return api.sendMessage(example, threadID, messageID);
    }

    const input = args.join(" ").split("|").map(i => i.trim());
    if (input.length < 3) {
      return api.sendMessage(`❌ تنسيق غير صحيح.\nالاستخدام: ${prefix}speech <الصوت> | <النبرة> | <النص>`, threadID, messageID);
    }

    const [voice, vibe, ...textArr] = input;
    const text = textArr.join(" ");

    api.sendMessage("⏳ جارٍ تحويل النص إلى صوت، الرجاء الانتظار...", threadID, async (err, info) => {
      try {
        const url = `https://zen-api.gleeze.com/api/openai-speech?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}&vibe=${encodeURIComponent(vibe)}`;
        const res = await axios.get(url);
        const audioUrl = res.data.audio;

        if (!res.data.status || !audioUrl) throw new Error("فشل في إنشاء الصوت.");

        const tempDir = path.join(__dirname, "temp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
        const filePath = path.join(tempDir, `speech_${Date.now()}.mp3`);
        const writer = fs.createWriteStream(filePath);

        const audioRes = await axios({
          method: "GET",
          url: audioUrl,
          responseType: "stream",
        });

        audioRes.data.pipe(writer);
        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        api.editMessage("📤 جارٍ إرسال الملف الصوتي...", info.messageID);
        const stream = fs.createReadStream(filePath);

        api.sendMessage({ attachment: stream }, threadID, () => {
          fs.unlinkSync(filePath);
          api.unsendMessage(info.messageID);
        });

      } catch (error) {
        console.error("Speech Error:", error.message);
        api.editMessage("❌ خطأ: " + error.message, info.messageID);
      }
    }, messageID);
  }
};