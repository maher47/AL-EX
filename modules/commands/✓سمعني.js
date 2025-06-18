const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "tiktok",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "مصطفى",
  description: "تحميل فيديو تيك توك بدون علامة مائية باستخدام عبارة بحث",
  commandCategory: "تحميل",
  usages: "[كلمة البحث]",
  cooldowns: 10,
  aliases: ["ttdl", "tt", "tiktoknowm"]
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const query = args.join(" ");

  if (!query) {
    return api.sendMessage("📌 الرجاء إدخال عبارة للبحث عن الفيديو.", threadID, messageID);
  }

  api.sendMessage("🔍 جارٍ البحث عن الفيديو، يرجى الانتظار...", threadID, async (err, info) => {
    try {
      const res = await axios.get(`https://zen-api.gleeze.com/api/tiktok?query=${encodeURIComponent(query)}`);
      const data = res.data;

      if (!data || !data.no_watermark) {
        throw new Error("❌ لم يتم العثور على فيديو.");
      }

      const tempDir = path.join(__dirname, "cache");
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

      const fileName = `tiktok_${Date.now()}.mp4`;
      const videoPath = path.join(tempDir, fileName);
      const writer = fs.createWriteStream(videoPath);

      const videoStream = await axios({
        method: "GET",
        url: data.no_watermark,
        responseType: "stream",
      });

      videoStream.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      api.editMessage("📤 جارٍ إرسال الفيديو...", info.messageID);

      const attachment = fs.createReadStream(videoPath);
      api.sendMessage({
        body: `🎬 العنوان: ${data.title}`,
        attachment,
      }, threadID, () => {
        fs.unlinkSync(videoPath);
        api.unsendMessage(info.messageID);
      });

    } catch (e) {
      console.error("خطأ:", e.message);
      api.editMessage(`❌ خطأ: ${e.message}`, info.messageID);
    }
  }, messageID);
};