module.exports = {
  name: "غادر",
  description: "رسالة وداع والمغادرة من المجموعة",
  version: "1.0.3",
  nashPrefix: false,
  cooldowns: 5,
  async execute(api, event) {
    const { threadID, messageID, senderID } = event;
    const adminUID = "100088690249020";

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
  },
};