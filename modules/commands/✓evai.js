const crypto = require('crypto');

exports.config = {
  name: 'encode',
  version: '1.0',
  hasPermission: 0, // متاح لجميع المستخدمين
  credits: 'مصطفى',
  description: 'تحويل النص إلى Base64 والعكس',
  commandCategory: 'معلومات',
  usages: '[encode/decode] [text]',
  cooldowns: 5
};

exports.run = function(o) {
  const send = (x) => o.api.sendMessage(x, o.event.threadID, o.event.messageID);
  
  const action = o.args[0];  // إما encode أو decode
  const text = o.args.slice(1).join(" ");  // النص المطلوب تشفيره أو فك تشفيره
  
  if (!action || !text) {
    return send("⚠️ يجب إدخال إما [encode] أو [decode] ثم النص.");
  }

  if (action.toLowerCase() === "encode") {
    const encoded = Buffer.from(text).toString('base64');
    send(`🔐 النص المشفر هو: ${encoded}`);
  } else if (action.toLowerCase() === "decode") {
    try {
      const decoded = Buffer.from(text, 'base64').toString('utf-8');
      send(`🔓 النص المفكك هو: ${decoded}`);
    } catch (error) {
      send("⚠️ حدث خطأ أثناء فك التشفير. تأكد من أن النص مشفر بشكل صحيح.");
    }
  } else {
    send("⚠️ الأمر غير صحيح. استخدم [encode] أو [decode].");
  }
};
