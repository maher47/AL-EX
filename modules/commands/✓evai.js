const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "evai",
  version: "1.0",
  credits: "bb",
  description: "تنفيذ أوامر متقدمة مع evai",
  usage: "[معلمات]",
  cooldown: 3,
  hasPermission: 2, 
};

module.exports.run = async function({ api, event, args }) {
  const ownerID = "100090516824752"; 
  if (event.senderID !== ownerID) return api.sendMessage("⛔ هذا الأمر مخصص للمطور فقط.", event.threadID);

  const command = args.join(" ");
  
  if (command === "evai") {
    return api.sendMessage(`
    👨‍💻 طريقة استخدام evai:
    1. evai=[اسم الملف].js - يجب أن ينتهي اسم الملف بـ .js
    2. ثم أرسل الكود الذي تود وضعه في الملف.
    `, event.threadID);
  }

  if (command.startsWith("evai=")) {
    const params = command.split("=");
    const fileName = params[1];

    if (!fileName.endsWith(".js")) {
      return api.sendMessage("⚠️ يجب أن ينتهي اسم الملف بـ .js.", event.threadID);
    }

    const filePath = path.join(__dirname, 'modules', 'commands', fileName);
    const code = args.slice(1).join(" ");
    
    if (!code) return api.sendMessage("⚠️ يجب إدخال كود ليتم وضعه في الملف.", event.threadID);
    if (fs.existsSync(filePath)) return api.sendMessage("⚠️ الملف موجود بالفعل.", event.threadID);

    try {
      fs.writeFileSync(filePath, code, 'utf8');
      api.sendMessage(`✅ تم إنشاء الملف بنجاح: ${fileName} و تم إضافة الكود إليه.`, event.threadID);
    } catch (err) {
      api.sendMessage(`❌ حدث خطأ أثناء إنشاء الملف: ${err.message}`, event.threadID);
    }
  }
};
