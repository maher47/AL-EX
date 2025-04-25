exports.config = {
  name: 'encode',
  version: '1.0',
  hasPermission: 0,
  credits: 'مصطفى',
  description: 'Base64 encode/decode',
  commandCategory: 'معلومات',
  usages: 'encode/decode [text]',
  cooldowns: 5
};

exports.run = function({ api, event, args }) {
  const send = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
  
  if (args.length < 2) {
    return send("⚠️ استعمل:\nencode [نص] ← لتشفير\n\ndecode [base64] ← لفك التشفير");
  }

  const type = args[0].toLowerCase();
  const text = args.slice(1).join(" ");

  try {
    if (type === "encode") {
      const result = Buffer.from(text, 'utf8').toString('base64');
      return send(`🔐 ${result}`);
    } else if (type === "decode") {
      const result = Buffer.from(text, 'base64').toString('utf8');
      return send(`🔓 ${result}`);
    } else {
      return send("⚠️ استعمل:\nencode [نص] ← لتشفير\n\ndecode [base64] ← لفك التشفير");
    }
  } catch (e) {
    return send("⚠️ خطأ في التشفير أو فك التشفير.");
  }
};
