const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "tiktok",
  description: "تحميل فيديو تيك توك بدون علامة مائية",
  nashPrefix: false,
  version: "1.0.1",
  cooldowns: 10,
  aliases: ["ttdl", "tt", "tiktoknowm"],
  async execute(api, event, args) {
    const { threadID, messageID } = event;
    const query = args.join(" ");
    if (!query) return api.sendMessage("📌 الرجاء إدخال رابط أو عبارة بحث للفيديو.", threadID, messageID);

    api.sendMessage("🔍 جاري البحث عن الفيديو...", threadID, async (err, info) => {
      try {
        const res = await axios.get(`https://zen-api.gleeze.com/api/tiktok?query=${encodeURIComponent(query)}`);
        const data = res.data;

        if (!data || !data.no_watermark) throw new Error("❌ لم يتم العثور على فيديو صالح.");

        const tempDir = path.join(__dirname, "temp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
        const fileName = `tt_${Date.now()}.mp4`;
        const videoPath = path.join(tempDir, fileName);
        const writer = fs.createWriteStream(videoPath);

        const videoStream = await axios({
          method: "GET",
          url: data.no_watermark,
          responseType: "stream"
        });

        videoStream.data.pipe(writer);
        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });

        // حذف رسالة "جارٍ التحميل"
        api.unsendMessage(info.messageID);

        const attachment = fs.createReadStream(videoPath);
        api.sendMessage({
          body: `🎬 العنوان: ${data.title}`,
          attachment
        }, threadID, () => fs.unlinkSync(videoPath));

      } catch (e) {
        console.error("TikTok Error:", e.message);
        api.unsendMessage(info.messageID);
        api.sendMessage("❌ حدث خطأ: " + e.message, threadID);
      }
    }, messageID);
  }
};