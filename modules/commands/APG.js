module.exports.config = {
  name: "eixi",
  version: "1.0.0",
  hasPermission: 2,
  credits: "💪",
  description: "تغيير البايو الخاص بحساب البوت",
  commandCategory: "تعديلات البوت",
  usages: "[النص الجديد]",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const bio = args.join(" ");

  if (!bio) return api.sendMessage("❌ اكتب البايو الجديد بعد الأمر.", threadID, messageID);

  try {
    await api.changeBio(bio);
    return api.sendMessage(`✅ تم تغيير البايو إلى:\n"${bio}"`, threadID, messageID);
  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ صرات مشكلة أثناء تغيير البايو.", threadID, messageID);
  }
};
