const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

module.exports.config = {
  name: "قص",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "مصطفى",
  description: "قص خلفية الصورة",
  commandCategory: "صور",
  usages: "رد على صورة بكلمة قص",
  cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, messageReply, senderID } = event;

  // تحقق من أن المستخدم رد على صورة
  if (
    !messageReply ||
    !messageReply.attachments ||
    messageReply.attachments.length === 0 ||
    messageReply.attachments[0].type !== "photo"
  ) {
    return api.sendMessage("📸 من فضلك رد على صورة فقط!", threadID, messageID);
  }

  // إنشاء مجلد cache إذا لم يكن موجودًا
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
  }

  // أرسل رسالة "جاري..."
  api.sendMessage("⏳ جاري قص خلفية صورة...", threadID, async (err, info) => {
    const imageUrl = messageReply.attachments[0].url;
    const imgPath = path.join(cacheDir, `${senderID}_original.png`);

    // تحميل الصورة
    const writer = fs.createWriteStream(imgPath);
    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream",
    });

    response.data.pipe(writer);

    writer.on("finish", async () => {
      const form = new FormData();
      form.append("image", fs.createReadStream(imgPath));

      try {
        // إرسال إلى API الخاص بك
        const res = await axios.post("https://cut-background.onrender.com/removebg", form, {
          headers: form.getHeaders(),
          responseType: "arraybuffer",
        });

        const outputPath = path.join(cacheDir, `${senderID}_nobg.png`);
        fs.writeFileSync(outputPath, res.data);

        // إرسال الصورة بدون خلفية
        api.sendMessage(
          {
            body: "✅ تم قص الخلفية بنجاح!",
            attachment: fs.createReadStream(outputPath),
          },
          threadID,
          () => {
            fs.unlinkSync(imgPath);
            fs.unlinkSync(outputPath);
            // حذف رسالة "جاري..." بعد الإرسال
            api.unsendMessage(info.messageID);
          }
        );
      } catch (err) {
        console.error(err.message || err);
        fs.unlinkSync(imgPath);
        return api.sendMessage("❌ حدث خطأ أثناء قص الخلفية.", threadID, messageID);
      }
    });
  });
};