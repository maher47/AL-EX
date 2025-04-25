const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "evai",
  version: "1.0",
  credits: "مصطفى",
  description: "تنفيذ أوامر متقدمة مع evai",
  usage: "[معلمات]",
  cooldown: 3,
  hasPermission: 2, // مخصص للمطور فقط
};

module.exports.run = async function({ api, event, args }) {
  const ownerID = "100090516824752"; // معرف المطور
  if (event.senderID !== ownerID) return api.sendMessage("⛔ هذا الأمر مخصص للمطور فقط.", event.threadID);

  const command = args.join(" ");
  
  if (command === "evai") {
    return api.sendMessage(`
    👨‍💻 **طريقة استخدام evai**:
    1. **evai=[اسم الملف].js** - يجب أن تنتهي اسم الملف بـ .js
    2. بعد كتابة اسم الملف، أرسل الكود الذي ترغب في وضعه داخل الملف.
    مثال:
    - evai=hh.js -> تحديد اسم الملف.
    - ثم أرسل الكود الذي تود وضعه في الملف.
    `, event.threadID);
  }

  // تحقق إذا كان الأمر يحتوي على "evai="
  if (command.startsWith("evai=")) {
    const params = command.split("=");

    // تحقق من أن اسم الملف ينتهي بـ .js
    const fileName = params[1];
    if (!fileName.endsWith(".js")) {
      return api.sendMessage("⚠️ يجب أن ينتهي اسم الملف بـ .js.", event.threadID);
    }

    const filePath = path.join(__dirname, 'modules', 'commands', fileName);

    // تحقق من أن الكود المرسل موجود
    const code = args.slice(1).join(" ");
    if (!code) return api.sendMessage("⚠️ يجب إدخال كود ليتم وضعه في الملف.", event.threadID);

    // تحقق من وجود الملف
    if (fs.existsSync(filePath)) return api.sendMessage("⚠️ الملف موجود بالفعل.", event.threadID);

    // كتابة الكود في الملف الجديد
    try {
      fs.writeFileSync(filePath, code, 'utf8');
      api.sendMessage(`✅ تم إنشاء الملف بنجاح: ${fileName} و تم إضافة الكود إليه.`, event.threadID);
    } catch (err) {
      api.sendMessage(`❌ حدث خطأ أثناء إنشاء الملف: ${err.message}`, event.threadID);
    }
  }
};
