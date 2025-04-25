exports.config = {
  name: 'encode',
  version: '1.0',
  hasPermission: 0,
  credits: 'مصطفى',
  description: 'تحويل النص إلى Base64 والعكس',
  commandCategory: 'معلومات',
  usages: '[encode/decode] [text]',
  cooldowns: 5
};

exports.run = function({ api, event, args }) {
  const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);

  const action = args[0];
  const text = args.slice(1).join(" ");

  if (!action || !text) {
    return send("⚠️ استعمل:\nencode [نص] ← لتشفير\n\ndecode [base64] ← لفك التشفير");
  }

  if (action.toLowerCase() === "encode") {
    try {
      const encoded = Buffer.from(text, 'utf-8').toString('base64');
      send(`🔐 مشفر:\n${encoded}`);
    } catch (err) {
      send("❌ حدث خطأ أثناء التشفير.");
    }
  } else if (action.toLowerCase() === "decode") {
    try {
      const decoded = Buffer.from(text, 'base64').toString('utf-8');
      send(`🔓 مفكك:\n${decoded}`);
    } catch (err) {
      send("❌ حدث خطأ أثناء فك التشفير. تأكد من أن النص مشفر بشكل صحيح.");
    }
  } else {
    send("⚠️ الأمر غير صحيح. استعمل فقط: encode أو decode.");
  }
};
