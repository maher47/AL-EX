const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "انشاء",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "مصطفى",
  description: "توليد صورة باستخدام الذكاء الاصطناعي من وصف نصي",
  commandCategory: "صور",
  usages: "[وصف]",
  cooldowns: 10,
  aliases: ["img", "imageai", "draw"]
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const prompt = args.join(" ");

  if (!prompt)
    return api.sendMessage("📝 الرجاء كتابة وصف للصورة التي تريد توليدها.", threadID, messageID);

  api.sendMessage("🎨 جارٍ توليد الصورة باستخدام الذكاء الاصطناعي، الرجاء الانتظار...", threadID, async (err, info) => {
    try {
      const response = await axios.get(`https://zen-api.gleeze.com/api/draw?prompt=${encodeURIComponent(prompt)}`);
      const imageURL = response.data.image;

      if (!imageURL) throw new Error("❌ لم يتم توليد صورة من الوصف.");

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const filePath = path.join(cacheDir, `ai_${Date.now()}.jpg`);
      const writer = fs.createWriteStream(filePath);

      const imageRes = await axios({
        method: "GET",
        url: imageURL,
        responseType: "stream"
      });

      imageRes.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      api.unsendMessage(info.messageID);
      api.sendMessage({
        body: `📸 تم إنشاء الصورة بناءً على وصفك:\n"${prompt}"`,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => fs.unlinkSync(filePath));

    } catch (error) {
      console.error("AI Image Error:", error.message);
      api.unsendMessage(info.messageID);
      api.sendMessage("❌ حدث خطأ أثناء توليد الصورة:\n" + error.message, threadID);
    }
  });
};