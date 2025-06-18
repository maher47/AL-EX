module.exports.config = {
  name: "غادر",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "مصطفى",
  description: "رسالة وداع والمغادرة من المجموعة",
  commandCategory: "إداري",
  usages: "غادر",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, senderID } = event;

  const adminUID = "61574663049668"; // ضع هنا آي دي حسابك

  if (senderID !== adminUID) {
    return api.sendMessage("❌ هذا الأمر مخصص للمطور فقط.", threadID, messageID);
  }

  const farewellText = `
حان وقت الرحيل... 💔
إلى أصدقائي الأعزاء، شكرًا على كل لحظة جميلة قضيتها معكم.
كنتم أكثر من مجرد رفقاء، كنتم عائلتي الثانية.
سأفتقدكم كثيرًا، وكل ما بيننا سيبقى في قلبي دائمًا.
إلى اللقاء، على أمل أن تجمعنا الأيام مرة أخرى. 🤍
في أمان الله
  `.trim();

  api.sendMessage(farewellText, threadID, () => {
    api.removeUserFromGroup(api.getCurrentUserID(), threadID);
  }, messageID);
};